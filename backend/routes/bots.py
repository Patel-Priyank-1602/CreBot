"""
CreBot Backend — Bot Management Routes
Create bots, train with FAQ content, get embed snippets, view logs.
No auth version.
"""

import secrets
from fastapi import APIRouter, HTTPException
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
from services.chunking import chunk_faq_text
from services.embedding import embed_texts
from config import settings

router = APIRouter()


def _generate_widget_key() -> str:
    """Generate a long, random, non-guessable widget key."""
    return f"wk_{secrets.token_urlsafe(32)}"


@router.post("/", response_model=BotResponse)
async def create_bot(body: CreateBotRequest):
    """Create a new bot."""
    widget_key = _generate_widget_key()

    result = supabase.table("bots").insert({
        "name": body.name,
        "widget_key": widget_key,
    }).execute()

    bot = result.data[0]
    return BotResponse(
        id=bot["id"],
        name=bot["name"],
        widget_key=bot["widget_key"],
        created_at=bot["created_at"],
    )


@router.get("/", response_model=list[BotResponse])
async def list_bots():
    """List all bots."""
    result = supabase.table("bots").select("*").execute()

    return [
        BotResponse(
            id=bot["id"],
            name=bot["name"],
            widget_key=bot["widget_key"],
            created_at=bot["created_at"],
        )
        for bot in result.data
    ]


@router.post("/{bot_id}/train", response_model=TrainBotResponse)
async def train_bot(bot_id: str, body: TrainBotRequest):
    """
    Submit FAQ text to train the bot.
    """
    bot = supabase.table("bots").select("*").eq("id", bot_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")

    chunks = chunk_faq_text(body.faq_text)
    if not chunks:
        raise HTTPException(status_code=400, detail="FAQ text is too short.")

    embeddings = embed_texts(chunks)

    documents = [
        {"bot_id": bot_id, "chunk_text": chunk, "embedding": embedding}
        for chunk, embedding in zip(chunks, embeddings)
    ]

    supabase.table("documents").insert(documents).execute()

    return TrainBotResponse(
        message="Bot trained successfully!",
        chunks_created=len(chunks),
    )


@router.post("/{bot_id}/retrain", response_model=TrainBotResponse)
async def retrain_bot(bot_id: str, body: TrainBotRequest):
    """
    Delete all existing chunks for this bot and replace with new content.
    """
    bot = supabase.table("bots").select("*").eq("id", bot_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")

    supabase.table("documents").delete().eq("bot_id", bot_id).execute()

    chunks = chunk_faq_text(body.faq_text)
    if not chunks:
        raise HTTPException(status_code=400, detail="FAQ text is too short.")

    embeddings = embed_texts(chunks)

    documents = [
        {"bot_id": bot_id, "chunk_text": chunk, "embedding": embedding}
        for chunk, embedding in zip(chunks, embeddings)
    ]

    supabase.table("documents").insert(documents).execute()

    return TrainBotResponse(
        message="Bot retrained successfully!",
        chunks_created=len(chunks),
    )


@router.get("/{bot_id}/embed-snippet", response_model=EmbedSnippetResponse)
async def get_embed_snippet(bot_id: str):
    """Return the JavaScript embed snippet for this bot."""
    bot = supabase.table("bots").select("widget_key").eq("id", bot_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")

    widget_key = bot.data["widget_key"]

    snippet = f"""<!-- CreBot Chat Widget -->
<script
  src="{settings.FRONTEND_URL}/widget/crebot-widget.js"
  data-widget-key="{widget_key}"
  data-api-url="YOUR_BACKEND_URL"
  async>
</script>"""

    return EmbedSnippetResponse(snippet=snippet, widget_key=widget_key)


@router.get("/{bot_id}/logs", response_model=QueryLogsResponse)
async def get_query_logs(bot_id: str):
    """Return the query log for this bot."""
    bot = supabase.table("bots").select("id").eq("id", bot_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")

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
