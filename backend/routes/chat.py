from fastapi import APIRouter, HTTPException, Request, Depends
from middlewares.auth import workspace_middleware
from models.schemas import DashboardChatRequest, DashboardChatResponse
from utils.supabase_client import supabase
from services.retrieval import retrieve_relevant_chunks
from services.groq_service import (
    generate_answer,
    generate_fallback_answer,
    reformulate_question,
)

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.post("/send", response_model=DashboardChatResponse)
async def dashboard_chat(request: Request, body: DashboardChatRequest):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id

    bot_result = supabase.table("bots").select("id, workspace_id, clerk_user_id").eq("id", body.bot_id).execute()
    if not bot_result.data:
        raise HTTPException(status_code=404, detail="Bot not found")
    bot = bot_result.data[0]
    
    is_authorized = str(bot.get("workspace_id")) == str(ws_id) or str(bot.get("clerk_user_id")) == str(user_id)
    if not is_authorized:
        raise HTTPException(status_code=403, detail="Access denied")

    history = [{"role": m.role, "content": m.content} for m in body.chat_history]

    try:
        standalone_question = reformulate_question(body.message, history)
        chunks = retrieve_relevant_chunks(body.bot_id, standalone_question)
        chunk_texts = [c["chunk_text"] for c in chunks] if chunks else []

        answer, source_type = generate_answer(standalone_question, chunk_texts, history)

        source_list = [
            {"name": f"Source {i + 1}", "score": round(c.get("similarity", 0), 3)}
            for i, c in enumerate(chunks[:3])
        ] if chunks else []

        _save_chat_log(ws_id, body.bot_id, body.message, answer, source_list)

        return DashboardChatResponse(
            answer=answer,
            sources=source_list,
            source_chunks=len(chunks),
            source_type=source_type,
            conversation_id="",
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Dashboard Chat Error] bot_id={body.bot_id}: {e}")
        return DashboardChatResponse(
            answer="I'm temporarily unavailable. Please try again in a moment.",
            sources=[],
            source_chunks=0,
            source_type="error",
        )


def _save_chat_log(workspace_id: str, chatbot_id: str, question: str, answer: str, sources: list):
    try:
        supabase.table("chat_logs").insert({
            "workspace_id": workspace_id,
            "chatbot_id": chatbot_id,
            "user_question": question,
            "bot_answer": answer,
            "sources": sources,
            "status": "answered",
        }).execute()
    except Exception as e:
        print(f"[Chat Log Error] {e}")
