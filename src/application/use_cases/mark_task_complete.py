"""MarkTaskComplete use case - toggle task completion status."""

from dataclasses import replace

from src.application.dto.task_dto import TaskDTO
from src.domain.repositories.task_repository import TaskRepository


class MarkTaskCompleteUseCase:
    """
    Use case for marking a task as complete or incomplete.

    This toggles the completion status of a task.

    Responsibilities:
        - Retrieve task by ID
        - Update is_complete status
        - Persist updated task
        - Return TaskDTO to interface layer

    Business Rules:
        - Can toggle between complete (True) and incomplete (False)
        - Idempotent - marking already complete task as complete is safe
        - All other fields (title, description, created_at) are preserved
    """

    def __init__(self, repository: TaskRepository):
        """
        Initialize use case with repository dependency.

        Args:
            repository: TaskRepository implementation for persistence
        """
        self._repository = repository

    def execute(self, task_id: int, complete: bool) -> TaskDTO:
        """
        Execute the mark task complete use case.

        Args:
            task_id: ID of the task to update
            complete: True to mark complete, False to mark incomplete

        Returns:
            TaskDTO with updated completion status

        Raises:
            EntityNotFoundError: If task with given ID does not exist
        """
        # Retrieve existing task
        task = self._repository.get_by_id(task_id)

        # Update completion status (Task is frozen, use replace)
        updated_task = replace(task, is_complete=complete)

        # Persist changes
        saved_task = self._repository.update(updated_task)

        # Convert to DTO for interface layer
        return TaskDTO(
            id=saved_task.id,
            title=saved_task.title,
            description=saved_task.description,
            is_complete=saved_task.is_complete,
            created_at=saved_task.created_at,
        )
