"""
Pydantic models for the First-Aid Buddy API.
"""

import re
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

_SESSION_ID_RE = re.compile(r"^[a-zA-Z0-9_\-]{1,128}$")
_VALID_REGIONS = {"UK", "US", "EU", "AU", "CA", "NZ"}


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=3, max_length=500, description="User's first-aid question")
    session_id: Optional[str] = Field(
        None,
        max_length=128,
        description="Browser session ID for rate limiting / history",
    )
    region: Optional[str] = Field("UK", description="Region code used to surface correct emergency numbers")

    @field_validator("session_id")
    @classmethod
    def validate_session_id(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not _SESSION_ID_RE.match(v):
            raise ValueError("session_id must be alphanumeric/dash/underscore, max 128 chars")
        return v

    @field_validator("region")
    @classmethod
    def validate_region(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v.upper() not in _VALID_REGIONS:
            raise ValueError(f"region must be one of {sorted(_VALID_REGIONS)}")
        return v.upper() if v else v


class Citation(BaseModel):
    title: str = Field(..., description="Document topic title, e.g. 'Burns (Minor)'")
    snippet: str = Field(..., description="Relevant excerpt shown beneath the answer")


class ChatResponse(BaseModel):
    answer: str = Field(..., description="Generated first-aid advice")
    is_emergency: bool = Field(..., description="True when the query was classified LIFE_THREATENING")
    emergency_number: str = Field(..., description="Local emergency number (e.g. 999)")
    citations: List[Citation] = Field(default_factory=list, description="Source documents used")
    session_id: Optional[str] = Field(None, description="Echo of the session_id for the client to store")
    processing_ms: Optional[float] = Field(None, description="End-to-end processing time in milliseconds")


class HealthResponse(BaseModel):
    status: str
    environment: str
    region: str
    api_key_configured: bool
    model: str
