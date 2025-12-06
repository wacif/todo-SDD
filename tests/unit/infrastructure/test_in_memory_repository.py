"""Unit tests for InMemoryTaskRepository."""

import pytest
from datetime import datetime

from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import EntityNotFoundError, DuplicateEntityError
from src.infrastructure.persistence.in_memory_task_repository import InMemoryTaskRepository


class TestInMemoryTaskRepositoryBasicOperations:
    """Test basic CRUD operations."""

    def test_add_task(self):
        """Test adding a task to the repository."""
        repo = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="Test Description",
            is_complete=False,
            created_at=datetime.now(),
        )
        added_task = repo.add(task)
        assert added_task.id == 1
        assert added_task.title == "Test Task"

    def test_get_by_id_existing_task(self):
        """Test retrieving an existing task by ID."""
        repo = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="Test",
            is_complete=False,
            created_at=datetime.now(),
        )
        repo.add(task)
        retrieved_task = repo.get_by_id(1)
        assert retrieved_task.id == 1
        assert retrieved_task.title == "Test Task"

    def test_get_by_id_nonexistent_task_raises_error(self):
        """Test that getting a non-existent task raises EntityNotFoundError."""
        repo = InMemoryTaskRepository()
        with pytest.raises(EntityNotFoundError, match="Task with ID 999 not found"):
            repo.get_by_id(999)

    def test_get_all_empty_repository(self):
        """Test getting all tasks from empty repository."""
        repo = InMemoryTaskRepository()
        tasks = repo.get_all()
        assert tasks == []

    def test_get_all_returns_ordered_by_created_at(self):
        """Test that get_all returns tasks ordered by created_at (oldest first)."""
        repo = InMemoryTaskRepository()
        now = datetime.now()
        task1 = Task(id=1, title="First", description="", is_complete=False, created_at=now)
        task2 = Task(
            id=2,
            title="Second",
            description="",
            is_complete=False,
            created_at=datetime(now.year, now.month, now.day, now.hour, now.minute, now.second + 1),
        )
        task3 = Task(
            id=3,
            title="Third",
            description="",
            is_complete=False,
            created_at=datetime(now.year, now.month, now.day, now.hour, now.minute, now.second + 2),
        )
        repo.add(task2)
        repo.add(task1)
        repo.add(task3)

        tasks = repo.get_all()
        assert len(tasks) == 3
        assert tasks[0].id == 1
        assert tasks[1].id == 2
        assert tasks[2].id == 3

    def test_update_task(self):
        """Test updating an existing task."""
        repo = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Original Title",
            description="Original",
            is_complete=False,
            created_at=datetime.now(),
        )
        repo.add(task)

        updated_task = Task(
            id=1,
            title="Updated Title",
            description="Updated",
            is_complete=True,
            created_at=task.created_at,
        )
        result = repo.update(updated_task)
        assert result.title == "Updated Title"
        assert result.description == "Updated"
        assert result.is_complete is True

    def test_update_nonexistent_task_raises_error(self):
        """Test that updating a non-existent task raises EntityNotFoundError."""
        repo = InMemoryTaskRepository()
        task = Task(
            id=999,
            title="Nonexistent",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        with pytest.raises(EntityNotFoundError, match="Task with ID 999 not found"):
            repo.update(task)

    def test_delete_task(self):
        """Test deleting a task."""
        repo = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        repo.add(task)
        assert repo.exists(1) is True

        repo.delete(1)
        assert repo.exists(1) is False

    def test_delete_nonexistent_task_raises_error(self):
        """Test that deleting a non-existent task raises EntityNotFoundError."""
        repo = InMemoryTaskRepository()
        with pytest.raises(EntityNotFoundError, match="Task with ID 999 not found"):
            repo.delete(999)

    def test_exists_returns_true_for_existing_task(self):
        """Test that exists returns True for existing task."""
        repo = InMemoryTaskRepository()
        task = Task(
            id=1,
            title="Test Task",
            description="",
            is_complete=False,
            created_at=datetime.now(),
        )
        repo.add(task)
        assert repo.exists(1) is True

    def test_exists_returns_false_for_nonexistent_task(self):
        """Test that exists returns False for non-existent task."""
        repo = InMemoryTaskRepository()
        assert repo.exists(999) is False

    def test_count_empty_repository(self):
        """Test count on empty repository."""
        repo = InMemoryTaskRepository()
        assert repo.count() == 0

    def test_count_with_tasks(self):
        """Test count with multiple tasks."""
        repo = InMemoryTaskRepository()
        for i in range(1, 6):
            task = Task(
                id=i,
                title=f"Task {i}",
                description="",
                is_complete=False,
                created_at=datetime.now(),
            )
            repo.add(task)
        assert repo.count() == 5


class TestInMemoryTaskRepositoryIDManagement:
    """Test ID auto-increment and non-reuse behavior."""

    def test_auto_increment_id_generation(self):
        """Test that repository auto-generates sequential IDs."""
        repo = InMemoryTaskRepository()
        # Create tasks without specifying ID (using 0 as placeholder)
        task1 = Task(id=0, title="Task 1", description="", is_complete=False, created_at=datetime.now())
        task2 = Task(id=0, title="Task 2", description="", is_complete=False, created_at=datetime.now())
        task3 = Task(id=0, title="Task 3", description="", is_complete=False, created_at=datetime.now())

        added1 = repo.add(task1)
        added2 = repo.add(task2)
        added3 = repo.add(task3)

        assert added1.id == 1
        assert added2.id == 2
        assert added3.id == 3

    def test_id_not_reused_after_deletion(self):
        """Test that deleted IDs are not reused."""
        repo = InMemoryTaskRepository()
        task1 = Task(id=0, title="Task 1", description="", is_complete=False, created_at=datetime.now())
        task2 = Task(id=0, title="Task 2", description="", is_complete=False, created_at=datetime.now())

        added1 = repo.add(task1)
        added2 = repo.add(task2)
        assert added1.id == 1
        assert added2.id == 2

        # Delete task with ID 1
        repo.delete(1)

        # Add a new task - should get ID 3, not reuse ID 1
        task3 = Task(id=0, title="Task 3", description="", is_complete=False, created_at=datetime.now())
        added3 = repo.add(task3)
        assert added3.id == 3

    def test_duplicate_id_raises_error(self):
        """Test that adding a task with existing ID raises DuplicateEntityError."""
        repo = InMemoryTaskRepository()
        task1 = Task(id=1, title="Task 1", description="", is_complete=False, created_at=datetime.now())
        repo.add(task1)

        task2 = Task(id=1, title="Task 2", description="", is_complete=False, created_at=datetime.now())
        with pytest.raises(DuplicateEntityError, match="Task with ID 1 already exists"):
            repo.add(task2)

    def test_manual_id_assignment_works(self):
        """Test that manually assigned IDs are respected."""
        repo = InMemoryTaskRepository()
        task = Task(id=42, title="Manual ID", description="", is_complete=False, created_at=datetime.now())
        added = repo.add(task)
        assert added.id == 42

    def test_next_auto_id_after_manual_assignment(self):
        """Test that auto-increment continues correctly after manual ID assignment."""
        repo = InMemoryTaskRepository()
        # Manually assign ID 10
        task1 = Task(id=10, title="Manual", description="", is_complete=False, created_at=datetime.now())
        repo.add(task1)

        # Next auto-generated ID should be 11
        task2 = Task(id=0, title="Auto", description="", is_complete=False, created_at=datetime.now())
        added2 = repo.add(task2)
        assert added2.id == 11
