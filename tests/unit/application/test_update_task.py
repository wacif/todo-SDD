"""Unit tests for UpdateTask use case."""

import pytest
from datetime import datetime

from src.application.use_cases.update_task import UpdateTaskUseCase
from src.application.dto.task_input_dto import TaskInputDTO
from src.application.dto.task_dto import TaskDTO
from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import EntityNotFoundError, ValidationError
from src.infrastructure.persistence.in_memory_task_repository import InMemoryTaskRepository


class TestUpdateTaskUseCase:
    """Test UpdateTask use case."""

    def test_update_task_both_title_and_description(self):
        """Test updating both title and description."""
        repository = InMemoryTaskRepository()
        now = datetime.now()
        task = Task(
            id=1,
            title="Original Title",
            description="Original Description",
            is_complete=False,
            created_at=now,
        )
        repository.add(task)

        use_case = UpdateTaskUseCase(repository)
        input_dto = TaskInputDTO(title="Updated Title", description="Updated Description")
        result = use_case.execute(task_id=1, input_dto=input_dto)

        assert isinstance(result, TaskDTO)
        assert result.id == 1
        assert result.title == "Updated Title"
        assert result.description == "Updated Description"
        # ID, is_complete, created_at should be preserved
        assert result.is_complete is False
        assert result.created_at == now

    def test_update_task_only_title(self):
        """Test updating only the title (description unchanged)."""
        repository = InMemoryTaskRepository()
        now = datetime.now()
        task = Task(
            id=1,
            title="Original Title",
            description="Original Description",
            is_complete=True,
            created_at=now,
        )
        repository.add(task)

        use_case = UpdateTaskUseCase(repository)
        input_dto = TaskInputDTO(title="New Title", description="Original Description")
        result = use_case.execute(task_id=1, input_dto=input_dto)

        assert result.title == "New Title"
        assert result.description == "Original Description"
        assert result.is_complete is True

    def test_update_task_only_description(self):
        """Test updating only the description (title unchanged)."""
        repository = InMemoryTaskRepository()
        now = datetime.now()
        task = Task(
            id=1,
            title="Original Title",
            description="Original Description",
            is_complete=False,
            created_at=now,
        )
        repository.add(task)

        use_case = UpdateTaskUseCase(repository)
        input_dto = TaskInputDTO(title="Original Title", description="New Description")
        result = use_case.execute(task_id=1, input_dto=input_dto)

        assert result.title == "Original Title"
        assert result.description == "New Description"

    def test_update_task_nonexistent_raises_error(self):
        """Test that updating non-existent task raises EntityNotFoundError."""
        repository = InMemoryTaskRepository()
        use_case = UpdateTaskUseCase(repository)

        input_dto = TaskInputDTO(title="New Title", description="New Description")

        with pytest.raises(EntityNotFoundError, match="Task with ID 999 not found"):
            use_case.execute(task_id=999, input_dto=input_dto)

    def test_update_task_empty_title_raises_validation_error(self):
        """Test that updating with empty title raises ValidationError."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Original Title",
            description="Original",
            is_complete=False,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = UpdateTaskUseCase(repository)
        input_dto = TaskInputDTO(title="", description="Test")

        with pytest.raises(ValidationError, match="Title cannot be empty"):
            use_case.execute(task_id=1, input_dto=input_dto)

    def test_update_task_title_too_long_raises_validation_error(self):
        """Test that updating with title > 200 chars raises ValidationError."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Original Title",
            description="Original",
            is_complete=False,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = UpdateTaskUseCase(repository)
        long_title = "a" * 201
        input_dto = TaskInputDTO(title=long_title, description="Test")

        with pytest.raises(ValidationError, match="Title exceeds maximum length"):
            use_case.execute(task_id=1, input_dto=input_dto)

    def test_update_task_preserves_id_and_created_at(self):
        """Test that update preserves ID and created_at."""
        repository = InMemoryTaskRepository()
        original_time = datetime(2024, 1, 1, 10, 0, 0)
        task = Task(
            id=42,
            title="Original Title",
            description="Original",
            is_complete=False,
            created_at=original_time,
        )
        repository.add(task)

        use_case = UpdateTaskUseCase(repository)
        input_dto = TaskInputDTO(title="Updated Title", description="Updated")
        result = use_case.execute(task_id=42, input_dto=input_dto)

        assert result.id == 42
        assert result.created_at == original_time

    def test_update_task_preserves_completion_status(self):
        """Test that update preserves completion status."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Original",
            description="Original",
            is_complete=True,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = UpdateTaskUseCase(repository)
        input_dto = TaskInputDTO(title="Updated", description="Updated")
        result = use_case.execute(task_id=1, input_dto=input_dto)

        assert result.is_complete is True
