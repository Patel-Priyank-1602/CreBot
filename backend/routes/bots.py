"""
CreBot Backend — Bot Management Routes
Create bots, train with FAQ content, get embed snippets, view logs.
All routes require a valid Supabase JWT.
"""

import secrets
from fastapi import APIRouter, HTTPException, Header
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


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_user_id(authorization: str) -> str:
    """Extract and verify the user from the JWT in the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header.")

    token = authorization.replace("Bearer ", "")
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token.")
        return user_response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")


def _generate_widget_key() -> str:
    """Generate a long, random, non-guessable widget key."""
    return f"wk_{secrets.token_urlsafe(32)}"


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/", response_model=BotResponse)
async def create_bot(
    body: CreateBotRequest,
    authorization: str = Header(None),
):
    """Create a new bot. Free tier: 1 bot max."""
    user_id = _get_user_id(authorization)

    # Check free-tier bot limit
    existing = supabase.table("bots").select("id").eq("business_id", user_id).execute()
    if len(existing.data) >= 1:
        # Check plan — only free tier is limited to 1
        biz = supabase.table("businesses").select("plan_type").eq("id", user_id).single().execute()
        if biz.data and biz.data.get("plan_type") == "free":
            raise HTTPException(
                status_code=403,
                detail="Free plan allows only 1 bot. Upgrade to create more.",
            )

    widget_key = _generate_widget_key()

    result = supabase.table("bots").insert({
        "business_id": user_id,
        "name": body.name,
        "widget_key": widget_key,
    }).execute()

    bot = result.data[0]
    return BotResponse(
        id=bot["id"],
        business_id=bot["business_id"],
        name=bot["name"],
        widget_key=bot["widget_key"],
        created_at=bot["created_at"],
    )


@router.get("/", response_model=list[BotResponse])
async def list_bots(authorization: str = Header(None)):
    """List all bots owned by the authenticated business."""
    user_id = _get_user_id(authorization)

    result = supabase.table("bots").select("*").eq("business_id", user_id).execute()

    return [
        BotResponse(
            id=bot["id"],
            business_id=bot["business_id"],
            name=bot["name"],
            widget_key=bot["widget_key"],
            created_at=bot["created_at"],
        )
        for bot in result.data
    ]


@router.post("/{bot_id}/train", response_model=TrainBotResponse)
async def train_bot(
    bot_id: str,
    body: TrainBotRequest,
    authorization: str = Header(None),
):
    """
    Submit FAQ text to train the bot.
    Chunks the text, generates embeddings, and stores everything.
    """
    user_id = _get_user_id(authorization)

    # Verify ownership
    bot = supabase.table("bots").select("*").eq("id", bot_id).eq("business_id", user_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")

    # Chunk the FAQ text
    chunks = chunk_faq_text(body.faq_text)
    if not chunks:
        raise HTTPException(status_code=400, detail="FAQ text is too short or could not be chunked.")

    # Generate embeddings for all chunks
    embeddings = embed_texts(chunks)

    # Store chunks + embeddings in the documents table
    documents = [
        {
            "bot_id": bot_id,
            "chunk_text": chunk,
            "embedding": embedding,
        }
        for chunk, embedding in zip(chunks, embeddings)
    ]

    supabase.table("documents").insert(documents).execute()

    return TrainBotResponse(
        message="Bot trained successfully!",
        chunks_created=len(chunks),
    )


@router.post("/{bot_id}/retrain", response_model=TrainBotResponse)
async def retrain_bot(
    bot_id: str,
    body: TrainBotRequest,
    authorization: str = Header(None),
):
    """
    Delete all existing chunks for this bot and replace with new content.
    """
    user_id = _get_user_id(authorization)

    # Verify ownership
    bot = supabase.table("bots").select("*").eq("id", bot_id).eq("business_id", user_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")

    # Delete existing documents
    supabase.table("documents").delete().eq("bot_id", bot_id).execute()

    # Chunk the new FAQ text
    chunks = chunk_faq_text(body.faq_text)
    if not chunks:
        raise HTTPException(status_code=400, detail="FAQ text is too short or could not be chunked.")

    # Generate embeddings
    embeddings = embed_texts(chunks)

    # Store
    documents = [
        {
            "bot_id": bot_id,
            "chunk_text": chunk,
            "embedding": embedding,
        }
        for chunk, embedding in zip(chunks, embeddings)
    ]

    supabase.table("documents").insert(documents).execute()

    return TrainBotResponse(
        message="Bot retrained successfully! Old content replaced.",
        chunks_created=len(chunks),
    )


@router.get("/{bot_id}/embed-snippet", response_model=EmbedSnippetResponse)
async def get_embed_snippet(
    bot_id: str,
    authorization: str = Header(None),
):
    """Return the JavaScript embed snippet for this bot."""
    user_id = _get_user_id(authorization)

    bot = supabase.table("bots").select("widget_key").eq("id", bot_id).eq("business_id", user_id).single().execute()
    if not bot.data:
        raise HTTPException(status_code=404, detail="Bot not found.")

    widget_key = bot.data["widget_key"]

    # The snippet points to wherever the backend is hosted
    snippet = f"""<!-- CreBot Chat Widget -->
<script
  src="{settings.FRONTEND_URL}/widget/crebot-widget.js"
  data-widget-key="{widget_key}"
  data-api-url="YOUR_BACKEND_URL"
  async>
</script>"""

    return EmbedSnippetResponse(snippet=snippet, widget_key=widget_key)


@router.get("/{bot_id}/logs", response_model=QueryLogsResponse)
async def get_query_logs(
    bot_id: str,
    authorization: str = Header(None),
):
    """Return the query log for this bot."""
    user_id = _get_user_id(authorization)

    # Verify ownership
    bot = supabase.table("bots").select("id").eq("id", bot_id).eq("business_id", user_id).single().execute()
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
