"""Mark task complete use case - toggle task completion status."""

from datetime import datetime

from src.application.dto.task_dto import TaskDTO
from src.domain.entities.task import Task
from src.domain.repositories.task_repository import TaskRepository


class MarkTaskCompleteUseCase:
    """
    Use case for marking a task as complete (or incomplete).

    Responsibilities:
        - Accept task_id, user_id, and completed status
        - Retrieve existing task via repository
        - Update completed field
        - Persist updated task via repository
        - Return TaskDTO to interface layer

    Business Rules:
        - Only task owner can update completion status
        - updated_at is refreshed on status change
        - Can toggle both directions (complete → incomplete)
    """

    def __init__(self, task_repository: TaskRepository) -> None:
        """
        Initialize use case with repository dependency.

        Args:
            task_repository: Repository for task persistence
        """
        self._task_repository = task_repository

    def execute(self, task_id: int, user_id: str, completed: bool) -> TaskDTO:
        """
        Execute the mark task complete use case.

        Args:
            task_id: Unique task identifier
            user_id: Owner of the task (for authorization)
            completed: New completion status (True = complete, False = incomplete)

        Returns:
            TaskDTO with updated completed field

        Raises:
            EntityNotFoundError: If task does not exist
            UnauthorizedError: If user_id does not own task
        """
        # Retrieve existing task (with authorization check)
        existing_task = self._task_repository.get_by_id(task_id, user_id)

        # Create updated task with new completion status
        updated_task = Task(
            id=existing_task.id,
            user_id=existing_task.user_id,
            title=existing_task.title,
            description=existing_task.description,
            completed=completed,
            priority=existing_task.priority,
            tags=existing_task.tags,
            created_at=existing_task.created_at,  # Immutable
            updated_at=datetime.utcnow(),  # Refresh timestamp
        )

        # Persist via repository
        saved_task = self._task_repository.update(updated_task)

        # Convert to DTO
        return TaskDTO(
            id=saved_task.id,
            user_id=saved_task.user_id,
            title=saved_task.title,
            description=saved_task.description,
            completed=saved_task.completed,
            priority=saved_task.priority,
            tags=saved_task.tags,
            created_at=saved_task.created_at,
            updated_at=saved_task.updated_at,
        )
