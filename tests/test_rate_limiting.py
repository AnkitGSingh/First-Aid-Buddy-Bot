"""
Tests for rate limiting
"""

import pytest
from datetime import datetime, timedelta
from First_Aid_buddy.core import RateLimiter
from First_Aid_buddy.config import Config


class TestRateLimiter:
    """Test rate limiting functionality"""

    def test_first_request_allowed(self):
        """Test that first request is always allowed"""
        limiter = RateLimiter()
        allowed, message = limiter.check_rate_limit("user123")
        assert allowed is True
        assert message is None

    def test_within_minute_limit_allowed(self):
        """Test that requests within per-minute limit are allowed"""
        limiter = RateLimiter()
        user_id = "user123"

        # Make requests up to the limit
        for i in range(Config.RATE_LIMIT_PER_MINUTE):
            allowed, message = limiter.check_rate_limit(user_id)
            assert allowed is True, f"Request {i+1} should be allowed"

    def test_exceeding_minute_limit_blocked(self):
        """Test that exceeding per-minute limit blocks request"""
        limiter = RateLimiter()
        user_id = "user123"

        # Make requests up to the limit
        for i in range(Config.RATE_LIMIT_PER_MINUTE):
            limiter.check_rate_limit(user_id)

        # Next request should be blocked
        allowed, message = limiter.check_rate_limit(user_id)
        assert allowed is False
        assert "per minute" in message.lower()

    def test_different_users_independent_limits(self):
        """Test that different users have independent rate limits"""
        limiter = RateLimiter()

        # User 1 hits limit
        for i in range(Config.RATE_LIMIT_PER_MINUTE):
            limiter.check_rate_limit("user1")

        # User 1 blocked
        allowed, _ = limiter.check_rate_limit("user1")
        assert allowed is False

        # User 2 still allowed
        allowed, _ = limiter.check_rate_limit("user2")
        assert allowed is True

    def test_old_requests_cleaned_up(self):
        """Test that old request timestamps are removed"""
        limiter = RateLimiter()
        user_id = "user123"

        # Add old timestamp manually
        old_time = datetime.now() - timedelta(hours=2)
        limiter.requests[user_id].append(old_time)

        # Make new request - should clean up old timestamp
        allowed, message = limiter.check_rate_limit(user_id)
        assert allowed is True

        # Old timestamp should be removed
        for timestamp in limiter.requests[user_id]:
            assert timestamp > datetime.now() - timedelta(hours=1)

    def test_hour_limit_enforced(self):
        """Test that hourly limit is enforced"""
        limiter = RateLimiter()
        user_id = "user123"

        # Add timestamps within the hour up to limit
        now = datetime.now()
        for i in range(Config.RATE_LIMIT_PER_HOUR):
            # Spread across the hour to avoid minute limit
            timestamp = now - timedelta(minutes=i)
            limiter.requests[user_id].append(timestamp)

        # Next request should be blocked
        allowed, message = limiter.check_rate_limit(user_id)
        assert allowed is False
        assert "per hour" in message.lower()
