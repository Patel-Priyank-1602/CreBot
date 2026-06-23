from fastapi import APIRouter, Request, Depends
from middlewares.auth import workspace_middleware
from services.settings_service import (
    get_workspace_settings,
    update_workspace_settings,
    list_api_keys,
    create_api_key,
    revoke_api_key,
    export_workspace_data,
)
from models.schemas import UpdateWorkspaceRequest

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.get("/workspace")
async def settings_workspace(request: Request):
    ws_id = request.state.workspace_id
    return get_workspace_settings(ws_id)


@router.patch("/workspace")
async def settings_update_workspace(request: Request, body: UpdateWorkspaceRequest):
    ws_id = request.state.workspace_id
    data = body.model_dump(exclude_none=True)
    return update_workspace_settings(ws_id, data)


@router.get("/api-keys")
async def settings_api_keys(request: Request):
    ws_id = request.state.workspace_id
    return {"keys": list_api_keys(ws_id)}


@router.post("/api-keys")
async def settings_create_api_key(request: Request):
    ws_id = request.state.workspace_id
    return create_api_key(ws_id)


@router.delete("/api-keys/{key_id}")
async def settings_revoke_api_key(request: Request, key_id: str):
    ws_id = request.state.workspace_id
    revoke_api_key(key_id, ws_id)
    return {"message": "API key revoked"}


@router.get("/export")
async def settings_export(request: Request):
    ws_id = request.state.workspace_id
    return export_workspace_data(ws_id)
