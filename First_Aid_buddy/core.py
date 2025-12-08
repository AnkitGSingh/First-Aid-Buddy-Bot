"""
Core First-Aid Buddy Bot Module
Contains shared functionality for all interfaces (CLI, web, API)
Includes error handling, input validation, logging, and rate limiting
"""

import anthropic
from typing import List, Optional, Tuple
import re
import time
from datetime import datetime, timedelta
from collections import defaultdict
from .config import Config
from .logger import setup_logger, log_api_call, log_user_query, log_security_event

# Set up logger
logger = setup_logger('core')

# ============================================================================
# KNOWLEDGE BASE (Single source of truth)
# ============================================================================

FIRST_AID_KNOWLEDGE_BASE = [
    f"Minor Cuts and Scrapes: Clean the wound with soap and clean water. Apply gentle pressure with a clean cloth to stop bleeding. Once bleeding stops, apply antibiotic ointment and cover with a sterile bandage. Change the bandage daily and watch for signs of infection like redness, warmth, or pus.",

    f"Burns (Minor): Immediately cool the burn under cool (not cold) running water for 10-20 minutes. Do not apply ice directly to the burn. Remove jewelry or tight clothing before swelling begins. Cover loosely with a sterile, non-stick bandage. For burns larger than 3 inches or on face, hands, feet, or genitals, seek medical attention.",

    f"Choking (Conscious Adult): If the person can cough forcefully, encourage continued coughing. If they cannot breathe, cough, or speak, perform the Heimlich maneuver: Stand behind the person, make a fist above their navel, grasp it with your other hand, and give quick upward thrusts. Repeat until object is dislodged. Call {Config.EMERGENCY_NUMBER} if object cannot be removed.",

    f"Choking (Infant Under 1 Year): Support the infant face-down on your forearm with head lower than body. Give 5 back blows between shoulder blades with heel of hand. If object not dislodged, turn infant face-up and give 5 chest thrusts using 2 fingers in center of chest. Alternate until object comes out. Call {Config.EMERGENCY_NUMBER} immediately.",

    f"Sprains and Strains: Remember RICE - Rest the injured area, Ice for 20 minutes every 2-3 hours for first 48 hours, Compression with elastic bandage (not too tight), Elevation above heart level when possible. Take over-the-counter pain relievers as needed. If severe pain, deformity, or inability to use the limb, seek medical care.",

    f"Nosebleeds: Sit upright and lean slightly forward (not backward). Pinch the soft part of the nose firmly for 10 minutes without releasing. Breathe through your mouth. Apply a cold compress to the bridge of the nose. If bleeding continues after 20 minutes or is due to injury, seek medical attention.",

    f"Bee Stings: Remove the stinger by scraping it out with a credit card or fingernail (don't pinch). Wash with soap and water. Apply a cold pack to reduce swelling. Take antihistamine or apply hydrocortisone cream for itching. Watch for signs of allergic reaction like difficulty breathing, swelling of face or throat, or dizziness - call {Config.EMERGENCY_NUMBER} if these occur.",

    f"CPR (Adult): Call {Config.EMERGENCY_NUMBER} first. Place person on firm, flat surface. Place heel of one hand on center of chest, other hand on top. Push hard and fast at rate of 100-120 compressions per minute, at least 2 inches deep. Allow chest to return to normal position between compressions. If trained, give 2 rescue breaths after every 30 compressions. Continue until help arrives.",

    f"Severe Bleeding: Call {Config.EMERGENCY_NUMBER} immediately. Apply direct pressure to the wound with a clean cloth. Don't remove the cloth if it becomes soaked - add more layers on top. If bleeding is on an arm or leg, elevate the limb above the heart while maintaining pressure. If direct pressure doesn't stop bleeding, apply pressure to the artery supplying blood to the area.",

    f"Head Injury (Concussion Warning Signs): Watch for confusion, dizziness, headache, nausea or vomiting, slurred speech, sensitivity to light or noise, or loss of consciousness. If any severe symptoms occur (loss of consciousness, seizures, repeated vomiting, weakness or numbness, unequal pupils), call {Config.EMERGENCY_NUMBER} immediately. For minor bumps, apply ice and monitor for 24-48 hours.",

    f"Allergic Reaction (Anaphylaxis): This is a medical emergency. Signs include difficulty breathing, swelling of face/lips/tongue, hives, rapid pulse, dizziness, or loss of consciousness. Call {Config.EMERGENCY_NUMBER} immediately. If person has an epinephrine auto-injector (EpiPen), help them use it right away. Have them lie down with legs elevated. Begin CPR if they stop breathing.",

    f"Broken Bones (Fractures): Do not move the person unless necessary. Immobilize the injured area - don't try to realign the bone. Apply ice packs to reduce swelling and pain. Treat for shock if needed (lay person down, elevate legs, keep warm). Call {Config.EMERGENCY_NUMBER} for severe breaks, breaks involving the spine/neck/head, or if bone is protruding through skin.",

    f"Tooth Knocked Out: Find the tooth and handle it by the crown (top), not the root. Gently rinse with water if dirty (don't scrub). Try to place tooth back in socket. If not possible, keep tooth moist in milk or saliva. See a dentist within 30 minutes for best chance of saving the tooth.",

    f"Poisoning: Call {Config.NON_EMERGENCY_NUMBER} (for advice) or {Config.EMERGENCY_NUMBER} (if life-threatening) immediately. Do not make person vomit unless told to by medical professionals. If person is unconscious, having seizures, or trouble breathing, call {Config.EMERGENCY_NUMBER} first. Try to identify the substance - bring container or label to hospital if possible.",

    f"Heat Exhaustion: Move person to cool place. Have them lie down and elevate legs. Remove excess clothing. Apply cool, wet cloths or give cool water to drink. If symptoms don't improve within 30 minutes, or if person has high fever, seizures, or loses consciousness, call {Config.EMERGENCY_NUMBER} as this may be heat stroke (life-threatening emergency)."
]


# ============================================================================
# INPUT VALIDATION
# ============================================================================

class ValidationError(Exception):
    """Raised when input validation fails"""
    pass


def validate_input(user_input: str) -> str:
    """
    Validate and sanitize user input

    Args:
        user_input: Raw user input

    Returns:
        Sanitized input

    Raises:
        ValidationError: If input is invalid
    """
    # Check if input exists
    if not user_input or not user_input.strip():
        raise ValidationError("Input cannot be empty")

    # Strip whitespace
    sanitized = user_input.strip()

    # Check length
    if len(sanitized) < Config.MIN_INPUT_LENGTH:
        raise ValidationError(
            f"Input too short (minimum {Config.MIN_INPUT_LENGTH} characters)"
        )

    if len(sanitized) > Config.MAX_INPUT_LENGTH:
        raise ValidationError(
            f"Input too long (maximum {Config.MAX_INPUT_LENGTH} characters)"
        )

    # Check for suspicious patterns (basic prompt injection detection)
    suspicious_patterns = [
        r'ignore\s+(previous|above|all)\s+instructions',
        r'system\s*:',
        r'you\s+are\s+now',
        r'new\s+instructions',
        r'<\s*script',  # XSS attempt
        r'<\s*iframe',  # XSS attempt
    ]

    for pattern in suspicious_patterns:
        if re.search(pattern, sanitized, re.IGNORECASE):
            log_security_event(
                logger,
                'potential_prompt_injection',
                f'Suspicious pattern detected: {pattern}',
                'WARNING'
            )
            # Don't reject - just log for now, but could reject in production
            # raise ValidationError("Input contains suspicious patterns")

    return sanitized


# ============================================================================
# RATE LIMITING
# ============================================================================

class RateLimiter:
    """Simple in-memory rate limiter (use Redis in production)"""

    def __init__(self):
        self.requests = defaultdict(list)

    def check_rate_limit(self, identifier: str) -> Tuple[bool, Optional[str]]:
        """
        Check if request should be rate-limited

        Args:
            identifier: User identifier (session ID, IP, etc.)

        Returns:
            Tuple of (allowed: bool, message: Optional[str])
        """
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        hour_ago = now - timedelta(hours=1)

        # Get request timestamps for this identifier
        timestamps = self.requests[identifier]

        # Remove old timestamps
        timestamps = [ts for ts in timestamps if ts > hour_ago]
        self.requests[identifier] = timestamps

        # Check per-minute limit
        recent_requests = [ts for ts in timestamps if ts > minute_ago]
        if len(recent_requests) >= Config.RATE_LIMIT_PER_MINUTE:
            log_security_event(
                logger,
                'rate_limit_exceeded_minute',
                f'Identifier: {identifier[:8]}...',
                'WARNING'
            )
            return False, f"Rate limit exceeded. Maximum {Config.RATE_LIMIT_PER_MINUTE} requests per minute."

        # Check per-hour limit
        if len(timestamps) >= Config.RATE_LIMIT_PER_HOUR:
            log_security_event(
                logger,
                'rate_limit_exceeded_hour',
                f'Identifier: {identifier[:8]}...',
                'WARNING'
            )
            return False, f"Rate limit exceeded. Maximum {Config.RATE_LIMIT_PER_HOUR} requests per hour."

        # Add current request
        timestamps.append(now)

        return True, None


# Global rate limiter instance
rate_limiter = RateLimiter()


# ============================================================================
# API CLIENT
# ============================================================================

class APIError(Exception):
    """Raised when API call fails"""
    pass


def initialize_client(api_key: str) -> anthropic.Anthropic:
    """
    Initialize Anthropic client with validation

    Args:
        api_key: Anthropic API key

    Returns:
        Initialized client

    Raises:
        ValidationError: If API key is invalid
        APIError: If client initialization fails
    """
    # Validate API key format
    if not api_key or not isinstance(api_key, str):
        raise ValidationError("API key is required")

    if not api_key.startswith("sk-ant-"):
        raise ValidationError("Invalid API key format (should start with 'sk-ant-')")

    if len(api_key) < 20:
        raise ValidationError("API key appears to be too short")

    try:
        client = anthropic.Anthropic(api_key=api_key)
        logger.info("Anthropic client initialized successfully")
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Anthropic client: {str(e)}")
        raise APIError(f"Failed to initialize API client: {str(e)}")


def call_claude_with_retry(
    client: anthropic.Anthropic,
    operation: str,
    **kwargs
) -> anthropic.types.Message:
    """
    Call Claude API with retry logic and error handling

    Args:
        client: Anthropic client
        operation: Operation name (for logging)
        **kwargs: Arguments to pass to client.messages.create()

    Returns:
        API response

    Raises:
        APIError: If API call fails after retries
    """
    start_time = time.time()
    last_error = None

    for attempt in range(Config.API_MAX_RETRIES + 1):
        try:
            response = client.messages.create(**kwargs)
            duration_ms = (time.time() - start_time) * 1000

            log_api_call(
                logger,
                operation,
                success=True,
                duration_ms=duration_ms,
                metadata={'attempt': attempt + 1}
            )

            return response

        except anthropic.APITimeoutError as e:
            last_error = e
            logger.warning(f"{operation} timeout (attempt {attempt + 1}/{Config.API_MAX_RETRIES + 1})")
            if attempt < Config.API_MAX_RETRIES:
                time.sleep(2 ** attempt)  # Exponential backoff

        except anthropic.RateLimitError as e:
            last_error = e
            logger.warning(f"{operation} rate limited (attempt {attempt + 1}/{Config.API_MAX_RETRIES + 1})")
            if attempt < Config.API_MAX_RETRIES:
                time.sleep(5 * (attempt + 1))  # Longer backoff for rate limits

        except anthropic.APIConnectionError as e:
            last_error = e
            logger.warning(f"{operation} connection error (attempt {attempt + 1}/{Config.API_MAX_RETRIES + 1})")
            if attempt < Config.API_MAX_RETRIES:
                time.sleep(2 ** attempt)

        except anthropic.AuthenticationError as e:
            # Don't retry authentication errors
            logger.error(f"{operation} authentication failed")
            duration_ms = (time.time() - start_time) * 1000
            log_api_call(logger, operation, success=False, duration_ms=duration_ms)
            raise APIError("Authentication failed. Please check your API key.")

        except anthropic.APIError as e:
            last_error = e
            logger.error(f"{operation} API error: {str(e)}")
            if attempt < Config.API_MAX_RETRIES:
                time.sleep(2 ** attempt)

        except Exception as e:
            last_error = e
            logger.error(f"{operation} unexpected error: {str(e)}")
            break

    # All retries failed
    duration_ms = (time.time() - start_time) * 1000
    log_api_call(logger, operation, success=False, duration_ms=duration_ms)
    raise APIError(f"API call failed after {Config.API_MAX_RETRIES + 1} attempts: {str(last_error)}")


# ============================================================================
# CORE FUNCTIONS
# ============================================================================

def classify_intent(user_input: str, client: anthropic.Anthropic) -> str:
    """
    Classify user input as LIFE_THREATENING or GENERAL_QUERY

    Args:
        user_input: User query (should be pre-validated)
        client: Anthropic client

    Returns:
        Classification result ('LIFE_THREATENING' or 'GENERAL_QUERY')

    Raises:
        APIError: If API call fails
    """
    system_prompt = (
        "You are a specialized Triage Classification System. Your single task is to "
        "analyze the user's input and classify its intent into one of two categories: "
        "`LIFE_THREATENING` or `GENERAL_QUERY`. Your response must contain ONLY the "
        "category name and nothing else."
    )

    user_prompt = (
        f"Analyze the following user input and output the single, appropriate "
        f"category name: `{user_input}`"
    )

    response = call_claude_with_retry(
        client,
        operation='classify_intent',
        model=Config.CLAUDE_MODEL,
        max_tokens=Config.MAX_TOKENS_CLASSIFICATION,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}]
    )

    classification = response.content[0].text.strip()

    # Validate response
    if classification not in ['LIFE_THREATENING', 'GENERAL_QUERY']:
        logger.warning(f"Unexpected classification result: {classification}, defaulting to GENERAL_QUERY")
        return 'GENERAL_QUERY'

    return classification


def run_retrieval(user_input: str) -> str:
    """
    Retrieve relevant documents from knowledge base using enhanced keyword matching

    Args:
        user_input: User query

    Returns:
        Formatted string of top K relevant documents
    """
    user_input_lower = user_input.lower()

    # Keyword synonyms for better matching
    synonyms = {
        'cut': ['cuts', 'scrape', 'scrapes', 'wound', 'bleeding'],
        'burn': ['burns', 'burned', 'burnt', 'scald'],
        'choke': ['choking', 'choked', 'airway', 'obstruction'],
        'sprain': ['sprains', 'sprained', 'strain', 'strains', 'twisted'],
        'nose': ['nosebleed', 'nosebleeds', 'nasal'],
        'bee': ['sting', 'stings', 'insect', 'bite'],
        'cpr': ['cardiac', 'heart attack', 'chest compressions', 'resuscitation'],
        'bleed': ['bleeding', 'blood', 'hemorrhage'],
        'head': ['concussion', 'brain', 'skull'],
        'allerg': ['allergic', 'anaphylaxis', 'reaction', 'epipen'],
        'bone': ['fracture', 'broken', 'break'],
        'tooth': ['teeth', 'dental', 'knocked out'],
        'poison': ['poisoning', 'toxic', 'ingested'],
        'heat': ['exhaustion', 'stroke', 'dehydration', 'hot']
    }

    # Score each document
    scored_docs = []
    for doc in FIRST_AID_KNOWLEDGE_BASE:
        doc_lower = doc.lower()
        score = 0

        # Direct keyword matching
        user_words = user_input_lower.split()
        for word in user_words:
            if len(word) > 2:  # Ignore very short words
                score += doc_lower.count(word) * 2

        # Synonym matching
        for key, variations in synonyms.items():
            if key in user_input_lower or any(var in user_input_lower for var in variations):
                if key in doc_lower or any(var in doc_lower for var in variations):
                    score += 5

        # Topic matching from document headers
        doc_first_line = doc.split(':')[0].lower()
        for word in user_words:
            if len(word) > 2 and word in doc_first_line:
                score += 10  # High score for matching document title

        scored_docs.append((score, doc))

    # Sort by relevance score (descending) and take top K
    scored_docs.sort(reverse=True, key=lambda x: x[0])

    # Take top K documents with score > MIN_RELEVANCE_SCORE
    top_docs = [
        doc for score, doc in scored_docs[:Config.TOP_K_DOCUMENTS]
        if score > Config.MIN_RELEVANCE_SCORE
    ]

    # Fallback if no documents meet threshold
    if not top_docs:
        top_docs = [doc for score, doc in scored_docs[:Config.TOP_K_DOCUMENTS]]

    # Format the documents
    formatted_docs = []
    for i, doc in enumerate(top_docs, 1):
        formatted_docs.append(f"Document {i}:\n{doc}")

    logger.debug(f"Retrieved {len(top_docs)} documents for query")
    return "\n\n".join(formatted_docs)


def generate_final_answer(
    user_input: str,
    docs: str,
    is_emergency: bool,
    client: anthropic.Anthropic
) -> str:
    """
    Generate final answer using Claude API

    Args:
        user_input: User query
        docs: Retrieved documents
        is_emergency: Whether this is an emergency
        client: Anthropic client

    Returns:
        Generated response

    Raises:
        APIError: If API call fails
    """
    if is_emergency:
        system_prompt = (
            "You are an expert First-Aid instructor providing structured advice. "
            "Your task is to extract the most critical and actionable First-Aid steps "
            "from the provided 'docs' related to the user's 'query'. Present the steps "
            "as a short, clear bulleted list of actions. NEVER include conversational "
            "filler, explanations, or disclaimers. Your response must be an immediate "
            "action list."
        )
        user_message = (
            f"User's Emergency Query: `{user_input}` "
            f"Retrieved Documents (Use only this information): `{docs}` "
            f"Output the Critical First-Aid Steps ONLY."
        )
    else:
        system_prompt = (
            "You are a kind and helpful First-Aid expert. Your response must be "
            "conversational, reassuring, and easy to understand. You must base your "
            "answer EXCLUSIVELY on the knowledge provided in the 'docs'. If the "
            "documents do not contain the answer, your response must be a polite "
            "statement that you cannot assist with that specific topic. Do not include "
            f"any emergency warnings or references to calling {Config.EMERGENCY_NUMBER}/{Config.NON_EMERGENCY_NUMBER}."
        )
        user_message = (
            f"User's Question: `{user_input}` "
            f"Retrieved Documents (Use only this information to formulate your "
            f"conversational response): `{docs}`"
        )

    response = call_claude_with_retry(
        client,
        operation='generate_answer',
        model=Config.CLAUDE_MODEL,
        max_tokens=Config.MAX_TOKENS_GENERATION,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}]
    )

    return response.content[0].text


def process_query(
    user_input: str,
    client: anthropic.Anthropic,
    session_id: Optional[str] = None
) -> Tuple[str, bool]:
    """
    Process user query through complete pipeline with validation and error handling

    Args:
        user_input: Raw user input
        client: Anthropic client
        session_id: Optional session identifier for rate limiting

    Returns:
        Tuple of (response: str, is_emergency: bool)

    Raises:
        ValidationError: If input is invalid
        APIError: If API calls fail
    """
    start_time = time.time()

    try:
        # Step 1: Validate input
        sanitized_input = validate_input(user_input)

        # Step 2: Check rate limit (if session_id provided)
        if session_id:
            allowed, message = rate_limiter.check_rate_limit(session_id)
            if not allowed:
                raise ValidationError(message)

        # Step 3: Classify intent
        classification = classify_intent(sanitized_input, client)
        is_emergency = (classification == "LIFE_THREATENING")

        # Step 4: Retrieve documents
        retrieved_docs = run_retrieval(sanitized_input)

        # Step 5: Generate final answer
        final_answer = generate_final_answer(
            sanitized_input,
            retrieved_docs,
            is_emergency,
            client
        )

        # Log successful processing
        processing_time_ms = (time.time() - start_time) * 1000
        log_user_query(logger, len(sanitized_input), classification, processing_time_ms)

        return final_answer, is_emergency

    except (ValidationError, APIError) as e:
        # Re-raise known errors
        logger.error(f"Error processing query: {str(e)}")
        raise

    except Exception as e:
        # Catch unexpected errors
        logger.error(f"Unexpected error processing query: {str(e)}", exc_info=True)
        raise APIError(f"An unexpected error occurred: {str(e)}")
