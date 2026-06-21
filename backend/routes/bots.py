"""
CreBot Backend — Bot Management Routes
Create bots, train with FAQ content, get embed snippets, view logs.
Protected with Clerk JWT authentication.
"""

import secrets
import time
from fastapi import APIRouter, HTTPException, Request
from models.schemas import (
    CreateBotRequest,
    BotResponse,
    TrainBotRequest,
    TrainBotResponse,
    EmbedSnippetResponse,
    QueryLogsResponse,
    QueryLogEntry,
)
from utils.supabase_client import supabase
from utils.clerk_auth import get_clerk_user_id
from services.chunking import chunk_faq_text
from services.embedding import embed_texts
from config import settings

router = APIRouter()

# Batch size for document inserts (avoids HTTP/2 SSL errors on large payloads)
INSERT_BATCH_SIZE = 3
MAX_RETRIES = 3


def _generate_widget_key() -> str:
    """Generate a long, random, non-guessable widget key."""
    return f"wk_{secrets.token_urlsafe(32)}"


def _batch_insert_documents(documents: list[dict]) -> None:
    """
    Insert documents into Supabase in small batches with retry logic.
    Avoids HTTP/2 SSL EOF errors that occur with large single inserts.
    """
    for i in range(0, len(documents), INSERT_BATCH_SIZE):
        batch = documents[i : i + INSERT_BATCH_SIZE]
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                supabase.table("documents").insert(batch).execute()
                break  # Success — move to next batch
            except Exception as e:
                print(f"[Insert Batch] Attempt {attempt}/{MAX_RETRIES} failed for batch {i // INSERT_BATCH_SIZE + 1}: {e}")
                if attempt == MAX_RETRIES:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to save documents after {MAX_RETRIES} attempts. Please try again."
                    )
                time.sleep(1 * attempt)  # Exponential-ish backoff


@router.post("/", response_model=BotResponse)
async def create_bot(request: Request, body: CreateBotRequest):
    """Create a new bot for the authenticated user."""
    user_id = get_clerk_user_id(request)

    widget_key = _generate_widget_key()

    result = supabase.table("bots").insert({
        "name": body.name,
        "widget_key": widget_key,
        "clerk_user_id": user_id,
    }).execute()

    bot = result.data[0]
    return BotResponse(
        id=bot["id"],
        name=bot["name"],
        widget_key=bot["widget_key"],
        created_at=bot["created_at"],
    )


@router.get("/", response_model=list[BotResponse])
async def list_bots(request: Request):
    """List all bots for the authenticated user."""
    user_id = get_clerk_user_id(request)

    result = supabase.table("bots").select("*").eq("clerk_user_id", user_id).execute()

    return [
        BotResponse(
            id=bot["id"],
            name=bot["name"],
            widget_key=bot["widget_key"],
            created_at=bot["created_at"],
        )
        for bot in result.data
    ]


def _get_bot_for_user(bot_id: str, user_id: str):
    """Fetch a bot and verify it belongs to the authenticated user."""
    bot = supabase.table("bots").select("*").eq("id", bot_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")
    if bot.data.get("clerk_user_id") and bot.data["clerk_user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied.")
    return bot.data


@router.post("/{bot_id}/train", response_model=TrainBotResponse)
async def train_bot(request: Request, bot_id: str, body: TrainBotRequest):
    """
    Submit FAQ text to train the bot.
    """
    user_id = get_clerk_user_id(request)
    _get_bot_for_user(bot_id, user_id)

    chunks = chunk_faq_text(body.faq_text)
    if not chunks:
        raise HTTPException(status_code=400, detail="FAQ text is too short.")

    embeddings = embed_texts(chunks)

    documents = [
        {"bot_id": bot_id, "chunk_text": chunk, "embedding": embedding}
        for chunk, embedding in zip(chunks, embeddings)
    ]

    _batch_insert_documents(documents)

    return TrainBotResponse(
        message="Bot trained successfully!",
        chunks_created=len(chunks),
    )


@router.post("/{bot_id}/retrain", response_model=TrainBotResponse)
async def retrain_bot(request: Request, bot_id: str, body: TrainBotRequest):
    """
    Delete all existing chunks for this bot and replace with new content.
    """
    user_id = get_clerk_user_id(request)
    _get_bot_for_user(bot_id, user_id)

    supabase.table("documents").delete().eq("bot_id", bot_id).execute()

    chunks = chunk_faq_text(body.faq_text)
    if not chunks:
        raise HTTPException(status_code=400, detail="FAQ text is too short.")

    embeddings = embed_texts(chunks)

    documents = [
        {"bot_id": bot_id, "chunk_text": chunk, "embedding": embedding}
        for chunk, embedding in zip(chunks, embeddings)
    ]

    _batch_insert_documents(documents)

    return TrainBotResponse(
        message="Bot retrained successfully!",
        chunks_created=len(chunks),
    )


@router.get("/{bot_id}/embed-snippet", response_model=EmbedSnippetResponse)
async def get_embed_snippet(request: Request, bot_id: str):
    """Return the JavaScript embed snippet for this bot."""
    user_id = get_clerk_user_id(request)
    bot = _get_bot_for_user(bot_id, user_id)

    widget_key = bot["widget_key"]

    snippet = f"""<!-- CreBot Chat Widget -->
<script
  src="{settings.FRONTEND_URL}/widget/crebot-widget.js"
  data-widget-key="{widget_key}"
  data-api-url="YOUR_BACKEND_URL"
  async>
</script>"""

    return EmbedSnippetResponse(snippet=snippet, widget_key=widget_key)


@router.get("/{bot_id}/logs", response_model=QueryLogsResponse)
async def get_query_logs(request: Request, bot_id: str):
    """Return the query log for this bot."""
    user_id = get_clerk_user_id(request)
    _get_bot_for_user(bot_id, user_id)

    result = (
        supabase.table("queries_log")
        .select("*")
        .eq("bot_id", bot_id)
        .order("created_at", desc=True)
        .limit(100)
        .execute()
    )

    logs = [
        QueryLogEntry(
            id=log["id"],
            question=log["question"],
            answer=log.get("answer"),
            created_at=log["created_at"],
        )
        for log in result.data
    ]

    return QueryLogsResponse(bot_id=bot_id, logs=logs, total=len(logs))
