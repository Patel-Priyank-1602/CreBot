from datetime import datetime, timezone
from utils.supabase_client import supabase


PLANS = {
    "free": {"name": "Free", "price": 0, "chatbots": 5, "storage": 52428800, "queries": 500},
    "starter": {"name": "Starter", "price": 29, "chatbots": 5, "storage": 52428800, "queries": 1000},
    "pro": {"name": "Pro", "price": 79, "chatbots": 10, "storage": 524288000, "queries": 10000},
    "enterprise": {"name": "Enterprise", "price": 199, "chatbots": 999999, "storage": 5368709120, "queries": 999999999},
}


def get_current_billing(workspace_id: str):
    try:
        ws = supabase.table("workspaces").select("*").eq("id", workspace_id).execute()
        w = ws.data[0] if ws.data else None
    except Exception:
        w = None

    if not w:
        return {
            "plan": "free",
            "price": 0,
            "chatbot_limit": 5,
            "storage_limit": 52428800,
            "query_limit": 500,
            "used_chatbots": 0,
            "used_storage": 0,
            "used_queries": 0,
            "billing_status": "active",
            "current_period_start": "",
            "current_period_end": "",
        }

    plan_name = w.get("plan", "free")
    plan = PLANS.get(plan_name, PLANS["free"])

    try:
        chatbot_count = supabase.table("bots").select("id", count="exact").eq("workspace_id", workspace_id).execute()
        used_chatbots = chatbot_count.count or 0
    except Exception:
        used_chatbots = 0

    used_storage = 0
    try:
        ws = supabase.table("workspaces").select("clerk_user_id").eq("id", workspace_id).execute()
        uid = ws.data[0]["clerk_user_id"] if ws.data else None
        if uid:
            file_count = supabase.table("knowledge_files").select("file_size").eq("user_id", uid).execute()
            used_storage = sum(f.get("file_size", 0) for f in file_count.data)
    except Exception:
        pass

    try:
        chat_count = supabase.table("chat_logs").select("id", count="exact").eq("workspace_id", workspace_id).execute()
        used_queries = chat_count.count or 0
    except Exception:
        used_queries = 0

    return {
        "plan": plan_name,
        "price": plan["price"],
        "chatbot_limit": plan["chatbots"],
        "storage_limit": plan["storage"],
        "query_limit": plan["queries"],
        "used_chatbots": used_chatbots,
        "used_storage": used_storage,
        "used_queries": used_queries,
        "billing_status": "active",
        "current_period_start": w.get("created_at", ""),
        "current_period_end": "",
    }


def get_plans():
    return [
        {"name": "Starter", "price": 29, "chatbots": 5, "storage": 52428800, "queries": 1000},
        {"name": "Pro", "price": 79, "chatbots": 10, "storage": 524288000, "queries": 10000},
        {"name": "Enterprise", "price": 199, "chatbots": 999999, "storage": 5368709120, "queries": 999999999},
    ]


def upgrade_plan(workspace_id: str, plan: str):
    if plan not in PLANS:
        return {"success": False, "message": "Invalid plan"}

    try:
        supabase.table("workspaces").update({"plan": plan, "updated_at": datetime.now(timezone.utc).isoformat()}).eq("id", workspace_id).execute()
    except Exception:
        pass
    return {"success": True, "message": f"Upgraded to {PLANS[plan]['name']} plan"}
