"""
CreBot Backend — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config import settings
from routes.auth import router as auth_router
from routes.bots import router as bots_router
from routes.widget import router as widget_router

# ---------------------------------------------------------------------------
# Rate limiter (keyed by IP)
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="CreBot API",
    description="AI Customer Support Chatbot Builder — Backend",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS — dashboard origin + allow any origin for the widget chat endpoint
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,  # Next.js dashboard
        "*",                     # widget runs on any business site
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Route registration
# ---------------------------------------------------------------------------
app.include_router(auth_router,   prefix="/api/auth",   tags=["Authentication"])
app.include_router(bots_router,   prefix="/api/bots",   tags=["Bots"])
app.include_router(widget_router, prefix="/api/widget", tags=["Widget"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
async def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok", "service": "CreBot API"}
