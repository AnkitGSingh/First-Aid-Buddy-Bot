"""
Chat router – POST /chat
The core endpoint: accepts a user message, runs the RAG + LLM pipeline,
and returns a structured response with emergency flag and citations.
"""

import uuid
from fastapi import APIRouter, HTTPException, Request, status

from ..models.chat import ChatRequest, ChatResponse, Citation
from ..services.pipeline import run_chat_pipeline

import sys, os
_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from First_Aid_buddy.config import Config
from First_Aid_buddy.core import ValidationError, APIError

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, request: Request):
    """
    Process a first-aid question through the full RAG + LLM pipeline.

    - Validates and rate-limits the request.
    - Classifies intent (LIFE_THREATENING vs GENERAL_QUERY).
    - Retrieves relevant knowledge-base documents.
    - Generates a structured answer with citations.
    """
    # Retrieve the shared Anthropic client initialized at startup
    client = request.app.state.anthropic_client
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is not configured. Please set a valid ANTHROPIC_API_KEY in backend/.env.",
        )

    # Use provided session_id or derive from IP (anonymous sessions)
    session_id = payload.session_id or str(request.client.host)

    try:
        answer, is_emergency, raw_citations, processing_ms = run_chat_pipeline(
            user_input=payload.message,
            client=client,
            session_id=session_id,
        )
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )
    except APIError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service error: {str(exc)}",
        )

    citations = [Citation(title=c["title"], snippet=c["snippet"]) for c in raw_citations]

    return ChatResponse(
        answer=answer,
        is_emergency=is_emergency,
        emergency_number=Config.EMERGENCY_NUMBER,
        citations=citations,
        session_id=payload.session_id,
        processing_ms=round(processing_ms, 1),
    )
