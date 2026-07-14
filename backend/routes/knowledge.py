from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    Request,
    UploadFile,
)
from fastapi.responses import FileResponse

from middlewares.auth import workspace_middleware
from models.schemas import KnowledgeFileResponse, TextUploadRequest, UploadResponse
from services.knowledge_service import (
    _validate_bot_ownership,
    delete_file,
    export_knowledge,
    list_files,
    reprocess_file,
    upload_file,
)
from services.knowledge_service import (
    get_file as get_file_service,
)
from services.knowledge_service import (
    upload_text as upload_text_service,
)

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.get("/files", response_model=list[KnowledgeFileResponse])
async def list_knowledge_files(request: Request, chatbot_id: str = Query(..., description="Bot ID to list files for")):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(chatbot_id, user_id, ws_id)
    return list_files(user_id, chatbot_id)


@router.get("/files/{file_id}", response_model=KnowledgeFileResponse)
async def get_knowledge_file(request: Request, file_id: str, chatbot_id: str = Query(..., description="Bot ID the file belongs to")):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(chatbot_id, user_id, ws_id)
    return get_file_service(file_id, user_id, chatbot_id)


@router.post("/upload", response_model=UploadResponse)
async def upload_knowledge_file(
    request: Request,
    file: UploadFile = File(...),
    chatbot_id: str = Form(..., description="Bot ID to assign this file to"),
):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(chatbot_id, user_id, ws_id)
    result = await upload_file(file, user_id, user_id, chatbot_id)
    return UploadResponse(
        success=True,
        file_id=result["id"],
        file_name=result.get("original_name", ""),
        file_type=result.get("file_type", "").lower(),
        file_size=result.get("file_size", 0),
        status=result.get("status", "pending"),
        message=(
            "File uploaded successfully."
            if result.get("status") in ("embedded", "pending")
            else "File uploaded but processing failed."
        ),
    )


@router.post("/upload-text", response_model=UploadResponse)
async def upload_knowledge_text(request: Request, body: TextUploadRequest):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(body.chatbot_id, user_id, ws_id)
    result = upload_text_service(body.title, body.content, user_id, body.chatbot_id)
    return UploadResponse(
        success=True,
        file_id=result["id"],
        file_name=result.get("original_name", ""),
        file_type=result.get("file_type", "").lower(),
        file_size=result.get("file_size", 0),
        status=result.get("status", "pending"),
        message=(
            "Text uploaded successfully."
            if result.get("status") in ("embedded", "pending")
            else "Text uploaded but processing failed."
        ),
    )


@router.get("/files/{file_id}/download")
async def download_knowledge_file(request: Request, file_id: str, chatbot_id: str = Query(..., description="Bot ID the file belongs to")):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(chatbot_id, user_id, ws_id)
    record = get_file_service(file_id, user_id, chatbot_id)
    file_path = Path(record["storage_path"])
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    return FileResponse(path=str(file_path), filename=record["original_name"])


@router.post("/files/{file_id}/reprocess")
async def reprocess_knowledge_file(request: Request, file_id: str, chatbot_id: str = Query(..., description="Bot ID the file belongs to")):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(chatbot_id, user_id, ws_id)
    reprocess_file(file_id, user_id, chatbot_id)
    return {"message": "File reprocessed successfully"}


@router.delete("/files/{file_id}")
async def delete_knowledge_file(request: Request, file_id: str, chatbot_id: str = Query(..., description="Bot ID the file belongs to")):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(chatbot_id, user_id, ws_id)
    delete_file(file_id, user_id, chatbot_id)
    return {"message": "File deleted successfully"}


@router.get("/export")
async def export_knowledge_base(request: Request, chatbot_id: str = Query(..., description="Bot ID to export knowledge for")):
    user_id = request.state.clerk_user_id
    ws_id = request.state.workspace_id
    _validate_bot_ownership(chatbot_id, user_id, ws_id)
    return export_knowledge(user_id, chatbot_id)
