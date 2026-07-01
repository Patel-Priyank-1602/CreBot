from fastapi import APIRouter, Request, Depends
from middlewares.auth import workspace_middleware
from services.embed_service import get_embed_settings, update_embed_settings, get_embed_script

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.get("/{chatbot_id}/script")
async def get_embed_script_route(request: Request, chatbot_id: str):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id
    return get_embed_script(ws_id, chatbot_id, user_id)


@router.get("/{chatbot_id}")
async def get_embed(request: Request, chatbot_id: str):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id
    return get_embed_settings(ws_id, chatbot_id, user_id)


@router.patch("/{chatbot_id}")
async def update_embed(request: Request, chatbot_id: str, data: dict):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id
    return update_embed_settings(ws_id, chatbot_id, data, user_id)
