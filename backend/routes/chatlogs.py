from fastapi import APIRouter, Request, Query, Depends
from typing import Optional
from middlewares.auth import workspace_middleware
from services.chatlog_service import (
    list_logs,
    get_log,
    delete_log,
    export_logs,
    get_chatbots_for_filter,
)

router = APIRouter(dependencies=[Depends(workspace_middleware)])


@router.get("/export/all")
async def export_all_logs(request: Request):
    ws_id = request.state.workspace_id
    return export_logs(ws_id)


@router.get("/filters/chatbots")
async def get_chatbot_filters(request: Request):
    ws_id = request.state.workspace_id
    return {"chatbots": get_chatbots_for_filter(ws_id)}


@router.get("/")
async def get_chat_logs(
    request: Request,
    search: Optional[str] = Query(""),
    chatbot_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0),
):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id
    
    if chatbot_id:
        from routes.bots import _get_bot_for_user
        _get_bot_for_user(chatbot_id, user_id, ws_id)

    logs, total = list_logs(ws_id, search, chatbot_id, status, from_date, to_date, limit, offset)
    return {"logs": logs, "total": total, "limit": limit, "offset": offset}


@router.get("/{log_id}")
async def get_chat_log(request: Request, log_id: str):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id
    log = get_log(log_id, ws_id, user_id)
    if not log:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Log not found")
    return log


@router.delete("/{log_id}")
async def delete_chat_log(request: Request, log_id: str):
    ws_id = request.state.workspace_id
    user_id = request.state.clerk_user_id
    delete_log(log_id, ws_id, user_id)
    return {"message": "Log deleted successfully"}
