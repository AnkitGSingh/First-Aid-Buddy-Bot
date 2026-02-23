"""
Pipeline service: wraps First_Aid_buddy/core.py for the FastAPI layer.
Adds structured citation extraction on top of the existing RAG pipeline.
"""

import sys
import os
import time
from typing import List, Optional, Tuple

# ---------------------------------------------------------------------------
# Path setup – backend/ lives next to First_Aid_buddy/, so we add the
# project root to sys.path so the relative imports in core.py resolve.
# ---------------------------------------------------------------------------
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

import anthropic
from First_Aid_buddy.core import (
    FIRST_AID_KNOWLEDGE_BASE,
    Config,
    APIError,
    ValidationError,
    RateLimiter,
    initialize_client,
    validate_input,
    classify_intent,
    run_retrieval,
    generate_final_answer,
    rate_limiter,
)
from First_Aid_buddy.logger import setup_logger, log_user_query

logger = setup_logger("pipeline")


# ---------------------------------------------------------------------------
# Citation extraction
# ---------------------------------------------------------------------------

def _extract_citations(retrieved_docs_str: str) -> List[dict]:
    """
    Parse the formatted string returned by run_retrieval() into a list of
    citation dicts with {title, snippet}.

    Each block looks like:
        Document 1:
        Minor Cuts and Scrapes: Clean the wound with soap ...
    """
    citations: List[dict] = []
    blocks = retrieved_docs_str.split("\n\n")
    for block in blocks:
        # Strip the "Document N:" header line
        lines = block.strip().split("\n", 1)
        if len(lines) < 2:
            continue
        body = lines[1].strip()
        # Topic title is everything before the first ':'
        if ":" in body:
            title, rest = body.split(":", 1)
            snippet = rest.strip()[:220]  # first ~220 chars as preview
            citations.append({"title": title.strip(), "snippet": snippet + ("…" if len(rest.strip()) > 220 else "")})
    return citations


# ---------------------------------------------------------------------------
# Public API used by the routers
# ---------------------------------------------------------------------------

def get_client(api_key: str) -> anthropic.Anthropic:
    """Create and return a validated Anthropic client."""
    return initialize_client(api_key)


def run_chat_pipeline(
    user_input: str,
    client: anthropic.Anthropic,
    session_id: Optional[str] = None,
) -> Tuple[str, bool, List[dict], float]:
    """
    Run the full chat pipeline, returning structured output for the API.

    Returns:
        (answer, is_emergency, citations, processing_ms)

    Raises:
        ValidationError – bad input / rate-limited
        APIError        – Anthropic call failed
    """
    start = time.time()

    # 1. Validate & sanitise
    sanitized = validate_input(user_input)

    # 2. Rate-limit check
    if session_id:
        allowed, msg = rate_limiter.check_rate_limit(session_id)
        if not allowed:
            raise ValidationError(msg)

    # 3. Classify intent
    classification = classify_intent(sanitized, client)
    is_emergency = classification == "LIFE_THREATENING"

    # 4. Retrieve relevant docs
    retrieved_docs_str = run_retrieval(sanitized)

    # 5. Extract citations (structured, for the JSON response)
    citations = _extract_citations(retrieved_docs_str)

    # 6. Generate answer
    answer = generate_final_answer(sanitized, retrieved_docs_str, is_emergency, client)

    processing_ms = (time.time() - start) * 1000
    log_user_query(logger, len(sanitized), classification, processing_ms)

    return answer, is_emergency, citations, processing_ms
