"""Unit tests for MarkTaskComplete use case."""

import pytest
from datetime import datetime

from src.application.use_cases.mark_task_complete import MarkTaskCompleteUseCase
from src.application.dto.task_dto import TaskDTO
from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import EntityNotFoundError
from src.infrastructure.persistence.in_memory_task_repository import InMemoryTaskRepository


class TestMarkTaskCompleteUseCase:
    """Test MarkTaskComplete use case."""

    def test_mark_task_complete_from_incomplete(self):
        """Test marking an incomplete task as complete."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="Test",
            is_complete=False,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = MarkTaskCompleteUseCase(repository)
        result = use_case.execute(task_id=1, complete=True)

        assert isinstance(result, TaskDTO)
        assert result.id == 1
        assert result.is_complete is True
        # Verify persistence
        updated_task = repository.get_by_id(1)
        assert updated_task.is_complete is True

    def test_mark_task_incomplete_from_complete(self):
        """Test marking a complete task as incomplete (toggle back)."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="Test",
            is_complete=True,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = MarkTaskCompleteUseCase(repository)
        result = use_case.execute(task_id=1, complete=False)

        assert result.is_complete is False
        # Verify persistence
        updated_task = repository.get_by_id(1)
        assert updated_task.is_complete is False

    def test_toggle_task_multiple_times(self):
        """Test toggling task status multiple times."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="Test",
            is_complete=False,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = MarkTaskCompleteUseCase(repository)

        # Toggle to complete
        result1 = use_case.execute(task_id=1, complete=True)
        assert result1.is_complete is True

        # Toggle back to incomplete
        result2 = use_case.execute(task_id=1, complete=False)
        assert result2.is_complete is False

        # Toggle to complete again
        result3 = use_case.execute(task_id=1, complete=True)
        assert result3.is_complete is True

    def test_mark_complete_nonexistent_task_raises_error(self):
        """Test that marking non-existent task raises EntityNotFoundError."""
        repository = InMemoryTaskRepository()
        use_case = MarkTaskCompleteUseCase(repository)

        with pytest.raises(EntityNotFoundError, match="Task with ID 999 not found"):
            use_case.execute(task_id=999, complete=True)

    def test_idempotent_marking_complete(self):
        """Test that marking an already complete task as complete is idempotent."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="Test",
            is_complete=True,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = MarkTaskCompleteUseCase(repository)
        result = use_case.execute(task_id=1, complete=True)

        assert result.is_complete is True
        # Should still be complete
        updated_task = repository.get_by_id(1)
        assert updated_task.is_complete is True

    def test_idempotent_marking_incomplete(self):
        """Test that marking an already incomplete task as incomplete is idempotent."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="Test",
            is_complete=False,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = MarkTaskCompleteUseCase(repository)
        result = use_case.execute(task_id=1, complete=False)

        assert result.is_complete is False

    def test_mark_complete_preserves_other_fields(self):
        """Test that marking complete preserves title, description, id, created_at."""
        repository = InMemoryTaskRepository()
        now = datetime.now()
        task = Task(
            id=42,
            title="Original Title",
            description="Original Description",
            is_complete=False,
            created_at=now,
        )
        repository.add(task)

        use_case = MarkTaskCompleteUseCase(repository)
        result = use_case.execute(task_id=42, complete=True)

        assert result.id == 42
        assert result.title == "Original Title"
        assert result.description == "Original Description"
        assert result.created_at == now
        assert result.is_complete is True
