import hashlib

from fastapi import HTTPException, Request

from utils.clerk_auth import get_clerk_user_id
from utils.supabase_client import supabase


def get_workspace_id(request: Request) -> str:
    return request.state.workspace_id


async def workspace_middleware(request: Request):
    if request.url.path.startswith("/api/widget") or request.url.path == "/":
        return

    try:
        clerk_user_id = get_clerk_user_id(request)
    except HTTPException:
        raise HTTPException(status_code=401, detail="Authentication required")

    request.state.clerk_user_id = clerk_user_id
    request.state.workspace_id = _workspace_id_from(clerk_user_id)

    try:
        result = supabase.table("workspaces").select("id, role").eq("clerk_user_id", clerk_user_id).execute()
        if result.data:
            ws = result.data[0]
            request.state.workspace_id = ws["id"]
            request.state.user_role = ws.get("role", "user")
        else:
            res = supabase.table("workspaces").insert({
                "clerk_user_id": clerk_user_id,
                "name": "My Workspace",
                "email": "",
                "role": "user",
                "plan": "free",
            }).execute()
            if res.data:
                request.state.workspace_id = res.data[0]["id"]
            request.state.user_role = "user"
    except Exception:
        print("[WARN] workspace_middleware: workspaces table unavailable — using fallback id")
        request.state.user_role = "admin"


def _workspace_id_from(clerk_user_id: str) -> str:
    return "ws_" + hashlib.sha256(clerk_user_id.encode()).hexdigest()[:16]


def require_admin(request: Request):
    if request.state.user_role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return True


def verify_workspace_access(workspace_id: str, request: Request):
    if str(workspace_id) != str(request.state.workspace_id):
        raise HTTPException(status_code=403, detail="Access denied")
