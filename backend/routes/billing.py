from fastapi import APIRouter, Request, Depends
from middlewares.auth import workspace_middleware
from services.billing_service import get_current_billing, get_plans, upgrade_plan
from models.schemas import UpgradeRequest

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.get("/current")
async def billing_current(request: Request):
    ws_id = request.state.workspace_id
    return get_current_billing(ws_id)


@router.get("/plans")
async def billing_plans():
    return {"plans": get_plans()}


@router.post("/upgrade")
async def billing_upgrade(request: Request, body: UpgradeRequest):
    ws_id = request.state.workspace_id
    return upgrade_plan(ws_id, body.plan)
