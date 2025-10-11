🏥 First-Aid Buddy Bot

An AI-powered first-aid assistant that provides intelligent medical guidance with emergency triage capabilities.


![Python](https://img.shields.io/badge/Python-3.8+-green)
![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red)

---

🌟 Features

- Intelligent Triage: Automatically classifies queries as life-threatening or general
- Emergency Alerts: Immediate action plans for critical situations
- RAG-Based Retrieval: Finds relevant medical information from the knowledge base
- Conversational AI: Friendly, reassuring guidance for non-emergencies
- Mobile-Friendly: Responsive design works on all devices
- Secure: API keys protected with environment variables

---

🚀 Quick Start

Prerequisites

- Python 3.8 or higher
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/first-aid-buddy.git
   cd first-aid-buddy
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

   Set up your API key**
   
   Option A: Using .env file (Recommended for local development)
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API key
   # ANTHROPIC_API_KEY=
