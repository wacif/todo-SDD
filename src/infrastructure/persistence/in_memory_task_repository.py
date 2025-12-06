"""In-memory implementation of TaskRepository."""

from dataclasses import replace

from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import DuplicateEntityError, EntityNotFoundError


class InMemoryTaskRepository:
    """
    In-memory implementation of TaskRepository using a dictionary.

    Business Rules:
        - IDs are auto-incremented monotonically
        - Deleted IDs are never reused
        - Tasks are stored in a dictionary keyed by ID
        - Tasks are returned ordered by created_at (oldest first)
    """

    def __init__(self):
        """Initialize the repository with empty storage."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add(self, task: Task) -> Task:
        """
        Add a new task to the repository.

        If task.id is 0, auto-generate a new ID.
        If task.id is provided and unique, use it and update next_id accordingly.

        Args:
            task: Task entity to add

        Returns:
            The added task with assigned ID

        Raises:
            DuplicateEntityError: If task with same ID already exists
        """
        if task.id != 0 and task.id in self._tasks:
            raise DuplicateEntityError(f"Task with ID {task.id} already exists")

        # Auto-generate ID if task.id is 0
        if task.id == 0:
            task_id = self._next_id
            self._next_id += 1
            task = replace(task, id=task_id)
        else:
            # Manual ID assignment - update next_id if necessary
            if task.id >= self._next_id:
                self._next_id = task.id + 1

        self._tasks[task.id] = task
        return task

    def get_by_id(self, task_id: int) -> Task:
        """
        Retrieve a task by its ID.

        Args:
            task_id: Unique task identifier

        Returns:
            Task entity

        Raises:
            EntityNotFoundError: If task with given ID does not exist
        """
        if task_id not in self._tasks:
            raise EntityNotFoundError(f"Task with ID {task_id} not found")
        return self._tasks[task_id]

    def get_all(self) -> list[Task]:
        """
        Retrieve all tasks ordered by created_at (oldest first).

        Returns:
            List of all tasks, empty list if no tasks exist
        """
        return sorted(self._tasks.values(), key=lambda task: task.created_at)

    def update(self, task: Task) -> Task:
        """
        Update an existing task.

        Args:
            task: Task entity with updated values

        Returns:
            The updated task

        Raises:
            EntityNotFoundError: If task with given ID does not exist
        """
        if task.id not in self._tasks:
            raise EntityNotFoundError(f"Task with ID {task.id} not found")
        self._tasks[task.id] = task
        return task

    def delete(self, task_id: int) -> None:
        """
        Delete a task by its ID.

        Note: Deleted IDs are never reused due to monotonic next_id counter.

        Args:
            task_id: Unique task identifier

        Raises:
            EntityNotFoundError: If task with given ID does not exist
        """
        if task_id not in self._tasks:
            raise EntityNotFoundError(f"Task with ID {task_id} not found")
        del self._tasks[task_id]

    def exists(self, task_id: int) -> bool:
        """
        Check if a task exists.

        Args:
            task_id: Unique task identifier

        Returns:
            True if task exists, False otherwise
        """
        return task_id in self._tasks

    def count(self) -> int:
        """
        Count total number of tasks.

        Returns:
            Number of tasks in repository
        """
        return len(self._tasks)
