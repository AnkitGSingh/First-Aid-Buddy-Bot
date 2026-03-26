# First-Aid Buddy Bot - FastAPI Backend Dockerfile
# Multi-stage build for optimized image size

# =============================================================================
# Stage 1: Builder
# =============================================================================
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY backend/requirements.txt ./backend-requirements.txt
COPY First_Aid_buddy/requirements.txt ./core-requirements.txt

# Install to a dedicated prefix so it can be copied to /usr/local in runtime
# (avoids --user path issues when running as a non-root user)
RUN pip install --no-cache-dir --prefix=/install -r backend-requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r core-requirements.txt

# =============================================================================
# Stage 2: Runtime
# =============================================================================
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder into system Python path (accessible to all users)
COPY --from=builder /install /usr/local

# Copy application code
COPY backend/ ./backend/
COPY First_Aid_buddy/ ./First_Aid_buddy/
COPY LICENSE ./
COPY TERMS_OF_SERVICE.md ./
COPY PRIVACY_POLICY.md ./

# Create logs directory
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run FastAPI backend
CMD ["python", "-m", "uvicorn", "backend.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "1"]
