"""
First-Aid Buddy – FastAPI Backend
Entry point: uvicorn backend.main:app --reload --port 8000
"""

import sys
import os

# ---------------------------------------------------------------------------
# Resolve project root so First_Aid_buddy.* imports work when running from
# anywhere inside the monorepo.
# ---------------------------------------------------------------------------
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from First_Aid_buddy.config import Config
from First_Aid_buddy.logger import setup_logger
from backend.services.pipeline import get_client
from backend.routers import chat, health, rag

logger = setup_logger("main")


# ---------------------------------------------------------------------------
# Lifespan: initialise / teardown shared resources
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting First-Aid Buddy API …")
    logger.info(f"Config: {Config.get_summary()}")

    if not Config.ANTHROPIC_API_KEY:
        logger.warning(
            "ANTHROPIC_API_KEY is not set. "
            "Copy backend/.env.example to backend/.env and fill in the key. "
            "/health will work but /chat will return 503."
        )
        app.state.anthropic_client = None
    else:
        try:
            app.state.anthropic_client = get_client(Config.ANTHROPIC_API_KEY)
            logger.info("Anthropic client ready.")
        except Exception as exc:
            logger.warning(f"Could not initialise Anthropic client: {exc}. /chat will return 503 until the key is fixed.")
            app.state.anthropic_client = None

    yield
    # Shutdown
    logger.info("Shutting down First-Aid Buddy API.")


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title="First-Aid Buddy API",
    description=(
        "AI-powered first-aid guidance. "
        "Provides triage classification, RAG-backed answers, and cited sources."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS – in development allow all origins; in production use env-configured list
# ---------------------------------------------------------------------------

if Config.is_development():
    _origins = ["*"]
    _allow_credentials = False  # Cannot be True with wildcard origins
else:
    _origins = [o.strip() for o in Config.ALLOWED_ORIGINS.split(",") if o.strip()]
    _allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(health.router)
app.include_router(chat.router)
app.include_router(rag.router)


# ---------------------------------------------------------------------------
# Root redirect
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "First-Aid Buddy API is running. Visit /docs for the interactive API reference."}
