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
# Deterministic safety rules (fire even when LLM classification is wrong)
# ---------------------------------------------------------------------------

# Phrases that unambiguously signal a life-threatening emergency.
# Intentionally broad to minimise false negatives — false positives (over-triage)
# are safer than missing a real emergency.
_EMERGENCY_KEYWORDS = frozenset({
    "not breathing", "stopped breathing", "no pulse", "cardiac arrest",
    "heart attack", "chest pain", "chest tightness", "chest pressure",
    "unconscious", "unresponsive", "passed out", "collapsed",
    "severe bleeding", "won't stop bleeding", "blood everywhere",
    "anaphylaxis", "anaphylactic", "epipen",
    "stroke", "face drooping", "arm weakness", "slurred speech",
    "choking", "can't breathe", "cannot breathe", "not breathing",
    "poisoning", "overdose", "swallowed medication",
    "drowning", "electric shock", "electrocution",
    "severe burn", "major burn", "third degree burn",
    "spinal injury", "broken neck", "broken back",
    "seizure", "convulsion",
})

# Phrases that signal self-harm or suicidal crisis.
# We never give instructions; we return safe signposting.
_CRISIS_KEYWORDS = frozenset({
    "kill myself", "end my life", "commit suicide", "want to die",
    "suicidal", "self harm", "self-harm", "cutting myself",
    "take my own life", "harm myself",
})

_CRISIS_RESPONSE = (
    "I’m really sorry you’re going through something so painful. "
    "Please reach out to a crisis service right now — you don’t have to face this alone.\n\n"
    "**UK:** Call or text **116 123** (Samaritans \u2014 free, 24/7)\n"
    "**US:** Call or text **988** (Suicide & Crisis Lifeline)\n"
    "**International:** https://www.befrienders.org\n\n"
    "If you are in immediate danger, call **999** (UK) or **911** (US) now."
)


def _is_deterministically_emergency(text: str) -> bool:
    """Return True when the query matches a known life-threatening pattern.

    Acts as a safety net alongside (not instead of) LLM classification;
    the final `is_emergency` flag is the logical OR of both.
    """
    lower = text.lower()
    return any(kw in lower for kw in _EMERGENCY_KEYWORDS)


def _is_crisis_query(text: str) -> bool:
    """Return True when the query signals self-harm or suicidal intent."""
    lower = text.lower()
    return any(kw in lower for kw in _CRISIS_KEYWORDS)


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

    # 1b. Crisis safeguard — checked BEFORE rate-limiting so a distressed user
    #     who has exhausted their quota still receives empathetic signposting
    #     rather than a rate-limit error.
    if _is_crisis_query(sanitized):
        processing_ms = (time.time() - start) * 1000
        log_user_query(logger, len(sanitized), "CRISIS_SAFEGUARD", processing_ms)
        return _CRISIS_RESPONSE, False, [], processing_ms

    # 2. Rate-limit check
    if session_id:
        allowed, msg = rate_limiter.check_rate_limit(session_id)
        if not allowed:
            raise ValidationError(msg)

    # 3. Classify intent: use LLM classification OR deterministic keyword match.
    #    Deterministic rules act as a safety net — they can only *add* an
    #    emergency flag, never remove one the LLM would have set.
    classification = classify_intent(sanitized, client)
    is_emergency = (classification == "LIFE_THREATENING") or _is_deterministically_emergency(sanitized)

    # 4. Retrieve relevant docs
    retrieved_docs_str = run_retrieval(sanitized)

    # 5. Extract citations (structured, for the JSON response)
    citations = _extract_citations(retrieved_docs_str)

    # 6. Generate answer
    answer = generate_final_answer(sanitized, retrieved_docs_str, is_emergency, client)

    processing_ms = (time.time() - start) * 1000
    log_user_query(logger, len(sanitized), classification, processing_ms)

    return answer, is_emergency, citations, processing_ms
