"""
CreBot Backend — Widget Chat Route
Public endpoint hit by the embedded widget. Rate-limited per IP.

Enhanced with:
- Chat history support for follow-up questions
- Question reformulation for vague queries
- General knowledge fallback
"""

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.schemas import ChatRequest, ChatResponse
from utils.supabase_client import supabase
from services.retrieval import retrieve_relevant_chunks
from services.groq_service import (
    generate_answer,
    generate_fallback_answer,
    reformulate_question,
)
from config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/{widget_key}/chat", response_model=ChatResponse)
@limiter.limit(settings.RATE_LIMIT)
async def widget_chat(request: Request, widget_key: str, body: ChatRequest):
    """Public chat endpoint called by the widget JS (using widget_key)."""

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

    # Convert chat history to dicts
    history = [
        {"role": m.role, "content": m.content} for m in body.chat_history
    ]

    try:
        # 2. Reformulate the question using chat history
        #    Turns vague follow-ups like "when was that?" into full questions.
        standalone_question = reformulate_question(body.question, history)

        # 3. Retrieve relevant chunks using the reformulated question
        chunks = retrieve_relevant_chunks(bot_id, standalone_question)
        chunk_texts = [c["chunk_text"] for c in chunks] if chunks else []

        # 4. Generate answer (works with or without FAQ context)
        #    - If chunks found → uses FAQ context (may supplement with general knowledge)
        #    - If no chunks   → uses general knowledge directly
        answer, source_type = generate_answer(
            standalone_question, chunk_texts, history
        )

        # 5. Log and return
        _log_query(bot_id, body.question, answer, standalone_question)
        return ChatResponse(
            answer=answer,
            source_chunks=len(chunks),
            source_type=source_type,
        )

    except Exception as e:
        print(f"[Widget Chat Error] {e}")
        return ChatResponse(
            answer="I'm temporarily unavailable. Please try again in a moment.",
            source_chunks=0,
            source_type="error",
        )


@router.post("/by-bot/{bot_id}/chat", response_model=ChatResponse)
@limiter.limit(settings.RATE_LIMIT)
async def widget_chat_by_bot_id(request: Request, bot_id: str, body: ChatRequest):
    """Public chat endpoint called by the widget JS (using bot_id directly)."""

    bot_result = (
        supabase.table("bots")
        .select("id")
        .eq("id", bot_id)
        .single()
        .execute()
    )
    if not bot_result.data:
        raise HTTPException(status_code=404, detail="Invalid bot ID.")

    history = [
        {"role": m.role, "content": m.content} for m in body.chat_history
    ]

    try:
        standalone_question = reformulate_question(body.question, history)
        chunks = retrieve_relevant_chunks(bot_id, standalone_question)
        chunk_texts = [c["chunk_text"] for c in chunks] if chunks else []

        answer, source_type = generate_answer(
            standalone_question, chunk_texts, history
        )

        _log_query(bot_id, body.question, answer, standalone_question)
        return ChatResponse(
            answer=answer,
            source_chunks=len(chunks),
            source_type=source_type,
        )

    except Exception as e:
        print(f"[Widget Chat Error] bot_id={bot_id}: {e}")
        return ChatResponse(
            answer="I'm temporarily unavailable. Please try again in a moment.",
            source_chunks=0,
            source_type="error",
        )


def _log_query(
    bot_id: str, question: str, answer: str, reformulated: str = ""
) -> None:
    """Insert a row into queries_log."""
    try:
        supabase.table("queries_log").insert(
            {
                "bot_id": bot_id,
                "question": question,
                "answer": answer,
            }
        ).execute()
    except Exception as e:
        print(f"[Log Error] {e}")
