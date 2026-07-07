"""
CreBot Backend — Widget Chat Route
Public endpoint hit by the embedded widget. Rate-limited per IP.

Enhanced with:
- Chat history support for follow-up questions
- Question reformulation for vague queries
- General knowledge fallback
- BYOK: Uses bot owner's Groq API key if available
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
from services.settings_service import get_raw_groq_api_key
from services.rate_limiter import check_bot_rate_limit
from config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


def _get_owner_groq_key(bot_id: str) -> str | None:
    """Look up the bot owner's workspace and return their custom Groq key if any."""
    try:
        bot_result = (
            supabase.table("bots")
            .select("workspace_id")
            .eq("id", bot_id)
            .single()
            .execute()
        )
        if bot_result.data and bot_result.data.get("workspace_id"):
            return get_raw_groq_api_key(bot_result.data["workspace_id"])
    except Exception:
        pass
    return None


@router.post("/{widget_key}/chat", response_model=ChatResponse)
@limiter.limit(settings.RATE_LIMIT)
async def widget_chat(request: Request, widget_key: str, body: ChatRequest):
    """Public chat endpoint called by the widget JS (using widget_key)."""

    # 1. Look up the bot
    bot_result = (
        supabase.table("bots")
        .select("id, workspace_id")
        .eq("widget_key", widget_key)
        .single()
        .execute()
    )
    if not bot_result.data:
        raise HTTPException(status_code=404, detail="Invalid widget key.")

    bot_id = bot_result.data["id"]
    workspace_id = bot_result.data.get("workspace_id")

    # Check for owner's BYOK Groq key
    user_groq_key = _get_owner_groq_key(bot_id)

    # Convert chat history to dicts
    history = [
        {"role": m.role, "content": m.content} for m in body.chat_history
    ]

    try:
        # Enforce per-bot rate limit when using CreBot's shared key
        check_bot_rate_limit(bot_id, uses_crebot_key=(user_groq_key is None))

        # 2. Reformulate the question using chat history
        standalone_question = reformulate_question(
            body.question, history, user_groq_api_key=user_groq_key
        )

        # 3. Retrieve relevant chunks using the reformulated question
        chunks = retrieve_relevant_chunks(bot_id, standalone_question)
        chunk_texts = [c["chunk_text"] for c in chunks] if chunks else []

        # 4. Generate answer (with user's key if available)
        answer, source_type = generate_answer(
            standalone_question, chunk_texts, history,
            user_groq_api_key=user_groq_key
        )

        source_list = [
            {"name": f"Source {i + 1}", "score": round(c.get("similarity", 0), 3)}
            for i, c in enumerate(chunks[:3])
        ] if chunks else []

        # 5. Log and return
        _log_query(bot_id, workspace_id, body.question, answer, source_list)
        return ChatResponse(
            answer=answer,
            source_chunks=len(chunks),
            source_type=source_type,
        )

    except HTTPException as e:
        if e.status_code == 429:
            return ChatResponse(
                answer=(
                    "I appreciate your interest! Unfortunately, I've reached my "
                    "response limit for the moment. Please wait about a minute "
                    "and try again. Thank you for your patience! 😊"
                ),
                source_chunks=0,
                source_type="rate_limited",
            )
        raise
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
        .select("id, workspace_id")
        .eq("id", bot_id)
        .single()
        .execute()
    )
    if not bot_result.data:
        raise HTTPException(status_code=404, detail="Invalid bot ID.")

    workspace_id = bot_result.data.get("workspace_id")

    # Check for owner's BYOK Groq key
    user_groq_key = _get_owner_groq_key(bot_id)

    history = [
        {"role": m.role, "content": m.content} for m in body.chat_history
    ]

    try:
        # Enforce per-bot rate limit when using CreBot's shared key
        check_bot_rate_limit(bot_id, uses_crebot_key=(user_groq_key is None))

        standalone_question = reformulate_question(
            body.question, history, user_groq_api_key=user_groq_key
        )
        chunks = retrieve_relevant_chunks(bot_id, standalone_question)
        chunk_texts = [c["chunk_text"] for c in chunks] if chunks else []

        answer, source_type = generate_answer(
            standalone_question, chunk_texts, history,
            user_groq_api_key=user_groq_key
        )

        source_list = [
            {"name": f"Source {i + 1}", "score": round(c.get("similarity", 0), 3)}
            for i, c in enumerate(chunks[:3])
        ] if chunks else []

        _log_query(bot_id, workspace_id, body.question, answer, source_list)
        return ChatResponse(
            answer=answer,
            source_chunks=len(chunks),
            source_type=source_type,
        )

    except HTTPException as e:
        if e.status_code == 429:
            return ChatResponse(
                answer=(
                    "I appreciate your interest! Unfortunately, I've reached my "
                    "response limit for the moment. Please wait about a minute "
                    "and try again. Thank you for your patience! 😊"
                ),
                source_chunks=0,
                source_type="rate_limited",
            )
        raise
    except Exception as e:
        print(f"[Widget Chat Error] bot_id={bot_id}: {e}")
        return ChatResponse(
            answer="I'm temporarily unavailable. Please try again in a moment.",
            source_chunks=0,
            source_type="error",
        )


def _log_query(
    bot_id: str, workspace_id: str, question: str, answer: str, sources: list = None
) -> None:
    """Insert a row into chat_logs and queries_log."""
    try:
        if workspace_id:
            supabase.table("chat_logs").insert({
                "workspace_id": workspace_id,
                "chatbot_id": bot_id,
                "user_question": question,
                "bot_answer": answer,
                "sources": sources or [],
                "status": "answered",
            }).execute()

        supabase.table("queries_log").insert(
            {
                "bot_id": bot_id,
                "workspace_id": workspace_id,
                "question": question,
                "answer": answer,
                "sources": sources or [],
                "status": "answered",
            }
        ).execute()
    except Exception as e:
        print(f"[Log Error] {e}")
