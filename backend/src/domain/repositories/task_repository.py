"""Task repository interface - evolved from Phase I with user filtering."""

from typing import Protocol

from src.domain.entities.task import Task


class TaskRepository(Protocol):
    """
    Repository interface for Task entity persistence.

    This is a port in Clean Architecture - implementations are in infrastructure layer.
    Defines the contract for task storage operations with user isolation.
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
            EntityNotFoundError: If user_id does not exist
        """
        ...

    def get_by_id(self, task_id: int, user_id: str) -> Task:
        """
        Retrieve a task by its ID (user-scoped).

        Args:
            task_id: Unique task identifier
            user_id: Owner of the task (for authorization)

        Returns:
            Task entity

        Raises:
            EntityNotFoundError: If task does not exist or belongs to different user
            UnauthorizedError: If task exists but belongs to different user
        """
        ...

    def list_by_user(
        self,
        user_id: str,
        status: str | None = None,
        priority: str | None = None,
        tag: str | None = None,
        q: str | None = None,
        sort: str | None = None,
        order: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Task]:
        """
        Retrieve all tasks for a specific user.

        Args:
            user_id: Unique user identifier

        Returns:
            List of task entities (may be empty), ordered by created_at DESC
        """
        ...

    def count_by_user(
        self,
        user_id: str,
        status: str | None = None,
        priority: str | None = None,
        tag: str | None = None,
        q: str | None = None,
    ) -> int:
        """Count tasks for a user, with optional filters applied."""
        ...

    def update(self, task: Task) -> Task:
        """
        Update an existing task.

        Args:
            task: Task entity with updated fields

        Returns:
            Updated task entity

        Raises:
            EntityNotFoundError: If task does not exist
            UnauthorizedError: If task belongs to different user
        """
        ...

    def delete(self, task_id: int, user_id: str) -> None:
        """
        Delete a task (user-scoped).

        Args:
            task_id: Unique task identifier
            user_id: Owner of the task (for authorization)

        Raises:
            EntityNotFoundError: If task does not exist
            UnauthorizedError: If task belongs to different user
        """
        ...
