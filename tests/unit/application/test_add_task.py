"""Unit tests for AddTask use case."""

import pytest
from datetime import datetime

from src.application.use_cases.add_task import AddTaskUseCase
from src.application.dto.task_input_dto import TaskInputDTO
from src.application.dto.task_dto import TaskDTO
from src.domain.exceptions.domain_exceptions import ValidationError
from src.infrastructure.persistence.in_memory_task_repository import InMemoryTaskRepository


class TestAddTaskUseCase:
    """Test AddTask use case."""

    def test_add_task_success(self):
        """Test successfully adding a task."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        input_dto = TaskInputDTO(title="Test Task", description="Test Description")
        result = use_case.execute(input_dto)

        assert isinstance(result, TaskDTO)
        assert result.id == 1
        assert result.title == "Test Task"
        assert result.description == "Test Description"
        assert result.is_complete is False
        assert isinstance(result.created_at, datetime)

    def test_add_task_with_minimal_data(self):
        """Test adding a task with minimal data (no description)."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        input_dto = TaskInputDTO(title="Minimal Task", description="")
        result = use_case.execute(input_dto)

        assert result.id == 1
        assert result.title == "Minimal Task"
        assert result.description == ""
        assert result.is_complete is False

    def test_add_multiple_tasks_auto_increment_id(self):
        """Test that adding multiple tasks auto-increments IDs."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        input1 = TaskInputDTO(title="First Task", description="")
        input2 = TaskInputDTO(title="Second Task", description="")
        input3 = TaskInputDTO(title="Third Task", description="")

        result1 = use_case.execute(input1)
        result2 = use_case.execute(input2)
        result3 = use_case.execute(input3)

        assert result1.id == 1
        assert result2.id == 2
        assert result3.id == 3

    def test_add_task_empty_title_raises_validation_error(self):
        """Test that adding a task with empty title raises ValidationError."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        input_dto = TaskInputDTO(title="", description="Test")

        with pytest.raises(ValidationError, match="Title cannot be empty"):
            use_case.execute(input_dto)

    def test_add_task_whitespace_only_title_raises_validation_error(self):
        """Test that adding a task with whitespace-only title raises ValidationError."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        input_dto = TaskInputDTO(title="   ", description="Test")

        with pytest.raises(ValidationError, match="Title cannot be empty"):
            use_case.execute(input_dto)

    def test_add_task_title_too_long_raises_validation_error(self):
        """Test that adding a task with title > 200 chars raises ValidationError."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        long_title = "a" * 201
        input_dto = TaskInputDTO(title=long_title, description="Test")

        with pytest.raises(ValidationError, match="Title exceeds maximum length"):
            use_case.execute(input_dto)

    def test_add_task_title_at_max_length_succeeds(self):
        """Test that adding a task with title exactly 200 chars succeeds."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        max_title = "a" * 200
        input_dto = TaskInputDTO(title=max_title, description="Test")
        result = use_case.execute(input_dto)

        assert len(result.title) == 200

    def test_add_task_description_too_long_raises_validation_error(self):
        """Test that adding a task with description > 1000 chars raises ValidationError."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        long_description = "a" * 1001
        input_dto = TaskInputDTO(title="Test Task", description=long_description)

        with pytest.raises(ValidationError, match="Description exceeds maximum length"):
            use_case.execute(input_dto)

    def test_add_task_persists_to_repository(self):
        """Test that added task is persisted in repository."""
        repository = InMemoryTaskRepository()
        use_case = AddTaskUseCase(repository)

        input_dto = TaskInputDTO(title="Persisted Task", description="Test")
        result = use_case.execute(input_dto)

        # Verify task exists in repository
        assert repository.exists(result.id)
        assert repository.count() == 1

        # Verify we can retrieve it
        retrieved = repository.get_by_id(result.id)
        assert retrieved.title == "Persisted Task"
