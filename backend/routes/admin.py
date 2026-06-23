from fastapi import APIRouter, Request, Depends
from middlewares.auth import workspace_middleware, require_admin
from services.admin_service import get_stats, list_users, update_user_status
from models.schemas import UpdateUserStatusRequest

router = APIRouter(dependencies=[Depends(workspace_middleware), Depends(require_admin)])


@router.get("/stats")
async def admin_stats(request: Request):
    return get_stats()


@router.get("/users")
async def admin_users(request: Request):
    return {"users": list_users()}


@router.patch("/users/{workspace_id}/status")
async def admin_update_user_status(request: Request, workspace_id: str, body: UpdateUserStatusRequest):
    return update_user_status(workspace_id, body.action)
