"""Unit tests for DeleteTask use case."""

import pytest
from datetime import datetime

from src.application.use_cases.delete_task import DeleteTaskUseCase
from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import EntityNotFoundError
from src.infrastructure.persistence.in_memory_task_repository import InMemoryTaskRepository


class TestDeleteTaskUseCase:
    """Test DeleteTask use case."""

    def test_delete_task_success(self):
        """Test successfully deleting a task."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Task to Delete",
            description="Test",
            is_complete=False,
            created_at=datetime.now(),
        )
        repository.add(task)

        assert repository.exists(1) is True
        assert repository.count() == 1

        use_case = DeleteTaskUseCase(repository)
        use_case.execute(task_id=1)

        assert repository.exists(1) is False
        assert repository.count() == 0

    def test_delete_task_nonexistent_raises_error(self):
        """Test that deleting non-existent task raises EntityNotFoundError."""
        repository = InMemoryTaskRepository()
        use_case = DeleteTaskUseCase(repository)

        with pytest.raises(EntityNotFoundError, match="Task with ID 999 not found"):
            use_case.execute(task_id=999)

    def test_delete_task_removes_from_list(self):
        """Test that deleted task is removed from task list."""
        repository = InMemoryTaskRepository()
        task1 = Task(id=1, title="Task 1", description="", is_complete=False, created_at=datetime.now())
        task2 = Task(id=2, title="Task 2", description="", is_complete=False, created_at=datetime.now())
        task3 = Task(id=3, title="Task 3", description="", is_complete=False, created_at=datetime.now())

        repository.add(task1)
        repository.add(task2)
        repository.add(task3)

        use_case = DeleteTaskUseCase(repository)
        use_case.execute(task_id=2)

        remaining_tasks = repository.get_all()
        assert len(remaining_tasks) == 2
        assert remaining_tasks[0].id == 1
        assert remaining_tasks[1].id == 3

    def test_delete_task_id_not_reused(self):
        """Test that deleted task ID is not reused for new tasks."""
        repository = InMemoryTaskRepository()
        task1 = Task(id=0, title="Task 1", description="", is_complete=False, created_at=datetime.now())
        task2 = Task(id=0, title="Task 2", description="", is_complete=False, created_at=datetime.now())

        added1 = repository.add(task1)
        added2 = repository.add(task2)
        assert added1.id == 1
        assert added2.id == 2

        # Delete task 1
        use_case = DeleteTaskUseCase(repository)
        use_case.execute(task_id=1)

        # Add new task - should get ID 3, not reuse ID 1
        task3 = Task(id=0, title="Task 3", description="", is_complete=False, created_at=datetime.now())
        added3 = repository.add(task3)
        assert added3.id == 3

    def test_delete_complete_task(self):
        """Test deleting a completed task."""
        repository = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Complete Task",
            description="Test",
            is_complete=True,
            created_at=datetime.now(),
        )
        repository.add(task)

        use_case = DeleteTaskUseCase(repository)
        use_case.execute(task_id=1)

        assert repository.exists(1) is False

    def test_delete_all_tasks(self):
        """Test deleting all tasks leaves repository empty."""
        repository = InMemoryTaskRepository()
        for i in range(1, 4):
            task = Task(
                id=i,
                title=f"Task {i}",
                description="",
                is_complete=False,
                created_at=datetime.now(),
            )
            repository.add(task)

        use_case = DeleteTaskUseCase(repository)
        use_case.execute(task_id=1)
        use_case.execute(task_id=2)
        use_case.execute(task_id=3)

        assert repository.count() == 0
        assert repository.get_all() == []
