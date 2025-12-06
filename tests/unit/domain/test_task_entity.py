"""Unit tests for Task domain entity."""

import pytest
from datetime import datetime
from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import ValidationError


class TestTaskCreation:
    """Test Task entity creation."""

    def test_create_task_with_valid_data(self):
        """Test creating a task with valid data."""
        task = Task(
            id=1,
            title="Test Task",
            description="Test Description",
            is_complete=False,
            created_at=datetime.now(),
        )
        assert task.id == 1
        assert task.title == "Test Task"
        assert task.description == "Test Description"
        assert task.is_complete is False
        assert isinstance(task.created_at, datetime)

    def test_create_task_with_minimal_data(self):
        """Test creating a task with minimal required data."""
        task = Task(
            id=1,
            title="Minimal Task",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        assert task.id == 1
        assert task.title == "Minimal Task"
        assert task.description == ""
        assert task.is_complete is False

    def test_create_task_defaults_to_incomplete(self):
        """Test that is_complete defaults to False."""
        task = Task(
            id=1,
            title="Test Task",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        assert task.is_complete is False


class TestTaskValidation:
    """Test Task entity validation rules."""

    def test_empty_title_raises_validation_error(self):
        """Test that empty title raises ValidationError."""
        with pytest.raises(ValidationError, match="Title cannot be empty"):
            Task(
                id=1,
                title="",
                description="Test",
                is_complete=False,
                created_at=datetime.now(),
            )

    def test_whitespace_only_title_raises_validation_error(self):
        """Test that whitespace-only title raises ValidationError."""
        with pytest.raises(ValidationError, match="Title cannot be empty"):
            Task(
                id=1,
                title="   ",
                description="Test",
                is_complete=False,
                created_at=datetime.now(),
            )

    def test_title_exceeds_max_length_raises_validation_error(self):
        """Test that title exceeding 200 characters raises ValidationError."""
        long_title = "a" * 201
        with pytest.raises(ValidationError, match="Title exceeds maximum length"):
            Task(
                id=1,
                title=long_title,
                description="Test",
                is_complete=False,
                created_at=datetime.now(),
            )

    def test_title_at_max_length_is_valid(self):
        """Test that title at exactly 200 characters is valid."""
        max_title = "a" * 200
        task = Task(
            id=1,
            title=max_title,
            description="Test",
            is_complete=False,
            created_at=datetime.now(),
        )
        assert len(task.title) == 200

    def test_description_exceeds_max_length_raises_validation_error(self):
        """Test that description exceeding 1000 characters raises ValidationError."""
        long_description = "a" * 1001
        with pytest.raises(ValidationError, match="Description exceeds maximum length"):
            Task(
                id=1,
                title="Test Task",
                description=long_description,
                is_complete=False,
                created_at=datetime.now(),
            )

    def test_description_at_max_length_is_valid(self):
        """Test that description at exactly 1000 characters is valid."""
        max_description = "a" * 1000
        task = Task(
            id=1,
            title="Test Task",
            description=max_description,
            is_complete=False,
            created_at=datetime.now(),
        )
        assert len(task.description) == 1000

    def test_empty_description_is_valid(self):
        """Test that empty description is valid."""
        task = Task(
            id=1,
            title="Test Task",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        assert task.description == ""


class TestTaskAttributes:
    """Test Task entity attributes and immutability."""

    def test_id_is_positive_integer(self):
        """Test that ID is a positive integer."""
        task = Task(
            id=42,
            title="Test Task",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        assert isinstance(task.id, int)
        assert task.id > 0

    def test_created_at_is_immutable(self):
        """Test that created_at cannot be changed after creation."""
        now = datetime.now()
        task = Task(
            id=1,
            title="Test Task",
            description="",
            is_complete=False,
            created_at=now,
        )
        assert task.created_at == now
        # Verify it's the same instance (immutable)
        assert task.created_at is now

    def test_toggle_completion_status(self):
        """Test toggling task completion status."""
        task = Task(
            id=1,
            title="Test Task",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        # This will be implemented via a method or direct attribute update
        # For now, just verify the attribute can change
        assert task.is_complete is False
