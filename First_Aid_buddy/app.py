"""
First-Aid Buddy Bot - Streamlit Web Interface
A beautiful, mobile-friendly web UI for the First-Aid chatbot
"""

import streamlit as st
import anthropic
from typing import List
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============================================================================
# PAGE CONFIGURATION
# ============================================================================

st.set_page_config(
    page_title="First-Aid Buddy Bot",
    page_icon="🏥",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# ============================================================================
# CUSTOM CSS STYLING
# ============================================================================

st.markdown("""
<style>
    /* Main container styling */
    .main {
        background-color: #f8f9fa;
    }
    
    /* Header styling */
    .big-font {
        font-size: 50px !important;
        font-weight: bold;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 10px;
    }
    
    .subtitle {
        font-size: 18px;
        color: #7f8c8d;
        text-align: center;
        margin-bottom: 30px;
    }
    
    /* Emergency alert styling */
    .emergency-alert {
        background-color: #fee;
        border-left: 5px solid #d32f2f;
        padding: 20px;
        margin: 20px 0;
        border-radius: 5px;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    
    .emergency-title {
        color: #d32f2f;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    
    .emergency-text {
        color: #c62828;
        font-size: 16px;
        line-height: 1.6;
    }
    
    /* Chat message styling */
    .user-message {
        background-color: #e3f2fd;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        border-left: 4px solid #2196f3;
    }
    
    .bot-message {
        background-color: #ffffff;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        border-left: 4px solid #4caf50;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* Processing indicator */
    .processing {
        color: #ff9800;
        font-style: italic;
        padding: 10px;
    }
    
    /* Footer */
    .footer {
        text-align: center;
        color: #95a5a6;
        padding: 20px;
        font-size: 14px;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

# Knowledge base (same as CLI version)
FIRST_AID_KNOWLEDGE_BASE = [
    "Minor Cuts and Scrapes: Clean the wound with soap and clean water. Apply gentle pressure with a clean cloth to stop bleeding. Once bleeding stops, apply antibiotic ointment and cover with a sterile bandage. Change the bandage daily and watch for signs of infection like redness, warmth, or pus.",
    
    "Burns (Minor): Immediately cool the burn under cool (not cold) running water for 10-20 minutes. Do not apply ice directly to the burn. Remove jewelry or tight clothing before swelling begins. Cover loosely with a sterile, non-stick bandage. For burns larger than 3 inches or on face, hands, feet, or genitals, seek medical attention.",
    
    "Choking (Conscious Adult): If the person can cough forcefully, encourage continued coughing. If they cannot breathe, cough, or speak, perform the Heimlich maneuver: Stand behind the person, make a fist above their navel, grasp it with your other hand, and give quick upward thrusts. Repeat until object is dislodged. Call 999 if object cannot be removed.",
    
    "Choking (Infant Under 1 Year): Support the infant face-down on your forearm with head lower than body. Give 5 back blows between shoulder blades with heel of hand. If object not dislodged, turn infant face-up and give 5 chest thrusts using 2 fingers in center of chest. Alternate until object comes out. Call 999 immediately.",
    
    "Sprains and Strains: Remember RICE - Rest the injured area, Ice for 20 minutes every 2-3 hours for first 48 hours, Compression with elastic bandage (not too tight), Elevation above heart level when possible. Take over-the-counter pain relievers as needed. If severe pain, deformity, or inability to use the limb, seek medical care.",
    
    "Nosebleeds: Sit upright and lean slightly forward (not backward). Pinch the soft part of the nose firmly for 10 minutes without releasing. Breathe through your mouth. Apply a cold compress to the bridge of the nose. If bleeding continues after 20 minutes or is due to injury, seek medical attention.",
    
    "Bee Stings: Remove the stinger by scraping it out with a credit card or fingernail (don't pinch). Wash with soap and water. Apply a cold pack to reduce swelling. Take antihistamine or apply hydrocortisone cream for itching. Watch for signs of allergic reaction like difficulty breathing, swelling of face or throat, or dizziness - call 999 if these occur.",
    
    "CPR (Adult): Call 999 first. Place person on firm, flat surface. Place heel of one hand on center of chest, other hand on top. Push hard and fast at rate of 100-120 compressions per minute, at least 2 inches deep. Allow chest to return to normal position between compressions. If trained, give 2 rescue breaths after every 30 compressions. Continue until help arrives.",
    
    "Severe Bleeding: Call 999 immediately. Apply direct pressure to the wound with a clean cloth. Don't remove the cloth if it becomes soaked - add more layers on top. If bleeding is on an arm or leg, elevate the limb above the heart while maintaining pressure. If direct pressure doesn't stop bleeding, apply pressure to the artery supplying blood to the area.",
    
    "Head Injury (Concussion Warning Signs): Watch for confusion, dizziness, headache, nausea or vomiting, slurred speech, sensitivity to light or noise, or loss of consciousness. If any severe symptoms occur (loss of consciousness, seizures, repeated vomiting, weakness or numbness, unequal pupils), call 999 immediately. For minor bumps, apply ice and monitor for 24-48 hours.",
    
    "Allergic Reaction (Anaphylaxis): This is a medical emergency. Signs include difficulty breathing, swelling of face/lips/tongue, hives, rapid pulse, dizziness, or loss of consciousness. Call 999 immediately. If person has an epinephrine auto-injector (EpiPen), help them use it right away. Have them lie down with legs elevated. Begin CPR if they stop breathing.",
    
    "Broken Bones (Fractures): Do not move the person unless necessary. Immobilize the injured area - don't try to realign the bone. Apply ice packs to reduce swelling and pain. Treat for shock if needed (lay person down, elevate legs, keep warm). Call 999 for severe breaks, breaks involving the spine/neck/head, or if bone is protruding through skin.",
    
    "Tooth Knocked Out: Find the tooth and handle it by the crown (top), not the root. Gently rinse with water if dirty (don't scrub). Try to place tooth back in socket. If not possible, keep tooth moist in milk or saliva. See a dentist within 30 minutes for best chance of saving the tooth.",
    
    "Poisoning: Call NHS 111 (for advice) or 999 (if life-threatening) immediately. Do not make person vomit unless told to by medical professionals. If person is unconscious, having seizures, or trouble breathing, call 999 first. Try to identify the substance - bring container or label to hospital if possible.",
    
    "Heat Exhaustion: Move person to cool place. Have them lie down and elevate legs. Remove excess clothing. Apply cool, wet cloths or give cool water to drink. If symptoms don't improve within 30 minutes, or if person has high fever, seizures, or loses consciousness, call 999 as this may be heat stroke (life-threatening emergency)."
]

# ============================================================================
# CORE FUNCTIONS (Same as CLI version)
# ============================================================================

def initialize_client(api_key: str):
    """Initialize the Anthropic client with the provided API key."""
    try:
        return anthropic.Anthropic(api_key=api_key)
    except Exception as e:
        st.error(f"Failed to initialize client: {e}")
        return None


def classify_intent(user_input: str, client) -> str:
    """Classify user input as LIFE_THREATENING or GENERAL_QUERY."""
    system_prompt = "You are a specialized Triage Classification System. Your single task is to analyze the user's input and classify its intent into one of two categories: `LIFE_THREATENING` or `GENERAL_QUERY`. Your response must contain ONLY the category name and nothing else."
    
    user_prompt = f"Analyze the following user input and output the single, appropriate category name: `{user_input}`"

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=10,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}]
        )
        
        classification = response.content[0].text.strip()
        
        if classification not in ['LIFE_THREATENING', 'GENERAL_QUERY']:
            return 'GENERAL_QUERY'
        
        return classification
    except Exception as e:
        st.error(f"Classification error: {e}")
        return 'GENERAL_QUERY'


def run_retrieval(user_input: str, knowledge_base_docs: List[str]) -> str:
    """Simulate RAG retrieval with improved matching."""
    user_input_lower = user_input.lower()
    
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
    
    scored_docs = []
    for doc in knowledge_base_docs:
        doc_lower = doc.lower()
        score = 0
        
        user_words = user_input_lower.split()
        for word in user_words:
            if len(word) > 2:
                score += doc_lower.count(word) * 2
        
        for key, variations in synonyms.items():
            if key in user_input_lower or any(var in user_input_lower for var in variations):
                if key in doc_lower or any(var in doc_lower for var in variations):
                    score += 5
        
        doc_first_line = doc.split(':')[0].lower()
        for word in user_words:
            if len(word) > 2 and word in doc_first_line:
                score += 10
        
        scored_docs.append((score, doc))
    
    scored_docs.sort(reverse=True, key=lambda x: x[0])
    top_docs = [doc for score, doc in scored_docs[:3] if score > 0]
    if not top_docs:
        top_docs = [doc for score, doc in scored_docs[:3]]
    
    formatted_docs = []
    for i, doc in enumerate(top_docs, 1):
        formatted_docs.append(f"Document {i}:\n{doc}")
    
    return "\n\n".join(formatted_docs)


def generate_final_answer(user_input: str, docs: str, is_emergency: bool, client) -> str:
    """Generate response using Claude API."""
    if is_emergency:
        system_prompt = "You are an expert First-Aid instructor providing structured advice. Your task is to extract the most critical and actionable First-Aid steps from the provided 'docs' related to the user's 'query'. Present the steps as a short, clear bulleted list of actions. NEVER include conversational filler, explanations, or disclaimers. Your response must be an immediate action list."
        user_message = f"User's Emergency Query: `{user_input}` Retrieved Documents (Use only this information): `{docs}` Output the Critical First-Aid Steps ONLY."
    else:
        system_prompt = "You are a kind and helpful First-Aid expert. Your response must be conversational, reassuring, and easy to understand. You must base your answer EXCLUSIVELY on the knowledge provided in the 'docs'. If the documents do not contain the answer, your response must be a polite statement that you cannot assist with that specific topic. Do not include any emergency warnings or references to calling 999/911."
        user_message = f"User's Question: `{user_input}` Retrieved Documents (Use only this information to formulate your conversational response): `{docs}`"

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        return response.content[0].text
    except Exception as e:
        return f"Error generating response: {e}"


def process_query(user_input: str, client):
    """Process user query through the complete pipeline."""
    # Step 1: Classify
    with st.spinner("🔍 Analyzing your query..."):
        classification = classify_intent(user_input, client)
        time.sleep(0.5)  # Brief pause for UX
    
    is_emergency = (classification == "LIFE_THREATENING")
    
    # Step 2: Retrieve
    with st.spinner("📚 Finding relevant information..."):
        retrieved_docs = run_retrieval(user_input, FIRST_AID_KNOWLEDGE_BASE)
        time.sleep(0.5)
    
    # Step 3: Generate
    with st.spinner("💭 Generating response..."):
        final_answer = generate_final_answer(user_input, retrieved_docs, is_emergency, client)
    
    return final_answer, is_emergency

# ============================================================================
# SESSION STATE INITIALIZATION
# ============================================================================

if 'messages' not in st.session_state:
    st.session_state.messages = []

if 'api_key' not in st.session_state:
    st.session_state.api_key = os.getenv('ANTHROPIC_API_KEY')

if 'client' not in st.session_state:
    st.session_state.client = None
    # Auto-initialize if API key is in environment
    if st.session_state.api_key:
        st.session_state.client = initialize_client(st.session_state.api_key)

# ============================================================================
# MAIN UI
# ============================================================================

# Header
st.markdown('<p class="big-font">🏥 First-Aid Buddy Bot</p>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Your AI-powered first-aid assistant • Available 24/7</p>', unsafe_allow_html=True)

# Sidebar for API Key
with st.sidebar:
    st.header("⚙️ Configuration")
    
    # Check if API key is loaded from environment or already in session
    if st.session_state.api_key and st.session_state.client:
        st.success("✅ API key configured")
        if not st.session_state.get('manual_key_entered'):
            st.info("🔒 Loaded from .env file")
        
        # Option to change key
        if st.button("🔄 Change API Key"):
            st.session_state.api_key = None
            st.session_state.client = None
            st.session_state.manual_key_entered = False
            st.rerun()
    else:
        # Show input field if no API key
        st.info("👉 Enter your Anthropic API key to begin")
        api_key_input = st.text_input(
            "Anthropic API Key",
            type="password",
            placeholder="sk-ant-api03-...",
            help="Get your API key from: https://console.anthropic.com/",
            key="api_key_input"
        )
        
        if st.button("Save API Key", type="primary"):
            if api_key_input and api_key_input.startswith("sk-ant-"):
                st.session_state.api_key = api_key_input
                st.session_state.manual_key_entered = True
                st.session_state.client = initialize_client(api_key_input)
                if st.session_state.client:
                    st.success("✅ API key saved!")
                    st.rerun()
            else:
                st.error("❌ Invalid API key format. Should start with 'sk-ant-'")
    
    st.divider()
    
    st.markdown("### 📋 How to Use")
    st.markdown("""
    1. Enter your API key above
    2. Type your first-aid question
    3. Get instant guidance
    
    **Examples:**
    - "I have a cut on my finger"
    - "Someone is choking"
    - "How to treat a burn?"
    """)
    
    st.divider()
    
    if st.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.rerun()
    
    st.markdown("---")
    st.markdown("🚨 **Emergency:** Call 999")
    st.markdown("💡 **Non-emergency:** NHS 111")

# Main chat area
if not st.session_state.client:
    st.warning("⚠️ Please enter your Anthropic API key in the sidebar to begin.")
    st.info("Don't have an API key? Get one at: https://console.anthropic.com/")
else:
    # Display chat history
    for message in st.session_state.messages:
        if message["role"] == "user":
            st.markdown(f"""
            <div class="user-message">
                <strong>👤 You:</strong><br>
                {message["content"]}
            </div>
            """, unsafe_allow_html=True)
        else:
            if message.get("is_emergency"):
                st.markdown("""
                <div class="emergency-alert">
                    <div class="emergency-title">⚠️ EMERGENCY DETECTED ⚠️</div>
                    <div class="emergency-text">
                        This is a life-threatening situation. While we provide guidance:<br>
                        • <strong>CALL 999 IMMEDIATELY</strong> (UK Emergency Services)<br>
                        • Follow their instructions first<br>
                        • Use our guidance only while waiting for emergency services
                    </div>
                </div>
                """, unsafe_allow_html=True)
            
            st.markdown(f"""
            <div class="bot-message">
                <strong>🤖 First-Aid Buddy:</strong><br><br>
            """, unsafe_allow_html=True)
            
            # Render the message content with proper markdown formatting
            st.markdown(message["content"])
            
            st.markdown("</div>", unsafe_allow_html=True)
    
    # Chat input
    st.divider()
    
    # Use columns for better layout
    col1, col2 = st.columns([5, 1])
    
    with col1:
        user_input = st.text_input(
            "Your question:",
            placeholder="E.g., I have a cut on my hand...",
            label_visibility="collapsed",
            key="user_input"
        )
    
    with col2:
        send_button = st.button("Send 📤", use_container_width=True)
    
    # Process input
    if send_button and user_input:
        # Add user message
        st.session_state.messages.append({"role": "user", "content": user_input})
        
        # Process and get response
        response, is_emergency = process_query(user_input, st.session_state.client)
        
        # Add bot response
        st.session_state.messages.append({
            "role": "assistant",
            "content": response,
            "is_emergency": is_emergency
        })
        
        # Rerun to update chat
        st.rerun()

# Footer
st.markdown("---")
st.markdown("""
<div class="footer">
    <p><strong>Disclaimer:</strong> This chatbot provides general first-aid guidance only. 
    For emergencies, always call 999. For medical advice, consult healthcare professionals.</p>
    <p>Built with ❤️ </p>
</div>
""", unsafe_allow_html=True)
