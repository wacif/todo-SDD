"""Task repository interface - port for persistence."""

from typing import Protocol

from src.domain.entities.task import Task


class TaskRepository(Protocol):
    """
    Repository interface for Task entity persistence.

    This is a port in Clean Architecture - implementations are in infrastructure layer.
    Defines the contract for task storage operations.
    """

    def add(self, task: Task) -> Task:
        """
        Add a new task to the repository.

        Args:
            task: Task entity to add

        Returns:
            The added task with auto-generated ID

        Raises:
            DuplicateEntityError: If task with same ID already exists
        """
        ...

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
        ...

    def get_all(self) -> list[Task]:
        """
        Retrieve all tasks ordered by created_at (oldest first).

        Returns:
            List of all tasks, empty list if no tasks exist
        """
        ...

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
        ...

    def delete(self, task_id: int) -> None:
        """
        Delete a task by its ID.

        Args:
            task_id: Unique task identifier

        Raises:
            EntityNotFoundError: If task with given ID does not exist
        """
        ...

    def exists(self, task_id: int) -> bool:
        """
        Check if a task exists.

        Args:
            task_id: Unique task identifier

        Returns:
            True if task exists, False otherwise
        """
        ...

    def count(self) -> int:
        """
        Count total number of tasks.

        Returns:
            Number of tasks in repository
        """
        ...
