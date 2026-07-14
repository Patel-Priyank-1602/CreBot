from fastapi import APIRouter, Depends, HTTPException, Request

from middlewares.auth import workspace_middleware
from models.schemas import DashboardChatRequest, DashboardChatResponse
from services.groq_service import (
    generate_answer,
    reformulate_question,
)
from services.rate_limiter import check_bot_rate_limit
from services.retrieval import retrieve_relevant_chunks
from services.settings_service import get_raw_groq_api_key
from utils.supabase_client import supabase

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.post("/send", response_model=DashboardChatResponse)
async def dashboard_chat(request: Request, body: DashboardChatRequest):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id

    from routes.bots import _get_bot_for_user
    bot_data = _get_bot_for_user(body.bot_id, user_id, ws_id)
    is_strict = bot_data.get("strict_knowledge", True)

    history = [{"role": m.role, "content": m.content} for m in body.chat_history]

    # Check if the user has their own Groq API key
    user_groq_key = get_raw_groq_api_key(ws_id)

    try:
        # Enforce per-bot rate limit when using CreBot's shared key
        check_bot_rate_limit(body.bot_id, uses_crebot_key=(user_groq_key is None))

        standalone_question = reformulate_question(
            body.message, history, user_groq_api_key=user_groq_key
        )
        chunks = retrieve_relevant_chunks(body.bot_id, standalone_question)
        chunk_texts = [c["chunk_text"] for c in chunks] if chunks else []

        answer, source_type = generate_answer(
            standalone_question, chunk_texts, history,
            user_groq_api_key=user_groq_key,
            strict_knowledge=is_strict
        )

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
    except HTTPException as e:
        if e.status_code == 429:
            return DashboardChatResponse(
                answer=(
                    "I appreciate your interest! Unfortunately, I've reached my "
                    "response limit for the moment. Please wait about a minute "
                    "and try again. Thank you for your patience! 😊"
                ),
                sources=[],
                source_chunks=0,
                source_type="rate_limited",
            )
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
