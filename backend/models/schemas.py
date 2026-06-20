"""
CreBot Backend — Pydantic request/response schemas
"""

from pydantic import BaseModel, Field
from typing import Optional


class CreateBotRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class BotResponse(BaseModel):
    id: str
    name: str
    widget_key: str
    created_at: str


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
    source_type: str = "faq"  # "faq", "general", or "hybrid"
