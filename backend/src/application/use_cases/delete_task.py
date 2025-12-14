"""Delete task use case - remove task from repository."""

from src.domain.repositories.task_repository import TaskRepository


class DeleteTaskUseCase:
    """
    Use case for deleting a task.

    Responsibilities:
        - Accept task_id and user_id from interface layer
        - Delete task via repository (with authorization check)

    Business Rules:
        - Only task owner can delete task (user_id authorization)
        - Deletion is permanent (no soft delete in v1)
    """

    def __init__(self, task_repository: TaskRepository) -> None:
        """
        Initialize use case with repository dependency.

        Args:
            task_repository: Repository for task deletion
        """
        self._task_repository = task_repository

    def execute(self, task_id: int, user_id: str) -> None:
        """
        Execute the delete task use case.

        Args:
            task_id: Unique task identifier
            user_id: Owner of the task (for authorization)

        Raises:
            EntityNotFoundError: If task does not exist
            UnauthorizedError: If user_id does not own task
        """
        self._task_repository.delete(task_id, user_id)
