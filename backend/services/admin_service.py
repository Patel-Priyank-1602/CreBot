from utils.supabase_client import supabase


def _workspace_ids():
    try:
        r = supabase.table("workspaces").select("id").execute()
        return [w["id"] for w in r.data]
    except Exception:
        return []


def _user_ids():
    try:
        r = supabase.table("workspaces").select("clerk_user_id").execute()
        return [w["clerk_user_id"] for w in r.data if w.get("clerk_user_id")]
    except Exception:
        return []


def _count_in(table: str, column: str, values: list) -> int:
    if not values:
        return 0
    try:
        r = supabase.table(table).select("id", count="exact").in_(column, values).execute()
        return r.count or 0
    except Exception:
        return 0


def _count_failed_knowledge_files(u_ids: list) -> int:
    if not u_ids:
        return 0
    try:
        r = supabase.table("knowledge_files").select("id", count="exact").in_("user_id", u_ids).eq("status", "failed").execute()
        return r.count or 0
    except Exception:
        return 0


def get_stats():
    ws_ids = _workspace_ids()
    u_ids = _user_ids()

    return {
        "total_users": len(ws_ids),
        "total_chatbots": _count_in("bots", "workspace_id", ws_ids),
        "total_files": _count_in("knowledge_files", "user_id", u_ids) if u_ids else 0,
        "total_queries": _count_in("chat_logs", "workspace_id", ws_ids),
        "active_workspaces": len(ws_ids),
        "failed_jobs": _count_failed_knowledge_files(u_ids) if u_ids else 0,
    }


def list_users():
    try:
        result = supabase.table("workspaces").select("*").order("created_at", desc=True).execute()
        rows = result.data
    except Exception:
        return []

    ws_ids = [w["id"] for w in rows]
    users = []
    for w in rows:
        bot_count = _count_in("bots", "workspace_id", [w["id"]])
        file_count = _count_in("knowledge_files", "user_id", [w.get("clerk_user_id", "")]) if w.get("clerk_user_id") else 0
        query_count = _count_in("chat_logs", "workspace_id", [w["id"]])

        users.append({
            "id": w["id"],
            "email": w.get("email", ""),
            "name": w.get("name", ""),
            "role": w.get("role", "user"),
            "plan": w.get("plan", "free"),
            "chatbots": bot_count,
            "files": file_count,
            "queries": query_count,
            "status": "active" if w.get("role") != "suspended" else "suspended",
            "created_at": w["created_at"],
        })
    return users


def update_user_status(workspace_id: str, action: str):
    try:
        if action == "suspend":
            supabase.table("workspaces").update({"role": "suspended"}).eq("id", workspace_id).execute()
        elif action == "activate":
            supabase.table("workspaces").update({"role": "user"}).eq("id", workspace_id).execute()
    except Exception:
        pass
    return {"success": True}
