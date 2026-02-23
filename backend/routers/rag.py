"""
RAG management router – stubs for PDF upload and document listing.
Full implementation (pgvector + embeddings) is Phase 2.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/rag", tags=["rag"])


class DocumentMeta(BaseModel):
    title: str
    source: str
    chunk_count: int


@router.get("/documents", response_model=List[DocumentMeta])
async def list_documents():
    """Return the current knowledge-base documents available to the RAG pipeline."""
    # Phase 1: return the built-in knowledge base titles
    from First_Aid_buddy.core import FIRST_AID_KNOWLEDGE_BASE
    docs = []
    for doc in FIRST_AID_KNOWLEDGE_BASE:
        title = doc.split(":")[0].strip()
        docs.append(DocumentMeta(title=title, source="built-in", chunk_count=1))
    return docs


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF to be ingested into the knowledge base.
    Phase 1 stub – returns 202 Accepted without processing.
    Phase 2 will: extract text → chunk → embed → store in pgvector.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF files are accepted.",
        )
    return {
        "status": "accepted",
        "filename": file.filename,
        "message": "PDF ingestion pipeline coming in Phase 2.",
    }
