"""UpdateTask use case - modify task title and/or description."""

from dataclasses import replace

from src.application.dto.task_dto import TaskDTO
from src.application.dto.task_input_dto import TaskInputDTO
from src.domain.entities.task import Task
from src.domain.repositories.task_repository import TaskRepository


class UpdateTaskUseCase:
    """
    Use case for updating a task's title and/or description.

    This allows modifying task content while preserving ID, completion status, and created_at.

    Responsibilities:
        - Accept TaskInputDTO with new title/description
        - Retrieve existing task by ID
        - Create updated Task entity (triggers validation)
        - Persist updated task
        - Return TaskDTO to interface layer

    Business Rules:
        - ID, is_complete, and created_at are preserved
        - Title and description are validated by Task entity
        - Both or either field can be updated
    """

    def __init__(self, repository: TaskRepository):
        """
        Initialize use case with repository dependency.

        Args:
            repository: TaskRepository implementation for persistence
        """
        self._repository = repository

    def execute(self, task_id: int, input_dto: TaskInputDTO) -> TaskDTO:
        """
        Execute the update task use case.

        Args:
            task_id: ID of the task to update
            input_dto: TaskInputDTO containing new title and description

        Returns:
            TaskDTO with updated data

        Raises:
            EntityNotFoundError: If task with given ID does not exist
            ValidationError: If title or description violate validation rules
        """
        # Retrieve existing task
        existing_task = self._repository.get_by_id(task_id)

        # Create updated Task entity (validation happens in __post_init__)
        # Preserve ID, is_complete, and created_at
        updated_task = Task(
            id=existing_task.id,
            title=input_dto.title,
            description=input_dto.description,
            is_complete=existing_task.is_complete,
            created_at=existing_task.created_at,
        )

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
