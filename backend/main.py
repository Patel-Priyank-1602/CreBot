import os

# ── Memory optimization — MUST be set before any library imports ──────
# Render runs this file directly (not via Docker), so these must live here.
# Without these, ONNX Runtime / numpy / BLAS spawn threads that each eat RAM,
# causing the 512MB Render instance to OOM and restart.
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
# Tell glibc malloc to aggressively return freed memory to the OS
os.environ.setdefault("MALLOC_TRIM_THRESHOLD_", "65536")
os.environ.setdefault("MALLOC_MMAP_THRESHOLD_", "65536")

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from routes.admin import router as admin_router
from routes.billing import router as billing_router
from routes.bots import router as bots_router
from routes.chat import router as chat_router
from routes.chatlogs import router as chatlogs_router
from routes.dashboard import router as dashboard_router
from routes.embed import router as embed_router
from routes.invites import router as invites_router
from routes.knowledge import router as knowledge_router
from routes.settings import router as settings_router
from routes.widget import router as widget_router

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    from utils.clerk_auth import _get_jwks_client
    try:
        # Pre-fetch JWKS to avoid cold start latency/errors on concurrent initial requests
        jwks_client = _get_jwks_client()
        jwks_client.get_jwk_set()
    except Exception as e:
        print(f"[Startup Warning] Failed to pre-fetch JWKS: {e}")
    yield

app = FastAPI(
    title="CreBot API",
    description="AI Customer Support Chatbot Builder",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bots_router, prefix="/api/bots", tags=["Bots"])
app.include_router(widget_router, prefix="/api/widget", tags=["Widget"])
app.include_router(invites_router, prefix="/api/invites", tags=["Invites"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(knowledge_router, prefix="/api/knowledge", tags=["Knowledge"])
app.include_router(chatlogs_router, prefix="/api/chatlogs", tags=["Chat Logs"])
app.include_router(embed_router, prefix="/api/embed", tags=["Embed"])
app.include_router(billing_router, prefix="/api/billing", tags=["Billing"])
app.include_router(settings_router, prefix="/api/settings", tags=["Settings"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])

widget_dir = os.path.join(os.path.dirname(__file__), "..", "widget")
app.mount("/widget", StaticFiles(directory=widget_dir), name="widget")

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "CreBot API"}
