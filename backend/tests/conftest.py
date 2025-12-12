"""Pytest configuration."""

import sys
from pathlib import Path

# Add src directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))
