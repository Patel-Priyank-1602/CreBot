from fastapi import APIRouter, Depends, Request

from middlewares.auth import workspace_middleware
from models.schemas import DashboardOverviewResponse
from services.dashboard_service import get_activity, get_overview, get_recent_chats

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.get("/combined")
async def dashboard_combined(request: Request):
    """Return overview + activity + recent chats in a single request to reduce round-trips."""
    ws_id = request.state.workspace_id
    uid = getattr(request.state, "clerk_user_id", "")
    return {
        "overview": get_overview(ws_id, uid),
        "activities": get_activity(ws_id, uid),
        "chats": get_recent_chats(ws_id),
    }


@router.get("/overview", response_model=DashboardOverviewResponse)
async def dashboard_overview(request: Request):
    ws_id = request.state.workspace_id
    uid = getattr(request.state, "clerk_user_id", "")
    return get_overview(ws_id, uid)


@router.get("/activity")
async def dashboard_activity(request: Request, limit: int = 100):
    ws_id = request.state.workspace_id
    uid = getattr(request.state, "clerk_user_id", "")
    activities = get_activity(ws_id, uid, limit=limit)
    return {"activities": activities}


@router.get("/recent-chats")
async def dashboard_recent_chats(request: Request, limit: int = 100):
    ws_id = request.state.workspace_id
    chats = get_recent_chats(ws_id, limit=limit)
    return {"chats": chats}
