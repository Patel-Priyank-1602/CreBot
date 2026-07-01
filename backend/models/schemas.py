from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime


# ── Existing schemas ──

class CreateBotRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class BotResponse(BaseModel):
    id: str
    name: str
    widget_key: str
    created_at: str
    is_owner: bool = True
    can_edit: bool = False
    status: str = 'active'
    description: str = ''
    total_files: int = 0
    total_chats: int = 0
    embed_id: Optional[str] = None
    allowed_domains: list[str] = []
    welcome_message: str = 'Hi! How can I help you today?'
    theme: str = 'dark'
    position: str = 'bottom-right'
    updated_at: str = ''
    access: str = ''


class BotMemberResponse(BaseModel):
    id: str
    bot_id: str
    clerk_user_id: Optional[str] = None
    member_email: str
    joined_at: str


class AddMemberRequest(BaseModel):
    email: str


class JoinBotRequest(BaseModel):
    code: str


class GenerateInviteCodeRequest(BaseModel):
    bot_id: str
    access: str = "view"  # "view" or "edit"


class InviteCodeResponse(BaseModel):
    code: str
    bot_name: str
    access: str


class SyncMembersRequest(BaseModel):
    email: str


class TrainBotRequest(BaseModel):
    faq_text: str = Field(..., min_length=20)


class TrainBotResponse(BaseModel):
    message: str
    chunks_created: int


class EmbedSnippetResponse(BaseModel):
    snippet: str
    widget_key: str


class QueryLogEntry(BaseModel):
    id: str
    question: str
    answer: Optional[str] = None
    created_at: str
    status: str = 'answered'


class QueryLogsResponse(BaseModel):
    bot_id: str
    logs: list[QueryLogEntry]
    total: int


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    chat_history: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    answer: str
    source_chunks: int
    source_type: str = "faq"


class DashboardChatRequest(BaseModel):
    bot_id: str
    message: str = Field(..., min_length=1, max_length=2000)
    chat_history: list[ChatMessage] = Field(default_factory=list)


class DashboardChatResponse(BaseModel):
    answer: str
    sources: list[dict] = []
    source_chunks: int = 0
    source_type: str = "faq"
    conversation_id: str = ""


# ── New schemas ──

class UpdateBotRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    status: Optional[str] = None
    allowed_domains: Optional[list[str]] = None
    welcome_message: Optional[str] = None
    theme: Optional[str] = None
    position: Optional[str] = None


class DistributionItem(BaseModel):
    name: str
    value: float


class DashboardOverviewResponse(BaseModel):
    total_chatbots: int
    total_files: int
    total_conversations: int
    storage_used: int
    storage_limit: int
    chatbot_limit: int
    chat_distribution: list[DistributionItem] = []
    storage_distribution: list[DistributionItem] = []


class DashboardActivityItem(BaseModel):
    id: str
    type: str
    description: str
    created_at: str


class DashboardActivityResponse(BaseModel):
    activities: list[DashboardActivityItem]


class KnowledgeFileResponse(BaseModel):
    id: str
    bot_id: Optional[str] = None
    user_id: Optional[str] = None
    file_name: str
    original_name: str
    file_type: str
    file_size: int
    storage_path: Optional[str] = None
    status: str = "pending"
    chunks_count: int = 0
    error_message: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None


class UploadResponse(BaseModel):
    success: bool
    file_id: str
    file_name: str
    file_type: str
    file_size: int
    status: str = "pending"
    message: str = ""


class ChatLogResponse(BaseModel):
    id: str
    workspace_id: str
    chatbot_id: str
    chatbot_name: Optional[str] = None
    user_question: str
    bot_answer: Optional[str] = None
    sources: Optional[Any] = None
    status: str
    created_at: str


class ApiKeyResponse(BaseModel):
    id: str
    key_preview: str
    created_at: str
    last_used_at: Optional[str] = None
    status: str


class CreateApiKeyResponse(BaseModel):
    id: str
    key_preview: str
    full_key: str
    created_at: str


class WorkspaceResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    role: str
    plan: str
    chatbot_limit: int
    storage_limit: int
    created_at: str
    updated_at: str


class UpdateWorkspaceRequest(BaseModel):
    name: Optional[str] = None


class BillingPlanResponse(BaseModel):
    name: str
    price: int
    chatbots: int
    storage: int
    queries: int


class CurrentBillingResponse(BaseModel):
    plan: str
    price: int
    chatbot_limit: int
    storage_limit: int
    query_limit: int
    used_chatbots: int
    used_storage: int
    used_queries: int
    billing_status: str
    current_period_start: str
    current_period_end: str


class UpgradeRequest(BaseModel):
    plan: str


class AdminStatsResponse(BaseModel):
    total_users: int
    total_chatbots: int
    total_files: int
    total_queries: int
    active_workspaces: int
    failed_jobs: int


class AdminUserResponse(BaseModel):
    id: str
    email: Optional[str] = None
    name: str
    role: str
    plan: str
    chatbots: int = 0
    files: int = 0
    queries: int = 0
    status: str
    created_at: str


class UpdateUserStatusRequest(BaseModel):
    action: str = Field(..., pattern="^(suspend|activate)$")


class EmbedSettingsResponse(BaseModel):
    chatbot_id: str
    embed_id: str
    name: str
    welcome_message: str
    theme: str
    position: str
    allowed_domains: list[str]


class ExportResponse(BaseModel):
    data: dict
