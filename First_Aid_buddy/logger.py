"""
Logging configuration for First-Aid Buddy Bot
Provides structured logging with proper security (no PII/API keys logged)
"""

import logging
import sys
from typing import Any, Dict
from datetime import datetime
import re
from .config import Config


class SanitizingFormatter(logging.Formatter):
    """
    Custom formatter that sanitizes sensitive information from logs
    Prevents logging of API keys, PII, and other sensitive data
    """

    # Patterns to redact
    PATTERNS = {
        'api_key': re.compile(r'sk-ant-[a-zA-Z0-9_-]+'),
        'email': re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
        'phone_uk': re.compile(r'\b0\d{10}\b'),
        'phone_us': re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'),
        'credit_card': re.compile(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'),
        'ssn': re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),
        'postcode_uk': re.compile(r'\b[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}\b', re.IGNORECASE),
    }

    def format(self, record: logging.LogRecord) -> str:
        """Format log record and sanitize sensitive information"""
        # Format the message normally
        original = super().format(record)

        # Sanitize the message
        sanitized = original
        for pattern_name, pattern in self.PATTERNS.items():
            sanitized = pattern.sub(f'[REDACTED_{pattern_name.upper()}]', sanitized)

        return sanitized


def setup_logger(name: str = 'first_aid_bot') -> logging.Logger:
    """
    Set up logger with appropriate configuration

    Args:
        name: Logger name (usually module name)

    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)

    # Only configure if not already configured
    if logger.handlers:
        return logger

    # Set log level from config
    log_level = getattr(logging, Config.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(log_level)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)

    # Create formatter
    if Config.ENABLE_DETAILED_LOGGING:
        # Detailed format for development/debugging
        log_format = (
            '%(asctime)s - %(name)s - %(levelname)s - '
            '[%(filename)s:%(lineno)d] - %(funcName)s - %(message)s'
        )
    else:
        # Simpler format for production
        log_format = '%(asctime)s - %(levelname)s - %(message)s'

    formatter = SanitizingFormatter(
        log_format,
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(console_handler)

    # Prevent propagation to root logger (avoid duplicate logs)
    logger.propagate = False

    return logger


def log_api_call(
    logger: logging.Logger,
    operation: str,
    success: bool,
    duration_ms: float,
    metadata: Dict[str, Any] = None
) -> None:
    """
    Log an API call with standardized format

    Args:
        logger: Logger instance
        operation: Operation name (e.g., "classify_intent", "generate_answer")
        success: Whether operation succeeded
        duration_ms: Duration in milliseconds
        metadata: Additional metadata (will be sanitized)
    """
    status = "SUCCESS" if success else "FAILURE"

    log_data = {
        'operation': operation,
        'status': status,
        'duration_ms': round(duration_ms, 2),
    }

    if metadata:
        # Filter out sensitive keys
        safe_metadata = {
            k: v for k, v in metadata.items()
            if k not in ['api_key', 'user_input', 'response']
        }
        log_data.update(safe_metadata)

    log_message = f"API Call: {log_data}"

    if success:
        logger.info(log_message)
    else:
        logger.error(log_message)


def log_user_query(
    logger: logging.Logger,
    query_length: int,
    classification: str,
    processing_time_ms: float
) -> None:
    """
    Log user query (without logging actual query text for privacy)

    Args:
        logger: Logger instance
        query_length: Length of user query
        classification: Classification result (LIFE_THREATENING or GENERAL_QUERY)
        processing_time_ms: Total processing time
    """
    logger.info(
        f"Query processed: length={query_length}, "
        f"classification={classification}, "
        f"time={round(processing_time_ms, 2)}ms"
    )


def log_security_event(
    logger: logging.Logger,
    event_type: str,
    details: str,
    severity: str = 'WARNING'
) -> None:
    """
    Log security-related events

    Args:
        logger: Logger instance
        event_type: Type of security event (e.g., "rate_limit_exceeded", "invalid_input")
        details: Event details (sanitized)
        severity: Log level (INFO, WARNING, ERROR, CRITICAL)
    """
    log_message = f"SECURITY EVENT: {event_type} - {details}"

    level = getattr(logging, severity.upper(), logging.WARNING)
    logger.log(level, log_message)


# Create default logger instance
default_logger = setup_logger()
