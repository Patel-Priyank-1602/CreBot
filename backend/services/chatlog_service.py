from typing import Optional
from utils.supabase_client import supabase


def list_logs(
    workspace_id: str,
    search: str = "",
    chatbot_id: Optional[str] = None,
    status: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
):
    try:
        query = supabase.table("chat_logs").select("*", count="exact")
        if chatbot_id:
            query = query.eq("chatbot_id", chatbot_id)
        else:
            query = query.eq("workspace_id", workspace_id)

        if search:
            query = query.or_(f"user_question.ilike.%{search}%,bot_answer.ilike.%{search}%")
        if status:
            query = query.eq("status", status)
        if from_date:
            query = query.gte("created_at", from_date)
        if to_date:
            query = query.lte("created_at", to_date)

        result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        data = result.data
        total = result.count or 0
    except Exception:
        return [], 0

    logs = []
    for entry in data:
        bot_name = ""
        if entry.get("chatbot_id"):
            try:
                bot = supabase.table("bots").select("name").eq("id", entry["chatbot_id"]).execute()
                if bot.data:
                    bot_name = bot.data[0]["name"]
            except Exception:
                pass

        logs.append({
            "id": entry["id"],
            "workspace_id": entry["workspace_id"],
            "chatbot_id": entry["chatbot_id"],
            "chatbot_name": bot_name,
            "user_question": entry["user_question"],
            "bot_answer": entry.get("bot_answer", ""),
            "sources": entry.get("sources"),
            "status": entry.get("status", "answered"),
            "created_at": entry["created_at"],
        })

    return logs, total


def get_log(log_id: str, workspace_id: str, user_id: str):
    try:
        result = supabase.table("chat_logs").select("*").eq("id", log_id).execute()
        if not result.data:
            return None
        log = result.data[0]
        if log.get("workspace_id") == workspace_id:
            return log
        if log.get("chatbot_id"):
            from routes.bots import _get_bot_for_user
            _get_bot_for_user(log["chatbot_id"], user_id, workspace_id)
            return log
        return None
    except Exception:
        return None


def delete_log(log_id: str, workspace_id: str, user_id: str):
    log = get_log(log_id, workspace_id, user_id)
    if not log:
        return
    try:
        supabase.table("chat_logs").delete().eq("id", log_id).execute()
    except Exception:
        pass


def export_logs(workspace_id: str):
    try:
        result = supabase.table("chat_logs").select("*").eq("workspace_id", workspace_id).order("created_at", desc=True).execute()
        data = result.data
    except Exception:
        return {"logs": [], "total": 0}

    logs = []
    for entry in data:
        bot_name = ""
        if entry.get("chatbot_id"):
            try:
                bot = supabase.table("bots").select("name").eq("id", entry["chatbot_id"]).execute()
                if bot.data:
                    bot_name = bot.data[0]["name"]
            except Exception:
                pass
        logs.append({
            "id": entry["id"],
            "chatbot": bot_name,
            "question": entry["user_question"],
            "answer": entry.get("bot_answer", ""),
            "status": entry.get("status", "answered"),
            "created_at": entry["created_at"],
        })
    return {"logs": logs, "total": len(logs)}


def get_chatbots_for_filter(workspace_id: str):
    try:
        result = supabase.table("bots").select("id, name").eq("workspace_id", workspace_id).execute()
        return result.data
    except Exception:
        return []
