"""
Backend package.
Loads backend/.env with override=True BEFORE any First_Aid_buddy module
imports in submodules, ensuring the correct ANTHROPIC_API_KEY and
ALLOWED_ORIGINS are in os.environ before Config class variables are set.
"""
import os
from dotenv import load_dotenv

_backend_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_backend_dir, ".env"), override=True)
