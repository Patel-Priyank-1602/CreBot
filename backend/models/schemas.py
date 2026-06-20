"""
CreBot Backend — Pydantic request/response schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ── Authentication ────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    user_id: str
    email: str


# ── Bots ──────────────────────────────────────────────────────────────────────

class CreateBotRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class BotResponse(BaseModel):
    id: str
    business_id: str
    name: str
    widget_key: str
    created_at: str


class TrainBotRequest(BaseModel):
    faq_text: str = Field(..., min_length=20, description="Raw FAQ content to train the bot on")


class TrainBotResponse(BaseModel):
    message: str
    chunks_created: int


class EmbedSnippetResponse(BaseModel):
    snippet: str
    widget_key: str


# ── Query Logs ────────────────────────────────────────────────────────────────

class QueryLogEntry(BaseModel):
    id: str
    question: str
    answer: Optional[str] = None
    created_at: str


class QueryLogsResponse(BaseModel):
    bot_id: str
    logs: list[QueryLogEntry]
    total: int


# ── Widget / Chat ─────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    answer: str
    source_chunks: int  # how many FAQ chunks were used
