"""
CreBot Backend — Widget Chat Route
Public endpoint that visitors hit from the embedded widget.
Rate-limited per IP to protect free-tier quotas.
"""

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.schemas import ChatRequest, ChatResponse
from utils.supabase_client import supabase
from services.retrieval import retrieve_relevant_chunks
from services.groq_service import generate_answer, generate_fallback_answer
from config import settings

router = APIRouter()

limiter = Limiter(key_func=get_remote_address)


@router.post("/{widget_key}/chat", response_model=ChatResponse)
@limiter.limit(settings.RATE_LIMIT)
async def widget_chat(
    request: Request,
    widget_key: str,
    body: ChatRequest,
):
    """
    Public chat endpoint called by the widget JS.

    Flow:
    1. Look up bot by widget key
    2. Retrieve relevant FAQ chunks via vector search
    3. If no relevant chunks → return fallback (no Groq call)
    4. Otherwise → send to Groq for answer generation
    5. Log the exchange
    6. Return the answer
    """
    # 1. Look up the bot
    bot_result = (
        supabase.table("bots")
        .select("id")
        .eq("widget_key", widget_key)
        .single()
        .execute()
    )

    if not bot_result.data:
        raise HTTPException(status_code=404, detail="Invalid widget key.")

    bot_id = bot_result.data["id"]

    try:
        # 2. Retrieve relevant chunks
        chunks = retrieve_relevant_chunks(bot_id, body.question)

        # 3. No relevant chunks → fallback
        if not chunks:
            fallback = generate_fallback_answer()
            _log_query(bot_id, body.question, fallback)
            return ChatResponse(answer=fallback, source_chunks=0)

        # 4. Generate answer with Groq
        chunk_texts = [c["chunk_text"] for c in chunks]
        answer = generate_answer(body.question, chunk_texts)

        # 5. Log the exchange
        _log_query(bot_id, body.question, answer)

        # 6. Return
        return ChatResponse(answer=answer, source_chunks=len(chunks))

    except Exception as e:
        print(f"[Widget Chat Error] {e}")
        # Graceful degradation — never expose internal errors to the widget
        return ChatResponse(
            answer="I'm temporarily unavailable. Please try again in a moment.",
            source_chunks=0,
        )


def _log_query(bot_id: str, question: str, answer: str) -> None:
    """Insert a row into queries_log (fire-and-forget)."""
    try:
        supabase.table("queries_log").insert({
            "bot_id": bot_id,
            "question": question,
            "answer": answer,
        }).execute()
    except Exception as e:
        # Logging failure should never break the user-facing chat
        print(f"[Log Error] Failed to log query: {e}")
