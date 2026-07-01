import secrets
import hashlib
from datetime import datetime, timezone
from utils.supabase_client import supabase
from fastapi import HTTPException


def get_workspace_settings(workspace_id: str):
    try:
        result = supabase.table("workspaces").select("*").eq("id", workspace_id).execute()
        if result.data:
            w = result.data[0]
            return {
                "id": w["id"],
                "name": w["name"],
                "email": w.get("email", ""),
                "role": w.get("role", "user"),
                "plan": w.get("plan", "free"),
                "chatbot_limit": w.get("chatbot_limit", 3),
                "storage_limit": w.get("storage_limit", 52428800),
                "created_at": w["created_at"],
                "updated_at": w.get("updated_at", w["created_at"]),
            }
    except Exception:
        pass
    return {
        "id": workspace_id,
        "name": "My Workspace",
        "email": "",
        "role": "user",
        "plan": "free",
        "chatbot_limit": 5,
        "storage_limit": 52428800,
        "created_at": "",
        "updated_at": "",
    }


def update_workspace_settings(workspace_id: str, data: dict):
    update = {}
    if "name" in data:
        update["name"] = data["name"]
    if update:
        update["updated_at"] = datetime.now(timezone.utc).isoformat()
        try:
            supabase.table("workspaces").update(update).eq("id", workspace_id).execute()
        except Exception:
            pass
    return get_workspace_settings(workspace_id)


def list_api_keys(workspace_id: str):
    try:
        result = supabase.table("api_keys").select("*").eq("workspace_id", workspace_id).order("created_at", desc=True).execute()
        data = result.data
    except Exception:
        return []
    return [
        {
            "id": k["id"],
            "key_preview": k["key_preview"],
            "created_at": k["created_at"],
            "last_used_at": k.get("last_used_at"),
            "status": k.get("status", "active"),
        }
        for k in data
    ]


def create_api_key(workspace_id: str):
    raw_key = f"cb_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_preview = raw_key[:12] + "..."

    try:
        result = supabase.table("api_keys").insert({
            "workspace_id": workspace_id,
            "key_hash": key_hash,
            "key_preview": key_preview,
            "status": "active",
        }).execute()
        k = result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create API key: " + str(e))

    return {
        "id": k["id"],
        "key_preview": k["key_preview"],
        "full_key": raw_key,
        "created_at": k["created_at"],
    }


def revoke_api_key(key_id: str, workspace_id: str):
    try:
        supabase.table("api_keys").update({"status": "revoked"}).eq("id", key_id).eq("workspace_id", workspace_id).execute()
    except Exception:
        pass


def export_workspace_data(workspace_id: str):
    bots_data = []
    files_data = []
    logs_data = []
    ws_data = None
    try:
        bots_data = supabase.table("bots").select("*").eq("workspace_id", workspace_id).execute().data
    except Exception:
        pass
    try:
        uid = ""
        ws_res = supabase.table("workspaces").select("clerk_user_id").eq("id", workspace_id).execute()
        if ws_res.data:
            uid = ws_res.data[0].get("clerk_user_id", "")
        if uid:
            files_data = supabase.table("knowledge_files").select("*").eq("user_id", uid).execute().data
    except Exception:
        pass
    try:
        logs_data = supabase.table("chat_logs").select("*").eq("workspace_id", workspace_id).order("created_at", desc=True).limit(500).execute().data
    except Exception:
        pass
    try:
        ws = supabase.table("workspaces").select("*").eq("id", workspace_id).execute()
        if ws.data:
            ws_data = ws.data[0]
    except Exception:
        pass

    return {
        "workspace": ws_data,
        "bots": bots_data,
        "files": files_data,
        "recent_logs": logs_data,
    }
