from utils.supabase_client import supabase


def _count_with_fallback(table: str, workspace_id: str, user_id: str = "") -> int:
    count = 0
    try:
        r = supabase.table(table).select("id", count="exact").eq("workspace_id", workspace_id).execute()
        count = r.count or 0
    except Exception:
        pass
    if count == 0 and user_id:
        try:
            r = supabase.table(table).select("id", count="exact").eq("clerk_user_id", user_id).execute()
            count = r.count or 0
        except Exception:
            pass
    return count


def _query_with_fallback(table: str, columns: str, workspace_id: str, user_id: str = "", order: str = "created_at", desc: bool = True, limit: int = 10):
    try:
        q = supabase.table(table).select(columns).eq("workspace_id", workspace_id).order(order, desc=desc).limit(limit)
        return q.execute().data
    except Exception:
        pass
    if user_id:
        try:
            q = supabase.table(table).select(columns).eq("clerk_user_id", user_id).order(order, desc=desc).limit(limit)
            return q.execute().data
        except Exception:
            pass
    return []


def _count_knowledge_files(user_id: str) -> int:
    try:
        r = supabase.table("knowledge_files").select("id", count="exact").eq("user_id", user_id).execute()
        return r.count or 0
    except Exception:
        return 0


def _query_knowledge_activity(user_id: str, limit: int = 10):
    try:
        q = supabase.table("knowledge_files").select("id, original_name, created_at").eq("user_id", user_id).order("created_at", desc=True).limit(limit)
        return q.execute().data
    except Exception:
        return []


def get_overview(workspace_id: str, user_id: str = ""):
    chatbot_count = _count_with_fallback("bots", workspace_id, user_id)
    file_count = _count_knowledge_files(user_id) if user_id else 0
    chat_count = _count_with_fallback("chat_logs", workspace_id)

    storage_used = 0
    try:
        storage_result = supabase.table("knowledge_files").select("file_size").eq("user_id", user_id).execute()
        storage_used = sum(f.get("file_size", 0) for f in storage_result.data)
    except Exception:
        pass

    try:
        ws = supabase.table("workspaces").select("storage_limit, chatbot_limit").eq("id", workspace_id).execute()
        limits = ws.data[0] if ws.data else {"storage_limit": 52428800, "chatbot_limit": 5}
    except Exception:
        limits = {"storage_limit": 52428800, "chatbot_limit": 5}

    chat_distribution = []
    storage_distribution = []

    # Try to get bots by workspace_id first, then fallback to clerk_user_id
    bots = []
    try:
        bots_req = supabase.table("bots").select("id, name").eq("workspace_id", workspace_id).execute()
        bots = bots_req.data or []
    except Exception:
        pass

    if not bots and user_id:
        try:
            bots_req = supabase.table("bots").select("id, name").eq("clerk_user_id", user_id).execute()
            bots = bots_req.data or []
        except Exception:
            pass

    for bot in bots:
        # Chat distribution
        try:
            b_chat_count = supabase.table("chat_logs").select("id", count="exact").eq("chatbot_id", bot["id"]).execute()
            cc = b_chat_count.count or 0
            chat_distribution.append({"name": bot["name"], "value": cc})
        except Exception:
            chat_distribution.append({"name": bot["name"], "value": 0})

        # Storage distribution - try bot_id first, then user_id for files linked to this bot
        try:
            s_req = supabase.table("knowledge_files").select("file_size").eq("bot_id", bot["id"]).execute()
            s_sum = sum(f.get("file_size", 0) for f in s_req.data)
            storage_distribution.append({"name": bot["name"], "value": round(s_sum / 1024, 2)})
        except Exception:
            storage_distribution.append({"name": bot["name"], "value": 0})

    # If no bot-level storage found but we have overall storage, show it as "Unlinked Files"
    bot_storage_total = sum(item["value"] for item in storage_distribution)
    overall_storage_kb = round(storage_used / 1024, 2)
    if overall_storage_kb > bot_storage_total and overall_storage_kb > 0:
        storage_distribution.append({"name": "Unlinked Files", "value": round(overall_storage_kb - bot_storage_total, 2)})

    return {
        "total_chatbots": chatbot_count,
        "total_files": file_count,
        "total_conversations": chat_count,
        "storage_used": storage_used,
        "storage_limit": limits["storage_limit"],
        "chatbot_limit": limits["chatbot_limit"],
        "chat_distribution": chat_distribution,
        "storage_distribution": storage_distribution
    }


def get_activity(workspace_id: str, user_id: str = "", limit: int = 10):
    activities = []

    for row in _query_knowledge_activity(user_id, limit=limit):
        activities.append({
            "id": row["id"],
            "type": "upload",
            "description": f'Uploaded "{row["original_name"]}"',
            "created_at": row["created_at"],
        })

    for row in _query_with_fallback("bots", "id, name, created_at, updated_at", workspace_id, user_id, order="updated_at", desc=True, limit=limit):
        activities.append({
            "id": row["id"],
            "type": "bot",
            "description": f'Updated chatbot "{row["name"]}"',
            "created_at": row.get("updated_at", row["created_at"]),
        })

    for row in _query_with_fallback("chat_logs", "id, user_question, created_at", workspace_id, order="created_at", desc=True, limit=limit):
        activities.append({
            "id": row["id"],
            "type": "chat",
            "description": f'Question: "{row["user_question"][:60]}"',
            "created_at": row["created_at"],
        })

    activities.sort(key=lambda x: x["created_at"], reverse=True)
    return activities[:limit]


def get_recent_chats(workspace_id: str, limit: int = 5):
    try:
        result = (
            supabase.table("chat_logs")
            .select("id, user_question, bot_answer, status, created_at, chatbot_id")
            .eq("workspace_id", workspace_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        data = result.data
    except Exception:
        data = []

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
            "user_question": entry["user_question"],
            "bot_answer": entry.get("bot_answer", ""),
            "status": entry.get("status", "answered"),
            "chatbot_name": bot_name,
            "created_at": entry["created_at"],
        })

    return logs
