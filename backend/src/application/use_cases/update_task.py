"""Update task use case - modify existing task."""

from datetime import datetime

from src.application.dto.task_dto import TaskDTO
from src.application.dto.task_input_dto import TaskUpdateDTO
from src.domain.entities.task import Task
from src.domain.repositories.task_repository import TaskRepository


class UpdateTaskUseCase:
    """
    Use case for updating an existing task.

    Responsibilities:
        - Accept TaskUpdateDTO from interface layer
        - Retrieve existing task via repository
        - Apply updates (PATCH semantics - only provided fields)
        - Persist updated task via repository
        - Return TaskDTO to interface layer

    Business Rules:
        - Only task owner can update task (user_id authorization)
        - Partial updates allowed (null fields are not updated)
        - updated_at is refreshed on every update
        - Title/description validated by Task entity
    """

    def __init__(self, task_repository: TaskRepository) -> None:
        """
        Initialize use case with repository dependency.

        Args:
            task_repository: Repository for task persistence
        """
        self._task_repository = task_repository

    def execute(self, update_dto: TaskUpdateDTO) -> TaskDTO:
        """
        Execute the update task use case.

        Args:
            update_dto: Task update data (partial fields)

        Returns:
            TaskDTO with updated fields

        Raises:
            EntityNotFoundError: If task does not exist
            UnauthorizedError: If user_id does not own task
            ValidationError: If updated data violates business rules
        """
        # Retrieve existing task (with authorization check)
        existing_task = self._task_repository.get_by_id(
            update_dto.task_id, update_dto.user_id
        )

        # Apply updates (only non-None fields)
        updated_task = Task(
            id=existing_task.id,
            user_id=existing_task.user_id,
            title=update_dto.title if update_dto.title is not None else existing_task.title,
            description=(
                update_dto.description
                if update_dto.description is not None
                else existing_task.description
            ),
            completed=(
                update_dto.completed
                if update_dto.completed is not None
                else existing_task.completed
            ),
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
            created_at=saved_task.created_at,
            updated_at=saved_task.updated_at,
        )
