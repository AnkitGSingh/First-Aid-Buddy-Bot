"""Health-check router."""

from fastapi import APIRouter
from ..models.chat import HealthResponse

import sys, os
_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from First_Aid_buddy.config import Config

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Returns the current operational status of the API."""
    return HealthResponse(
        status="ok",
        environment=Config.ENVIRONMENT,
        region=Config.REGION,
        api_key_configured=bool(Config.ANTHROPIC_API_KEY),
        model=Config.CLAUDE_MODEL,
    )
