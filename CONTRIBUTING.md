# Contributing to First-Aid Buddy Bot

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Code Style](#code-style)
7. [Pull Request Process](#pull-request-process)
8. [Medical Content Guidelines](#medical-content-guidelines)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and beginners
- Focus on what's best for the community
- Show empathy towards others
- Accept constructive criticism gracefully

### Unacceptable Behavior

- Harassment, discrimination, or trolling
- Publishing others' private information
- Unprofessional or disrespectful comments
- Any conduct that could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Git
- Anthropic API key (for testing)
- Docker (optional, for containerized development)

### Ways to Contribute

- 🐛 **Bug Reports:** Found a bug? Open an issue!
- ✨ **Feature Requests:** Have an idea? We'd love to hear it!
- 📝 **Documentation:** Help improve our docs
- 🧪 **Testing:** Add or improve tests
- 💻 **Code:** Fix bugs or implement features
- 🏥 **Medical Content:** Review or improve first-aid guidance (requires medical expertise)

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/First-Aid-Buddy-Bot.git
cd First-Aid-Buddy-Bot
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r First_Aid_buddy/requirements.txt
pip install pytest pytest-cov pytest-mock  # For testing
pip install black flake8 isort mypy  # For code quality
```

### 4. Set Up Environment

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 5. Run Tests

```bash
pytest tests/ -v
```

### 6. Run Application

```bash
streamlit run First_Aid_buddy/app.py
```

---

## Making Changes

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation changes
- `test/description` - Test additions/changes
- `refactor/description` - Code refactoring

Example: `feature/add-multilingual-support`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test changes
- `refactor`: Code refactoring
- `style`: Code style changes (formatting, etc.)
- `chore`: Maintenance tasks

Examples:
```
feat(core): add multilingual support for emergency responses

fix(validation): prevent XSS in user input
Closes #123

docs(readme): update installation instructions

test(core): add tests for rate limiting functionality
```

---

## Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=First_Aid_buddy --cov-report=html

# Run specific test file
pytest tests/test_validation.py

# Run specific test
pytest tests/test_validation.py::TestInputValidation::test_valid_input
```

### Writing Tests

- Place tests in `tests/` directory
- Name test files `test_*.py`
- Name test functions `test_*`
- Use descriptive names
- Test both success and failure cases
- Mock external API calls (don't use real API in tests)

Example:
```python
def test_valid_input_accepted():
    """Test that valid input is accepted"""
    result = validate_input("I have a cut on my finger")
    assert result == "I have a cut on my finger"
```

### Test Coverage

- Aim for **80%+ code coverage**
- All new code must have tests
- Don't decrease existing coverage

---

## Code Style

### Python Style Guide

We follow [PEP 8](https://pep8.org/) with some modifications:

- **Line Length:** Max 120 characters
- **Quotes:** Prefer double quotes `"` over single quotes `'`
- **Imports:** Sorted with `isort`
- **Formatting:** Auto-formatted with `black`
- **Type Hints:** Required for all functions

### Code Formatting

Before committing, run:

```bash
# Format code
black First_Aid_buddy/

# Sort imports
isort First_Aid_buddy/

# Check linting
flake8 First_Aid_buddy/ --max-line-length=120

# Type checking
mypy First_Aid_buddy/ --ignore-missing-imports
```

### Docstrings

Use Google-style docstrings:

```python
def function_name(param1: str, param2: int) -> bool:
    """
    Brief description of function

    Args:
        param1: Description of param1
        param2: Description of param2

    Returns:
        Description of return value

    Raises:
        ErrorType: When this error occurs
    """
    pass
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New code has tests
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No secrets or API keys in code
- [ ] CHANGELOG.md updated (if applicable)

### Submitting PR

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request**
   - Go to GitHub and open a PR
   - Use a clear, descriptive title
   - Fill out the PR template
   - Link related issues

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests
   - [ ] Manual testing performed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes

   ## Related Issues
   Closes #123
   ```

### Code Review

- Be patient and respectful
- Respond to feedback constructively
- Make requested changes or explain why not
- Keep discussions focused on the code

### After Approval

- Squash commits if requested
- Ensure CI passes
- Wait for maintainer to merge

---

## Medical Content Guidelines

### ⚠️ IMPORTANT: Medical Accuracy

Medical content must be:
- **Accurate** and evidence-based
- **Reviewed** by qualified medical professionals
- **Sourced** from reputable medical organizations
- **Current** and up-to-date
- **Clear** and easy to understand

### Adding Medical Content

1. **Source Requirement**
   - Must cite source (e.g., Red Cross, NHS, Mayo Clinic)
   - Include link or reference

2. **Review Requirement**
   - Medical content requires review by qualified medical professional
   - Tag PR with `medical-review-required`

3. **Disclaimer Requirement**
   - Ensure proper disclaimers are in place
   - Content should not replace professional medical advice

4. **Format**
   ```python
   "Topic: Brief clear instruction. Step-by-step guidance. When to seek professional help."
   ```

### Emergency Numbers

- Use config variables: `{Config.EMERGENCY_NUMBER}` and `{Config.NON_EMERGENCY_NUMBER}`
- Don't hardcode numbers (e.g., don't use "999" directly)

---

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email: [security@example.com]
2. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
3. Allow time for fix before public disclosure

### Security Guidelines

- Never commit API keys, secrets, or credentials
- Validate and sanitize all user input
- Follow principle of least privilege
- Keep dependencies up to date
- Use security scanning tools

---

## Questions?

- 💬 **Discussions:** Use GitHub Discussions for questions
- 🐛 **Bugs:** Open an issue
- 📧 **Email:** [contact@example.com]

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Recognition

Contributors will be recognized in:
- README.md (Contributors section)
- Release notes
- Project documentation

Thank you for making First-Aid Buddy Bot better! 🏥❤️
