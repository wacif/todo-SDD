"""Unit tests for ListTasks use case."""

import pytest
from datetime import datetime

from src.application.use_cases.list_tasks import ListTasksUseCase
from src.application.dto.task_dto import TaskDTO
from src.domain.entities.task import Task
from src.infrastructure.persistence.in_memory_task_repository import InMemoryTaskRepository


class TestListTasksUseCase:
    """Test ListTasks use case."""

    def test_list_tasks_empty_repository(self):
        """Test listing tasks when repository is empty."""
        repository = InMemoryTaskRepository()
        use_case = ListTasksUseCase(repository)

        result = use_case.execute()

        assert isinstance(result, list)
        assert len(result) == 0

    def test_list_tasks_single_task(self):
        """Test listing tasks with one task."""
        repository = InMemoryTaskRepository()
        now = datetime.now()
        task = Task(
            id=1,
            title="Single Task",
            description="Test",
            is_complete=False,
            created_at=now,
        )
        repository.add(task)

        use_case = ListTasksUseCase(repository)
        result = use_case.execute()

        assert len(result) == 1
        assert isinstance(result[0], TaskDTO)
        assert result[0].id == 1
        assert result[0].title == "Single Task"

    def test_list_tasks_multiple_tasks(self):
        """Test listing multiple tasks."""
        repository = InMemoryTaskRepository()
        now = datetime.now()

        # Add tasks in non-chronological order
        task2 = Task(id=2, title="Second", description="", is_complete=False, created_at=now)
        task1 = Task(
            id=1,
            title="First",
            description="",
            is_complete=False,
            created_at=datetime(now.year, now.month, now.day, now.hour, now.minute - 1, now.second),
        )
        task3 = Task(
            id=3,
            title="Third",
            description="",
            is_complete=True,
            created_at=datetime(now.year, now.month, now.day, now.hour, now.minute + 1, now.second),
        )

        repository.add(task2)
        repository.add(task1)
        repository.add(task3)

        use_case = ListTasksUseCase(repository)
        result = use_case.execute()

        assert len(result) == 3
        # Should be ordered by created_at (oldest first)
        assert result[0].title == "First"
        assert result[1].title == "Second"
        assert result[2].title == "Third"

    def test_list_tasks_ordered_by_created_at(self):
        """Test that tasks are ordered by created_at (oldest first)."""
        repository = InMemoryTaskRepository()
        now = datetime.now()

        # Create tasks with explicit timestamps
        task1 = Task(
            id=1,
            title="Task 1",
            description="",
            is_complete=False,
            created_at=datetime(2024, 1, 1, 10, 0, 0),
        )
        task2 = Task(
            id=2,
            title="Task 2",
            description="",
            is_complete=False,
            created_at=datetime(2024, 1, 1, 11, 0, 0),
        )
        task3 = Task(
            id=3,
            title="Task 3",
            description="",
            is_complete=False,
            created_at=datetime(2024, 1, 1, 9, 0, 0),
        )

        # Add in random order
        repository.add(task2)
        repository.add(task1)
        repository.add(task3)

        use_case = ListTasksUseCase(repository)
        result = use_case.execute()

        # Should be ordered: task3 (9am), task1 (10am), task2 (11am)
        assert result[0].id == 3
        assert result[1].id == 1
        assert result[2].id == 2

    def test_list_tasks_includes_complete_and_incomplete(self):
        """Test that list includes both complete and incomplete tasks."""
        repository = InMemoryTaskRepository()
        now = datetime.now()

        task1 = Task(id=1, title="Complete", description="", is_complete=True, created_at=now)
        task2 = Task(id=2, title="Incomplete", description="", is_complete=False, created_at=now)

        repository.add(task1)
        repository.add(task2)

        use_case = ListTasksUseCase(repository)
        result = use_case.execute()

        assert len(result) == 2
        complete_tasks = [t for t in result if t.is_complete]
        incomplete_tasks = [t for t in result if not t.is_complete]
        assert len(complete_tasks) == 1
        assert len(incomplete_tasks) == 1

    def test_list_tasks_returns_task_dtos(self):
        """Test that list returns TaskDTO objects, not Task entities."""
        repository = InMemoryTaskRepository()
        now = datetime.now()

        task = Task(id=1, title="DTO Test", description="Test", is_complete=False, created_at=now)
        repository.add(task)

        use_case = ListTasksUseCase(repository)
        result = use_case.execute()

        assert isinstance(result[0], TaskDTO)
        assert not isinstance(result[0], Task)

    def test_list_tasks_preserves_all_fields(self):
        """Test that all task fields are preserved in DTOs."""
        repository = InMemoryTaskRepository()
        now = datetime.now()

        task = Task(
            id=42,
            title="Test Title",
            description="Test Description",
            is_complete=True,
            created_at=now,
        )
        repository.add(task)

        use_case = ListTasksUseCase(repository)
        result = use_case.execute()

        dto = result[0]
        assert dto.id == 42
        assert dto.title == "Test Title"
        assert dto.description == "Test Description"
        assert dto.is_complete is True
        assert dto.created_at == now
