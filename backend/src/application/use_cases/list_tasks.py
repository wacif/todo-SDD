"""List tasks use case - retrieve all tasks for a user."""

from src.application.dto.task_dto import TaskDTO, SubtaskDTO
from src.application.dto.task_input_dto import TaskListQueryDTO
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

    def execute(self, user_id: str, query: TaskListQueryDTO | None = None) -> list[TaskDTO]:
        """
        Execute the list tasks use case.

        Args:
            user_id: Unique user identifier

        Returns:
            List of TaskDTOs (may be empty)
        """
        query = query or TaskListQueryDTO()

        # Retrieve tasks for user
        tasks = self._task_repository.list_by_user(
            user_id,
            status=query.status,
            priority=query.priority,
            tag=query.tag,
            q=query.q,
            sort=query.sort,
            order=query.order,
            limit=query.limit,
            offset=query.offset,
        )

        # Convert to DTOs
        return [
            TaskDTO(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                priority=task.priority,
                tags=task.tags,
                due_date=task.due_date,
                subtasks=tuple(
                    SubtaskDTO(id=s.id, text=s.text, completed=s.completed)
                    for s in task.subtasks
                ),
                created_at=task.created_at,
                updated_at=task.updated_at,
            )
            for task in tasks
        ]
