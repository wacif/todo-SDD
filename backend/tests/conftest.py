"""Pytest configuration.

Ensures the backend's `src/` package is importable during tests.

This repo is a monorepo and also contains a top-level `src/` package.
To avoid import collisions, we explicitly prioritize `backend/` on `sys.path`.
"""

import sys
from pathlib import Path


backend_root = Path(__file__).resolve().parents[1]  # .../backend
repo_root = backend_root.parent  # .../

# Ensure `import src...` resolves to `backend/src`.
sys.path.insert(0, str(backend_root))

# If the monorepo root is present, de-prioritize it to avoid shadowing `backend/src`.
repo_root_str = str(repo_root)
if repo_root_str in sys.path[1:]:
	sys.path.remove(repo_root_str)
	sys.path.append(repo_root_str)
