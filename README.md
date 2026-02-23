# 🏥 First-Aid Buddy Bot

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.29+-red.svg)](https://streamlit.io/)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-orange.svg)](https://www.anthropic.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI](https://github.com/YOUR_USERNAME/First-Aid-Buddy-Bot/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/First-Aid-Buddy-Bot/actions)

An AI-powered first-aid assistant that provides intelligent medical guidance with emergency triage capabilities, powered by Anthropic's Claude AI.

**⚠️ MEDICAL DISCLAIMER: This application provides general first-aid information only and is NOT a substitute for professional medical advice. In emergencies, always call emergency services (999 in UK, 911 in US) immediately.**

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

### Core Functionality
- 🚨 **Intelligent Emergency Triage:** Automatically classifies queries as life-threatening or general
- ⚡ **Instant Emergency Guidance:** Immediate action plans for critical situations
- 📚 **RAG-Based Knowledge Retrieval:** Finds relevant medical information from curated knowledge base
- 💬 **Conversational AI Interface:** Friendly, reassuring guidance powered by Claude
- 📱 **Mobile-Friendly Design:** Responsive interface works on all devices

### Security & Reliability
- 🔒 **Input Validation:** Sanitization and validation of all user inputs
- 🛡️ **Rate Limiting:** Protection against abuse and cost overrun
- ⚠️ **Error Handling:** Comprehensive error handling with retry logic
- 📊 **Logging & Monitoring:** Structured logging with PII redaction
- 🔐 **API Key Security:** Secure credential management

### Production-Ready
- 🐳 **Docker Support:** Containerized deployment with docker-compose
- 🧪 **Comprehensive Tests:** Unit and integration tests with 70%+ coverage
- 📈 **CI/CD Pipeline:** Automated testing and security scanning
- 📝 **Complete Documentation:** Architecture, deployment, and API docs
- ⚖️ **Legal Compliance:** Terms of Service, Privacy Policy, and medical disclaimers

---

## 🎥 Demo

```bash
# Start the application
streamlit run First_Aid_buddy/app.py
```

Then open your browser to `http://localhost:8501`

### Example Queries

**General Query:**
```
User: "How do I treat a minor cut?"
Bot: "For a minor cut, start by cleaning the wound with soap and water..."
```

**Emergency Detection:**
```
User: "Someone stopped breathing!"
Bot: 🚨 EMERGENCY DETECTED 🚨
     CALL 999 IMMEDIATELY
     While waiting for emergency services:
     1. Call 999 first
     2. Place person on firm, flat surface
     3. Begin chest compressions...
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/First-Aid-Buddy-Bot.git
cd First-Aid-Buddy-Bot

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r First_Aid_buddy/requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 5. Run the application
streamlit run First_Aid_buddy/app.py
```

Visit `http://localhost:8501` in your browser.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Key configuration options:

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | *Required* |
| `ENVIRONMENT` | Environment (development/production) | `development` |
| `LOG_LEVEL` | Logging level (DEBUG/INFO/WARNING) | `INFO` |
| `RATE_LIMIT_PER_MINUTE` | Max queries per minute | `10` |
| `MAX_INPUT_LENGTH` | Maximum input characters | `500` |
| `CLAUDE_MODEL` | Claude model to use | `claude-sonnet-4-5-20250929` |
| `EMERGENCY_NUMBER` | Emergency services number | `999` |
| `REGION` | Country/region for localization | `UK` |

See [.env.example](.env.example) for complete configuration options.

---

## 📖 Usage

### Web Interface

1. **Start the application:**
   ```bash
   streamlit run First_Aid_buddy/app.py
   ```

2. **Enter your API key** in the sidebar (or load from `.env`)

3. **Ask your question:**
   - "How do I treat a burn?"
   - "Someone is choking"
   - "I have a nosebleed"

4. **Get guidance:**
   - General queries: Conversational, educational response
   - Emergencies: Immediate action steps + call emergency services

### CLI Interface

For command-line usage:

```bash
python First_Aid_buddy/first_aid_bot.py
```

### Docker

```bash
# Using docker-compose
docker-compose up

# Or build and run manually
docker build -t first-aid-buddy .
docker run -p 8501:8501 -e ANTHROPIC_API_KEY=your-key first-aid-buddy
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────┐
│   User      │
│   Input     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Input Validation           │
│  - Length check             │
│  - Sanitization             │
│  - Prompt injection detect  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Rate Limiting              │
│  - Per-minute limit         │
│  - Per-hour limit           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Intent Classification      │
│  (Claude API)               │
│  → LIFE_THREATENING         │
│  → GENERAL_QUERY            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Document Retrieval         │
│  - Keyword matching         │
│  - Synonym expansion        │
│  - Top-K selection          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Answer Generation          │
│  (Claude API)               │
│  - Emergency: Action steps  │
│  - General: Conversational  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Response to User           │
│  + Emergency disclaimer     │
└─────────────────────────────┘
```

### Key Components

- **`core.py`:** Shared business logic (classification, retrieval, generation)
- **`config.py`:** Configuration management from environment variables
- **`logger.py`:** Structured logging with PII redaction
- **`app.py`:** Streamlit web interface
- **`first_aid_bot.py`:** Command-line interface

### Knowledge Base

The application uses a curated knowledge base of 15 first-aid topics:
- Minor cuts and scrapes
- Burns
- Choking (adult and infant)
- CPR
- Severe bleeding
- Allergic reactions
- Fractures
- And more...

**Note:** Medical content should be reviewed by qualified medical professionals before production use.

---

## 💻 Development

### Setup Development Environment

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/First-Aid-Buddy-Bot.git
cd First-Aid-Buddy-Bot

# Install development dependencies
pip install -r requirements-dev.txt

# Install pre-commit hooks (optional)
pre-commit install

# Run tests
pytest

# Run with coverage
pytest --cov=First_Aid_buddy --cov-report=html
```

### Code Quality Tools

```bash
# Format code
black First_Aid_buddy/

# Sort imports
isort First_Aid_buddy/

# Lint
flake8 First_Aid_buddy/ --max-line-length=120

# Type checking
mypy First_Aid_buddy/ --ignore-missing-imports

# Security scanning
bandit -r First_Aid_buddy/
```

### Project Structure

```
First-Aid-Buddy-Bot/
├── First_Aid_buddy/
│   ├── app.py                 # Streamlit web app
│   ├── first_aid_bot.py       # CLI interface
│   ├── core.py                # Core business logic
│   ├── config.py              # Configuration management
│   ├── logger.py              # Logging setup
│   └── requirements.txt       # Production dependencies
├── tests/
│   ├── conftest.py            # Pytest fixtures
│   ├── test_core.py           # Core functionality tests
│   ├── test_validation.py     # Input validation tests
│   └── test_rate_limiting.py  # Rate limiting tests
├── .github/
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Container definition
├── docker-compose.yml         # Docker orchestration
├── pytest.ini                 # Test configuration
├── LICENSE                    # MIT License
├── README.md                  # This file
├── CONTRIBUTING.md            # Contribution guidelines
├── TERMS_OF_SERVICE.md        # Legal terms
├── PRIVACY_POLICY.md          # Privacy policy
└── PRODUCTION_READINESS_AUDIT.md  # Security audit
```

---

## 🧪 Testing

### Run Tests

```bash
# All tests
pytest

# With coverage
pytest --cov=First_Aid_buddy --cov-report=html

# Specific test file
pytest tests/test_validation.py

# Specific test
pytest tests/test_validation.py::TestInputValidation::test_valid_input

# Verbose output
pytest -v
```

### Test Coverage

Current coverage: **70%+**

```bash
# Generate HTML coverage report
pytest --cov=First_Aid_buddy --cov-report=html
open htmlcov/index.html  # View in browser
```

### Writing Tests

See [CONTRIBUTING.md](CONTRIBUTING.md) for testing guidelines.

---

## 🚢 Deployment

### Docker Deployment (Recommended)

```bash
# 1. Build image
docker build -t first-aid-buddy .

# 2. Run container
docker run -d \
  --name first-aid-buddy \
  -p 8501:8501 \
  -e ANTHROPIC_API_KEY=your-key-here \
  --restart unless-stopped \
  first-aid-buddy

# 3. Check logs
docker logs -f first-aid-buddy
```

### Docker Compose

```bash
# 1. Create .env file with your API key
cp .env.example .env

# 2. Start services
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

### Cloud Deployment

#### AWS (Elastic Container Service)

1. Build and push to ECR
2. Create ECS task definition
3. Deploy to ECS service
4. Configure load balancer

#### Google Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/first-aid-buddy
gcloud run deploy first-aid-buddy --image gcr.io/PROJECT_ID/first-aid-buddy
```

#### Heroku

```bash
heroku create your-app-name
heroku stack:set container
git push heroku main
```

---

## 🔒 Security

### Security Features

- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ API key security (not logged, not stored server-side)
- ✅ CSRF protection (production)
- ✅ Logging with PII redaction
- ✅ Security scanning in CI/CD
- ✅ Dependency vulnerability checking

### Security Best Practices

1. **Never commit secrets** - Use `.env` for API keys
2. **Rotate API keys** regularly
3. **Enable CSRF protection** in production
4. **Monitor logs** for suspicious activity
5. **Keep dependencies updated**
6. **Review security audit** - See [PRODUCTION_READINESS_AUDIT.md](PRODUCTION_READINESS_AUDIT.md)

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Email: security@example.com

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code of Conduct
- Development setup
- Coding standards
- Testing requirements
- Pull request process

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests
5. Run tests and linting
6. Commit with conventional commits
7. Push and open a pull request

---

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Important:** See [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md) and [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for usage terms.

---

## 🙏 Acknowledgments

- **Anthropic** - For Claude AI API
- **Streamlit** - For the web framework
- **Medical Organizations** - First-aid guidelines based on:
  - British Red Cross
  - NHS (National Health Service, UK)
  - American Red Cross
  - Mayo Clinic

**Note:** Medical content should be reviewed and validated by qualified medical professionals before production deployment.

---

## 📞 Support

- **Documentation:** See this README and [PRODUCTION_READINESS_AUDIT.md](PRODUCTION_READINESS_AUDIT.md)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/First-Aid-Buddy-Bot/issues)
- **Security:** security@example.com

---

## 🚨 Emergency Numbers

Remember, in a real emergency, CALL EMERGENCY SERVICES immediately:

- **🇬🇧 UK:** 999 (Emergency) or 111 (NHS Non-Emergency)
- **🇺🇸 US:** 911
- **🇪🇺 EU:** 112
- **🇦🇺 Australia:** 000

**This application is NOT a replacement for professional medical care or emergency services.**

---

## 📊 Project Status

- ✅ Core functionality complete
- ✅ Security hardening complete
- ✅ Test coverage 70%+
- ✅ Docker deployment ready
- ⏳ Medical content review pending
- ⏳ Additional language support planned

---

**Made with ❤️ for public safety**

**Remember: When in doubt, seek professional medical help. Your safety is our priority.**
