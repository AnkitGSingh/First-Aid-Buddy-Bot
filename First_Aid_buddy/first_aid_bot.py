"""
First-Aid Buddy Bot - Complete System
A chatbot that provides first-aid guidance with emergency triage capabilities.
"""

import anthropic
from typing import List


# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

# Initialize Claude client
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('ANTHROPIC_API_KEY')
claude_client = anthropic.Anthropic(api_key=API_KEY)

# Simulated RAG knowledge base
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
# CORE FUNCTIONS
# ============================================================================

def classify_intent(user_input: str) -> str:

    # System prompt for classification
    system_prompt = "You are a specialized Triage Classification System. Your single task is to analyze the user's input and classify its intent into one of two categories: `LIFE_THREATENING` or `GENERAL_QUERY`. Your response must contain ONLY the category name and nothing else."
    
    # User prompt with variable injection
    user_prompt = f"Analyze the following user input and output the single, appropriate category name: `{user_input}`"

    response = claude_client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=10,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_prompt}
        ]
    )
    
    classification = response.content[0].text.strip()
    
    # Ensure valid response
    if classification not in ['LIFE_THREATENING', 'GENERAL_QUERY']:
        # Default to general query if unexpected response
        return 'GENERAL_QUERY'
    
    return classification


def run_retrieval(user_input: str, knowledge_base_docs: List[str]) -> str:

    # Enhanced keyword extraction - include common variations
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
    for doc in knowledge_base_docs:
        doc_lower = doc.lower()
        score = 0
        
        # Direct keyword matching
        user_words = user_input_lower.split()
        for word in user_words:
            # Count occurrences of the word in document
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
    
    # Sort by relevance score (descending) and take top 3
    scored_docs.sort(reverse=True, key=lambda x: x[0])
    
    # Take top 3 documents with score > 0, or first 3 if all scores are 0
    top_docs = [doc for score, doc in scored_docs[:3] if score > 0]
    if not top_docs:
        top_docs = [doc for score, doc in scored_docs[:3]]
    
    # Format the documents
    formatted_docs = []
    for i, doc in enumerate(top_docs, 1):
        formatted_docs.append(f"Document {i}:\n{doc}")
    
    return "\n\n".join(formatted_docs)


def generate_final_answer(user_input: str, docs: str, is_emergency: bool) -> str:

    if is_emergency:
        # Emergency prompt - concise, action-oriented, clear steps
        system_prompt = "You are an expert First-Aid instructor providing structured advice. Your task is to extract the most critical and actionable First-Aid steps from the provided 'docs' related to the user's 'query'. Present the steps as a short, clear bulleted list of actions. NEVER include conversational filler, explanations, or disclaimers. Your response must be an immediate action list."
        
        user_message = f"User's Emergency Query: `{user_input}` Retrieved Documents (Use only this information): `{docs}` Output the Critical First-Aid Steps ONLY."

    else:
        # General query prompt - conversational, educational, thorough
        system_prompt = "You are a kind and helpful First-Aid expert. Your response must be conversational, reassuring, and easy to understand. You must base your answer EXCLUSIVELY on the knowledge provided in the 'docs'. If the documents do not contain the answer, your response must be a polite statement that you cannot assist with that specific topic. Do not include any emergency warnings or references to calling 999/111."
        
        user_message = f"User's Question: `{user_input}` Retrieved Documents (Use only this information to formulate your conversational response): `{docs}`"

    # Call Claude API with appropriate prompt
    response = claude_client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=1000,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )
    
    return response.content[0].text


# ============================================================================
# MAIN EXECUTION LOOP
# ============================================================================

def process_user_query(user_input: str) -> str:

    print("\n" + "="*70)
    print("PROCESSING QUERY...")
    print("="*70)
    
    # Step 1: Classify the intent
    print("\n[Step 1] Classifying intent...")
    classification = classify_intent(user_input)
    print(f"Classification Result: {classification}")
    
    # Step 2: Route based on classification
    if classification == "LIFE_THREATENING":
        # Emergency path
        print("\n[Emergency Path Activated]")
        
        # Print immediate disclaimer BEFORE RAG
        emergency_disclaimer = """
⚠️  EMERGENCY DETECTED ⚠️
This is a life-threatening situation. While we provide guidance:
• CALL 999 IMMEDIATELY (UK Emergency Services)
• Follow their instructions first
• Use our guidance only while waiting for emergency services
"""
        print(emergency_disclaimer)
        
        # Run RAG retrieval
        print("\n[Step 2] Retrieving relevant emergency information...")
        retrieved_docs = run_retrieval(user_input, FIRST_AID_KNOWLEDGE_BASE)
        
        # Generate final answer with emergency flag
        print("\n[Step 3] Generating emergency action plan...")
        final_answer = generate_final_answer(user_input, retrieved_docs, is_emergency=True)
        
        # Combine disclaimer with answer
        return emergency_disclaimer + "\n" + final_answer
        
    elif classification == "GENERAL_QUERY":
        # General query path
        print("\n[General Query Path Activated]")
        
        # Run RAG retrieval (no disclaimer needed first)
        print("\n[Step 2] Retrieving relevant information...")
        retrieved_docs = run_retrieval(user_input, FIRST_AID_KNOWLEDGE_BASE)
        
        # Generate final answer without emergency flag
        print("\n[Step 3] Generating response...")
        final_answer = generate_final_answer(user_input, retrieved_docs, is_emergency=False)
        
        return final_answer
    
    else:
        # Fallback (should never reach here due to validation in classify_intent)
        return "I'm sorry, I couldn't process your query. Please try again."


def main():
    """
    Main execution function - runs the interactive chatbot loop.
    """
    print("="*70)
    print(" "*20 + "FIRST-AID BUDDY BOT")
    print("="*70)
    print("\nWelcome! I'm your First-Aid Buddy. I can help with:")
    print("  • Emergency situations (with immediate action steps)")
    print("  • General first-aid questions")
    print("\nType 'quit' or 'exit' to end the conversation.\n")
    print("="*70)
    
    while True:
        # Get user input
        user_input = input("\n👤 You: ").strip()
        
        # Check for exit commands
        if user_input.lower() in ['quit', 'exit', 'q']:
            print("\n👋 Stay safe! Goodbye!\n")
            break
        
        # Skip empty inputs
        if not user_input:
            print("Please enter a question or describe the situation.")
            continue
        
        try:
            # Process the query through the complete workflow
            response = process_user_query(user_input)
            
            # Display the final response
            print("\n" + "="*70)
            print("🤖 First-Aid Buddy:")
            print("="*70)
            print(response)
            print("="*70)
            
        except anthropic.APIError as e:
            print(f"\n❌ API Error: {e}")
            print("Please check your API key and try again.")
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Something went wrong. Please try again.")


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    # Validate API key is set
    if API_KEY == "your-anthropic-api-key-here":
        print("\n" + "="*70)
        print("⚠️  API KEY NOT SET")
        print("="*70)
        print("\nPlease replace 'your-anthropic-api-key-here' with your actual")
        print("Anthropic API key in the API_KEY variable at the top of this file.")
        print("\nYou can get your API key from: https://console.anthropic.com/")
        print("="*70 + "\n")
    else:
        # Run the main chatbot loop
        main()