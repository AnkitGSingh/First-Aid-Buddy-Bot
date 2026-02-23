"""
Configuration Management for First-Aid Buddy Bot
Loads settings from environment variables with secure defaults
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration loaded from environment variables"""

    # =========================================================================
    # Anthropic API Configuration
    # =========================================================================
    ANTHROPIC_API_KEY: Optional[str] = os.getenv('ANTHROPIC_API_KEY')

    # =========================================================================
    # Application Settings
    # =========================================================================
    ENVIRONMENT: str = os.getenv('ENVIRONMENT', 'development')
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    PORT: int = int(os.getenv('PORT', '8501'))

    # =========================================================================
    # Rate Limiting
    # =========================================================================
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv('RATE_LIMIT_PER_MINUTE', '10'))
    RATE_LIMIT_PER_HOUR: int = int(os.getenv('RATE_LIMIT_PER_HOUR', '100'))

    # =========================================================================
    # Input Validation
    # =========================================================================
    MAX_INPUT_LENGTH: int = int(os.getenv('MAX_INPUT_LENGTH', '500'))
    MIN_INPUT_LENGTH: int = int(os.getenv('MIN_INPUT_LENGTH', '3'))

    # =========================================================================
    # Claude API Configuration
    # =========================================================================
    CLAUDE_MODEL: str = os.getenv('CLAUDE_MODEL', 'claude-sonnet-4-5-20250929')
    MAX_TOKENS_CLASSIFICATION: int = int(os.getenv('MAX_TOKENS_CLASSIFICATION', '10'))
    MAX_TOKENS_GENERATION: int = int(os.getenv('MAX_TOKENS_GENERATION', '1000'))
    API_TIMEOUT: int = int(os.getenv('API_TIMEOUT', '30'))
    API_MAX_RETRIES: int = int(os.getenv('API_MAX_RETRIES', '3'))

    # =========================================================================
    # RAG Configuration
    # =========================================================================
    TOP_K_DOCUMENTS: int = int(os.getenv('TOP_K_DOCUMENTS', '3'))
    MIN_RELEVANCE_SCORE: int = int(os.getenv('MIN_RELEVANCE_SCORE', '0'))

    # =========================================================================
    # Caching
    # =========================================================================
    ENABLE_CACHING: bool = os.getenv('ENABLE_CACHING', 'false').lower() == 'true'
    CACHE_TTL: int = int(os.getenv('CACHE_TTL', '3600'))

    # =========================================================================
    # Security
    # =========================================================================
    ENABLE_CSRF_PROTECTION: bool = os.getenv('ENABLE_CSRF_PROTECTION', 'true').lower() == 'true'
    ENABLE_CORS: bool = os.getenv('ENABLE_CORS', 'false').lower() == 'true'
    ALLOWED_ORIGINS: str = os.getenv('ALLOWED_ORIGINS', 'http://localhost:8501')

    # =========================================================================
    # Monitoring
    # =========================================================================
    ENABLE_DETAILED_LOGGING: bool = os.getenv('ENABLE_DETAILED_LOGGING', 'false').lower() == 'true'
    ENABLE_METRICS: bool = os.getenv('ENABLE_METRICS', 'false').lower() == 'true'
    SENTRY_DSN: Optional[str] = os.getenv('SENTRY_DSN')

    # =========================================================================
    # Regional Configuration
    # =========================================================================
    EMERGENCY_NUMBER: str = os.getenv('EMERGENCY_NUMBER', '999')
    NON_EMERGENCY_NUMBER: str = os.getenv('NON_EMERGENCY_NUMBER', '111')
    REGION: str = os.getenv('REGION', 'UK')

    @classmethod
    def is_production(cls) -> bool:
        """Check if running in production environment"""
        return cls.ENVIRONMENT.lower() == 'production'

    @classmethod
    def is_development(cls) -> bool:
        """Check if running in development environment"""
        return cls.ENVIRONMENT.lower() == 'development'

    @classmethod
    def validate(cls) -> list[str]:
        """
        Validate configuration and return list of errors

        Returns:
            List of error messages (empty if valid)
        """
        errors = []

        # Validate API key in production
        if cls.is_production() and not cls.ANTHROPIC_API_KEY:
            errors.append("ANTHROPIC_API_KEY is required in production")

        # Validate security settings
        if cls.is_production() and not cls.ENABLE_CSRF_PROTECTION:
            errors.append("CSRF protection should be enabled in production")

        # Validate rate limits
        if cls.RATE_LIMIT_PER_MINUTE < 1:
            errors.append("RATE_LIMIT_PER_MINUTE must be at least 1")

        if cls.RATE_LIMIT_PER_HOUR < cls.RATE_LIMIT_PER_MINUTE:
            errors.append("RATE_LIMIT_PER_HOUR must be >= RATE_LIMIT_PER_MINUTE")

        # Validate input limits
        if cls.MAX_INPUT_LENGTH < cls.MIN_INPUT_LENGTH:
            errors.append("MAX_INPUT_LENGTH must be >= MIN_INPUT_LENGTH")

        if cls.MAX_INPUT_LENGTH > 10000:
            errors.append("MAX_INPUT_LENGTH should not exceed 10000 characters")

        # Validate API settings
        if cls.API_TIMEOUT < 1:
            errors.append("API_TIMEOUT must be at least 1 second")

        if cls.API_MAX_RETRIES < 0:
            errors.append("API_MAX_RETRIES must be non-negative")

        return errors

    @classmethod
    def get_summary(cls) -> dict:
        """Get configuration summary (safe for logging - no secrets)"""
        return {
            'environment': cls.ENVIRONMENT,
            'region': cls.REGION,
            'model': cls.CLAUDE_MODEL,
            'rate_limit_per_minute': cls.RATE_LIMIT_PER_MINUTE,
            'max_input_length': cls.MAX_INPUT_LENGTH,
            'csrf_protection': cls.ENABLE_CSRF_PROTECTION,
            'caching': cls.ENABLE_CACHING,
            'api_key_configured': bool(cls.ANTHROPIC_API_KEY),
        }


# Validate configuration on import
config_errors = Config.validate()
if config_errors:
    import warnings
    for error in config_errors:
        warnings.warn(f"Configuration error: {error}")
