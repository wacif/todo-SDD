"""ListTasks use case - retrieve all todo tasks."""

from src.application.dto.task_dto import TaskDTO
from src.domain.repositories.task_repository import TaskRepository


class ListTasksUseCase:
    """
    Use case for listing all tasks.

    This retrieves all tasks from the repository and returns them
    as DTOs ordered by creation date (oldest first).

    Responsibilities:
        - Retrieve all tasks from repository
        - Convert Task entities to TaskDTOs
        - Return list of TaskDTOs to interface layer

    Business Rules:
        - Tasks are ordered by created_at (oldest first)
        - Empty list returned if no tasks exist
        - Both complete and incomplete tasks are included
    """

    def __init__(self, repository: TaskRepository):
        """
        Initialize use case with repository dependency.

        Args:
            repository: TaskRepository implementation for persistence
        """
        self._repository = repository

    def execute(self) -> list[TaskDTO]:
        """
        Execute the list tasks use case.

        Returns:
            List of TaskDTO objects ordered by created_at (oldest first).
            Empty list if no tasks exist.
        """
        # Retrieve all tasks (already ordered by created_at from repository)
        tasks = self._repository.get_all()

        # Convert to DTOs for interface layer
        return [
            TaskDTO(
                id=task.id,
                title=task.title,
                description=task.description,
                is_complete=task.is_complete,
                created_at=task.created_at,
            )
            for task in tasks
        ]
