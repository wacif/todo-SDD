"""List tasks use case - retrieve all tasks for a user."""

from src.application.dto.task_dto import TaskDTO
from src.domain.repositories.task_repository import TaskRepository


class ListTasksUseCase:
    """
    Use case for listing all tasks for a specific user.

    Responsibilities:
        - Accept user_id from interface layer
        - Retrieve all tasks for user via repository
        - Return list of TaskDTOs to interface layer

    Business Rules:
        - Only returns tasks owned by specified user
        - Tasks ordered by created_at DESC (newest first)
        - Empty list if user has no tasks
    """

    def __init__(self, task_repository: TaskRepository) -> None:
        """
        Initialize use case with repository dependency.

        Args:
            task_repository: Repository for task retrieval
        """
        self._task_repository = task_repository

    def execute(self, user_id: str) -> list[TaskDTO]:
        """
        Execute the list tasks use case.

        Args:
            user_id: Unique user identifier

        Returns:
            List of TaskDTOs (may be empty)
        """
        # Retrieve all tasks for user
        tasks = self._task_repository.list_by_user(user_id)

        # Convert to DTOs
        return [
            TaskDTO(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                created_at=task.created_at,
                updated_at=task.updated_at,
            )
            for task in tasks
        ]
