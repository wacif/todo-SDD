"""DeleteTask use case - permanently remove a task."""

from src.domain.repositories.task_repository import TaskRepository


class DeleteTaskUseCase:
    """
    Use case for deleting a task.

    This permanently removes a task from the repository.

    Responsibilities:
        - Delete task by ID from repository
        - No return value (void operation)

    Business Rules:
        - Task is permanently removed
        - Deleted IDs are never reused (enforced by repository)
        - Operation fails if task does not exist
    """

    def __init__(self, repository: TaskRepository):
        """
        Initialize use case with repository dependency.

        Args:
            repository: TaskRepository implementation for persistence
        """
        self._repository = repository

    def execute(self, task_id: int) -> None:
        """
        Execute the delete task use case.

        Args:
            task_id: ID of the task to delete

        Raises:
            EntityNotFoundError: If task with given ID does not exist
        """
        self._repository.delete(task_id)
