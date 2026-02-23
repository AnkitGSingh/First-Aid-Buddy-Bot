"""
Tests for core functionality
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
import anthropic
from First_Aid_buddy.core import (
    initialize_client,
    classify_intent,
    run_retrieval,
    generate_final_answer,
    process_query,
    ValidationError,
    APIError,
    FIRST_AID_KNOWLEDGE_BASE
)
from First_Aid_buddy.config import Config


class TestInitializeClient:
    """Test client initialization"""

    def test_valid_api_key_initializes_client(self):
        """Test that valid API key creates client"""
        client = initialize_client("sk-ant-test-key-1234567890abcdefghij")
        assert isinstance(client, anthropic.Anthropic)

    def test_invalid_format_raises_error(self):
        """Test that invalid API key format raises error"""
        with pytest.raises(ValidationError, match="Invalid API key format"):
            initialize_client("invalid-key")

    def test_empty_key_raises_error(self):
        """Test that empty key raises error"""
        with pytest.raises(ValidationError, match="API key is required"):
            initialize_client("")

    def test_none_key_raises_error(self):
        """Test that None key raises error"""
        with pytest.raises(ValidationError, match="API key is required"):
            initialize_client(None)

    def test_short_key_raises_error(self):
        """Test that too-short key raises error"""
        with pytest.raises(ValidationError, match="too short"):
            initialize_client("sk-ant-short")


class TestClassifyIntent:
    """Test intent classification"""

    def test_general_query_classification(self, mock_anthropic_client):
        """Test classification of general query"""
        result = classify_intent("How do I treat a cut?", mock_anthropic_client)
        assert result == "GENERAL_QUERY"
        assert mock_anthropic_client.messages.create.called

    def test_emergency_classification(self, mock_anthropic_client):
        """Test classification of emergency"""
        # Configure mock to return emergency
        emergency_response = Mock()
        emergency_response.content = [Mock(text="LIFE_THREATENING")]
        mock_anthropic_client.messages.create.return_value = emergency_response

        result = classify_intent("Someone is not breathing", mock_anthropic_client)
        assert result == "LIFE_THREATENING"

    def test_unexpected_response_defaults_to_general(self, mock_anthropic_client):
        """Test that unexpected classification defaults to GENERAL_QUERY"""
        # Configure mock to return unexpected value
        weird_response = Mock()
        weird_response.content = [Mock(text="UNKNOWN_CATEGORY")]
        mock_anthropic_client.messages.create.return_value = weird_response

        result = classify_intent("test query", mock_anthropic_client)
        assert result == "GENERAL_QUERY"

    def test_uses_correct_model(self, mock_anthropic_client):
        """Test that correct model is used"""
        classify_intent("test query", mock_anthropic_client)

        call_kwargs = mock_anthropic_client.messages.create.call_args[1]
        assert call_kwargs['model'] == Config.CLAUDE_MODEL

    def test_uses_correct_max_tokens(self, mock_anthropic_client):
        """Test that correct max_tokens is used"""
        classify_intent("test query", mock_anthropic_client)

        call_kwargs = mock_anthropic_client.messages.create.call_args[1]
        assert call_kwargs['max_tokens'] == Config.MAX_TOKENS_CLASSIFICATION


class TestRunRetrieval:
    """Test document retrieval"""

    def test_retrieves_relevant_documents(self):
        """Test that relevant documents are retrieved"""
        result = run_retrieval("How do I treat a cut?")
        assert "cut" in result.lower() or "scrape" in result.lower()
        assert "Document" in result

    def test_retrieves_top_k_documents(self):
        """Test that correct number of documents are retrieved"""
        result = run_retrieval("burn treatment")
        # Count how many "Document X:" appear
        doc_count = result.count("Document")
        assert doc_count <= Config.TOP_K_DOCUMENTS

    def test_handles_no_matches(self):
        """Test that retrieval works even with no good matches"""
        result = run_retrieval("xyz abc nonexistent term")
        # Should still return some documents
        assert len(result) > 0
        assert "Document" in result

    def test_synonym_matching(self):
        """Test that synonyms are matched correctly"""
        # "choke" should match "choking"
        result = run_retrieval("someone is choking")
        assert "chok" in result.lower() or "airway" in result.lower()

    def test_case_insensitive_matching(self):
        """Test that matching is case-insensitive"""
        result1 = run_retrieval("BURN")
        result2 = run_retrieval("burn")
        # Both should find burn-related content
        assert "burn" in result1.lower()
        assert "burn" in result2.lower()


class TestGenerateFinalAnswer:
    """Test answer generation"""

    def test_emergency_answer_generation(self, mock_anthropic_client):
        """Test generation of emergency response"""
        response = Mock()
        response.content = [Mock(text="1. Call 999\n2. Start CPR")]
        mock_anthropic_client.messages.create.return_value = response

        result = generate_final_answer(
            "not breathing",
            "CPR instructions...",
            is_emergency=True,
            client=mock_anthropic_client
        )

        assert "999" in result or "CPR" in result

    def test_general_answer_generation(self, mock_anthropic_client):
        """Test generation of general response"""
        response = Mock()
        response.content = [Mock(text="To treat a minor cut, clean it with soap and water.")]
        mock_anthropic_client.messages.create.return_value = response

        result = generate_final_answer(
            "how to treat a cut",
            "Cut treatment instructions...",
            is_emergency=False,
            client=mock_anthropic_client
        )

        assert len(result) > 0

    def test_uses_different_prompts_for_emergency(self, mock_anthropic_client):
        """Test that different system prompts are used for emergency vs general"""
        response = Mock()
        response.content = [Mock(text="Test response")]
        mock_anthropic_client.messages.create.return_value = response

        # Emergency call
        generate_final_answer("emergency", "docs", True, mock_anthropic_client)
        emergency_call = mock_anthropic_client.messages.create.call_args[1]

        # General call
        mock_anthropic_client.reset_mock()
        generate_final_answer("general", "docs", False, mock_anthropic_client)
        general_call = mock_anthropic_client.messages.create.call_args[1]

        # System prompts should be different
        assert emergency_call['system'] != general_call['system']


class TestProcessQuery:
    """Test complete query processing pipeline"""

    def test_successful_query_processing(self, mock_anthropic_client):
        """Test successful end-to-end query processing"""
        # Configure mocks
        classification_response = Mock()
        classification_response.content = [Mock(text="GENERAL_QUERY")]

        generation_response = Mock()
        generation_response.content = [Mock(text="Here's how to treat a cut...")]

        mock_anthropic_client.messages.create.side_effect = [
            classification_response,
            generation_response
        ]

        result, is_emergency = process_query(
            "How do I treat a cut?",
            mock_anthropic_client,
            session_id="test123"
        )

        assert isinstance(result, str)
        assert len(result) > 0
        assert isinstance(is_emergency, bool)
        assert is_emergency is False

    def test_emergency_query_processing(self, mock_anthropic_client):
        """Test emergency query is flagged correctly"""
        # Configure mocks for emergency
        classification_response = Mock()
        classification_response.content = [Mock(text="LIFE_THREATENING")]

        generation_response = Mock()
        generation_response.content = [Mock(text="1. Call 999")]

        mock_anthropic_client.messages.create.side_effect = [
            classification_response,
            generation_response
        ]

        result, is_emergency = process_query(
            "Someone stopped breathing",
            mock_anthropic_client
        )

        assert is_emergency is True

    def test_invalid_input_raises_validation_error(self, mock_anthropic_client):
        """Test that invalid input raises ValidationError"""
        with pytest.raises(ValidationError):
            process_query("", mock_anthropic_client)

    def test_rate_limiting_enforced(self, mock_anthropic_client):
        """Test that rate limiting is enforced"""
        # Configure mocks
        response = Mock()
        response.content = [Mock(text="GENERAL_QUERY")]
        mock_anthropic_client.messages.create.return_value = response

        session_id = "test_user"

        # Make requests up to limit
        for i in range(Config.RATE_LIMIT_PER_MINUTE):
            process_query("test query", mock_anthropic_client, session_id)

        # Next request should fail
        with pytest.raises(ValidationError, match="Rate limit exceeded"):
            process_query("test query", mock_anthropic_client, session_id)
