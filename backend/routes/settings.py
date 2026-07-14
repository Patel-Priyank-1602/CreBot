from fastapi import APIRouter, Depends, HTTPException, Request

from middlewares.auth import workspace_middleware
from models.schemas import GroqKeyRequest, UpdateWorkspaceRequest
from services.groq_service import validate_groq_api_key
from services.settings_service import (
    create_api_key,
    delete_groq_api_key,
    export_workspace_data,
    get_groq_api_key,
    get_workspace_settings,
    list_api_keys,
    revoke_api_key,
    save_groq_api_key,
    update_workspace_settings,
)

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


# ── Groq BYOK endpoints ──────────────────────────────────────────────

@router.get("/groq-key")
async def settings_get_groq_key(request: Request):
    ws_id = request.state.workspace_id
    return get_groq_api_key(ws_id)


@router.post("/groq-key")
async def settings_save_groq_key(request: Request, body: GroqKeyRequest):
    ws_id = request.state.workspace_id
    # Validate the key before saving
    is_valid, error = validate_groq_api_key(body.api_key)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"Invalid Groq API key: {error}")
    return save_groq_api_key(ws_id, body.api_key)


@router.delete("/groq-key")
async def settings_delete_groq_key(request: Request):
    ws_id = request.state.workspace_id
    return delete_groq_api_key(ws_id)
