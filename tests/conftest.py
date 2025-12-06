"""Pytest configuration and shared fixtures."""

import pytest
from datetime import datetime


@pytest.fixture
def sample_task_data():
    """Provide sample task data for testing."""
    return {
        "id": 1,
        "title": "Test Task",
        "description": "Test Description",
        "is_complete": False,
        "created_at": datetime.now(),
    }


@pytest.fixture
def sample_tasks_list():
    """Provide a list of sample tasks for testing."""
    return [
        {
            "id": 1,
            "title": "First Task",
            "description": "First Description",
            "is_complete": False,
            "created_at": datetime.now(),
        },
        {
            "id": 2,
            "title": "Second Task",
            "description": "Second Description",
            "is_complete": True,
            "created_at": datetime.now(),
        },
        {
            "id": 3,
            "title": "Third Task",
            "description": "",
            "is_complete": False,
            "created_at": datetime.now(),
        },
    ]
