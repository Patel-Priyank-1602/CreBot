"""
CreBot Backend — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config import settings
from routes.bots import router as bots_router
from routes.widget import router as widget_router

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="CreBot API",
    description="AI Customer Support Chatbot Builder",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bots_router, prefix="/api/bots", tags=["Bots"])
app.include_router(widget_router, prefix="/api/widget", tags=["Widget"])


@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "CreBot API"}
