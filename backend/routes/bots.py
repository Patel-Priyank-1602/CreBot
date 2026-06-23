import secrets
import time
from fastapi import APIRouter, HTTPException, Request, Depends
from middlewares.auth import workspace_middleware
from models.schemas import (
    CreateBotRequest,
    UpdateBotRequest,
    AddMemberRequest,
    BotResponse,
    TrainBotRequest,
    TrainBotResponse,
    EmbedSnippetResponse,
    QueryLogsResponse,
    QueryLogEntry,
    BotMemberResponse,
)
from utils.supabase_client import supabase
from utils.clerk_auth import get_clerk_user_id
from services.chunking import chunk_faq_text
from services.embedding import embed_texts
from config import settings

router = APIRouter(dependencies=[Depends(workspace_middleware)])

INSERT_BATCH_SIZE = 3
MAX_RETRIES = 3


def _generate_widget_key() -> str:
    return f"wk_{secrets.token_urlsafe(32)}"


def _batch_insert_documents(documents: list[dict]) -> None:
    for i in range(0, len(documents), INSERT_BATCH_SIZE):
        batch = documents[i : i + INSERT_BATCH_SIZE]
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                supabase.table("documents").insert(batch).execute()
                break
            except Exception as e:
                print(f"[Insert Batch] Attempt {attempt}/{MAX_RETRIES} failed for batch {i // INSERT_BATCH_SIZE + 1}: {e}")
                if attempt == MAX_RETRIES:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to save documents after {MAX_RETRIES} attempts. Please try again."
                    )
                time.sleep(1 * attempt)


def _format_bot(bot: dict, is_owner: bool = True) -> BotResponse:
    return BotResponse(
        id=bot["id"],
        name=bot["name"],
        widget_key=bot["widget_key"],
        created_at=bot["created_at"],
        is_owner=is_owner,
        status=bot.get("status", "active"),
        description=bot.get("description", ""),
        total_files=bot.get("total_files", 0),
        total_chats=bot.get("total_chats", 0),
        embed_id=bot.get("embed_id") or bot.get("widget_key", ""),
        allowed_domains=bot.get("allowed_domains", []),
        welcome_message=bot.get("welcome_message", "Hi! How can I help you today?"),
        theme=bot.get("theme", "dark"),
        position=bot.get("position", "bottom-right"),
        updated_at=bot.get("updated_at", ""),
    )


def _get_bot_for_user(bot_id: str, user_id: str, workspace_id: str, require_owner: bool = False):
    try:
        bot = supabase.table("bots").select("*").eq("id", bot_id).execute()
        if not bot.data:
            raise HTTPException(status_code=404, detail="Bot not found.")
        bot_data = bot.data[0]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Bot not found.")

    is_owner = bot_data.get("clerk_user_id") == user_id

    bot_ws = bot_data.get("workspace_id")
    if bot_ws and str(bot_ws) != str(workspace_id):
        raise HTTPException(status_code=403, detail="Access denied.")

    if is_owner:
        return bot_data

    if require_owner:
        raise HTTPException(status_code=403, detail="Only the owner can perform this action.")

    try:
        member = supabase.table("bot_members").select("*").eq("bot_id", bot_id).eq("clerk_user_id", user_id).execute()
        if not member.data:
            raise HTTPException(status_code=403, detail="Access denied. You are not a member of this bot.")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=403, detail="Access denied. You are not a member of this bot.")

    return bot_data


@router.post("/", response_model=BotResponse)
async def create_bot(request: Request, body: CreateBotRequest):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id

    try:
        ws = supabase.table("workspaces").select("plan, chatbot_limit").eq("id", ws_id).execute()
        plan = ws.data[0] if ws.data else {"plan": "free", "chatbot_limit": 5}
    except Exception:
        plan = {"plan": "free", "chatbot_limit": 5}

    try:
        bot_count = supabase.table("bots").select("id", count="exact").eq("workspace_id", ws_id).execute()
        current_count = bot_count.count or 0
    except Exception:
        current_count = 0

    if current_count == 0:
        try:
            r = supabase.table("bots").select("id", count="exact").eq("clerk_user_id", user_id).execute()
            current_count = r.count or 0
        except Exception:
            current_count = 0

    limits = {"free": 5, "starter": 3, "pro": 10, "enterprise": 999999}
    limit = limits.get(plan.get("plan", "free"), 5)

    if current_count >= limit:
        raise HTTPException(status_code=403, detail=f"You have reached the free plan limit of {limit} chatbots. Upgrade your plan to create more.")

    widget_key = _generate_widget_key()
    result = supabase.table("bots").insert({
        "name": body.name,
        "widget_key": widget_key,
        "clerk_user_id": user_id,
    }).execute()
    bot = result.data[0]

    # Best-effort: set columns that may not exist yet (pre-migration)
    try:
        supabase.table("bots").update({
            "workspace_id": ws_id,
            "embed_id": widget_key,
        }).eq("id", bot["id"]).execute()
    except Exception:
        pass

    bot = result.data[0]
    return _format_bot(bot)


@router.get("/", response_model=list[BotResponse])
async def list_bots(request: Request):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id

    owned_bots = []
    try:
        owned_result = supabase.table("bots").select("*").eq("workspace_id", ws_id).execute()
        owned_bots = [_format_bot(bot, is_owner=True) for bot in owned_result.data]
        
        # Fallback for legacy bots that might not have a workspace_id yet
        if not owned_bots:
            fallback_result = supabase.table("bots").select("*").eq("clerk_user_id", user_id).execute()
            owned_bots = [_format_bot(bot, is_owner=True) for bot in fallback_result.data]
    except Exception:
        pass

    member_bots = []
    try:
        member_result = supabase.table("bot_members").select("bot_id").eq("clerk_user_id", user_id).execute()
        member_bot_ids = [m["bot_id"] for m in member_result.data]
        if member_bot_ids:
            shared_result = supabase.table("bots").select("*").in_("id", member_bot_ids).execute()
            member_bots = [_format_bot(bot, is_owner=False) for bot in shared_result.data]
    except Exception:
        pass

    return owned_bots + member_bots


@router.get("/{bot_id}", response_model=BotResponse)
async def get_bot(request: Request, bot_id: str):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    bot_data = _get_bot_for_user(bot_id, user_id, ws_id)
    is_owner = bot_data.get("clerk_user_id") == user_id
    return _format_bot(bot_data, is_owner)


@router.patch("/{bot_id}", response_model=BotResponse)
async def update_bot(request: Request, bot_id: str, body: UpdateBotRequest):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id, require_owner=True)

    update = body.model_dump(exclude_none=True)
    if update:
        update["updated_at"] = "now()"
        try:
            supabase.table("bots").update(update).eq("id", bot_id).execute()
        except Exception:
            pass

    try:
        bot_data = supabase.table("bots").select("*").eq("id", bot_id).execute().data[0]
    except Exception:
        raise HTTPException(status_code=404, detail="Bot not found after update.")
    return _format_bot(bot_data)


@router.post("/{bot_id}/train", response_model=TrainBotResponse)
async def train_bot(request: Request, bot_id: str, body: TrainBotRequest):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id)

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
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id)

    try:
        supabase.table("documents").delete().eq("bot_id", bot_id).execute()
    except Exception:
        pass

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
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    bot = _get_bot_for_user(bot_id, user_id, ws_id)

    widget_key = bot["widget_key"]
    snippet = f"""<!-- CreBot Chat Widget -->
<script
  src="{settings.FRONTEND_URL}/widget/crebot-widget.js"
  data-bot-id="{bot_id}"
  data-api-url="{settings.FRONTEND_URL}"
  async>
</script>"""

    return EmbedSnippetResponse(snippet=snippet, widget_key=widget_key)


@router.get("/{bot_id}/logs", response_model=QueryLogsResponse)
async def get_query_logs(request: Request, bot_id: str):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id)

    try:
        result = (
            supabase.table("queries_log")
            .select("*")
            .eq("bot_id", bot_id)
            .order("created_at", desc=True)
            .limit(100)
            .execute()
        )
        data = result.data
    except Exception:
        data = []

    logs = [
        QueryLogEntry(
            id=log["id"],
            question=log["question"],
            answer=log.get("answer"),
            created_at=log["created_at"],
            status=log.get("status", "answered"),
        )
        for log in data
    ]

    return QueryLogsResponse(bot_id=bot_id, logs=logs, total=len(logs))


@router.delete("/{bot_id}")
async def delete_bot(request: Request, bot_id: str):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id, require_owner=True)

    try:
        supabase.table("bots").delete().eq("id", bot_id).execute()
    except Exception:
        pass
    return {"message": "Bot deleted successfully."}


@router.get("/{bot_id}/members", response_model=list[BotMemberResponse])
async def list_bot_members(request: Request, bot_id: str):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id, require_owner=True)

    try:
        result = supabase.table("bot_members").select("*").eq("bot_id", bot_id).execute()
        data = result.data
    except Exception:
        data = []
    return [
        BotMemberResponse(
            id=m["id"],
            bot_id=m["bot_id"],
            clerk_user_id=m.get("clerk_user_id"),
            member_email=m.get("member_email"),
            joined_at=m["joined_at"],
        )
        for m in data
    ]


@router.delete("/{bot_id}/members/{member_id}")
async def remove_bot_member(request: Request, bot_id: str, member_id: str):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id, require_owner=True)

    try:
        supabase.table("bot_members").delete().eq("id", member_id).eq("bot_id", bot_id).execute()
    except Exception:
        pass
    return {"message": "Member removed successfully."}


@router.post("/{bot_id}/members/add", response_model=BotMemberResponse)
async def add_bot_member(request: Request, bot_id: str, body: AddMemberRequest):
    user_id = get_clerk_user_id(request)
    ws_id = request.state.workspace_id
    _get_bot_for_user(bot_id, user_id, ws_id, require_owner=True)

    try:
        existing = supabase.table("bot_members").select("*").eq("bot_id", bot_id).eq("member_email", body.email).execute()
        if existing.data:
            raise HTTPException(status_code=409, detail="This email is already a member of this bot.")
    except HTTPException:
        raise
    except Exception:
        pass

    try:
        result = supabase.table("bot_members").insert({
            "bot_id": bot_id,
            "member_email": body.email,
        }).execute()
        member = result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add member: {str(e)}")

    return BotMemberResponse(
        id=member["id"],
        bot_id=member["bot_id"],
        clerk_user_id=member.get("clerk_user_id"),
        member_email=member["member_email"],
        joined_at=member["joined_at"],
    )
