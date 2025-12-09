"""Task management routes for CRUD operations."""

from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlmodel import Session

from src.api.dependencies import get_current_user_id
from src.api.models.task_models import TaskInputDTO, TaskListResponse, TaskResponse
from src.application.dto.task_dto import TaskDTO
from src.application.dto.task_input_dto import TaskInputDTO as UseCaseTaskInputDTO
from src.application.use_cases.add_task import AddTaskUseCase
from src.application.use_cases.list_tasks import ListTasksUseCase
from src.domain.exceptions.domain_exceptions import (
    EntityNotFoundError,
    UnauthorizedError,
    ValidationError,
)
from src.domain.repositories.task_repository import TaskRepository
from src.infrastructure.persistence.database import get_session
from src.infrastructure.persistence.postgres_task_repository import PostgresTaskRepository

router = APIRouter(prefix="/api", tags=["Tasks"])


def get_task_repository(session: Session = Depends(get_session)) -> TaskRepository:
    """Dependency to get task repository."""
    return PostgresTaskRepository(session)


def validate_user_ownership(path_user_id: UUID, token_user_id: UUID) -> None:
    """
    Validate that the user_id in the path matches the authenticated user.

    Args:
        path_user_id: User ID from URL path
        token_user_id: User ID from JWT token

    Raises:
        HTTPException: 403 if user IDs don't match
    """
    if path_user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access or modify another user's tasks",
        )


def task_dto_to_response(task: TaskDTO) -> TaskResponse:
    """
    Convert TaskDTO to API response model.

    Args:
        task: Task DTO from use case

    Returns:
        TaskResponse for API
    """
    return TaskResponse(
        id=task.id,
        user_id=str(task.user_id),
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat(),
    )


@router.post(
    "/{user_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_task(
    user_id: Annotated[UUID, Path(description="User ID (must match authenticated user)")],
    request: TaskInputDTO,
    current_user_id: Annotated[UUID, Depends(get_current_user_id)],
    task_repository: TaskRepository = Depends(get_task_repository),
):
    """
    Create a new task for the authenticated user.

    - Requires JWT authentication
    - User can only create tasks for themselves
    - Title is required (1-200 chars)
    - Description is optional (max 1000 chars)
    """
    # Validate user ownership
    validate_user_ownership(user_id, current_user_id)

    # Create use case input DTO
    use_case_input = UseCaseTaskInputDTO(
        user_id=current_user_id,
        title=request.title,
        description=request.description,
        completed=False,  # New tasks default to incomplete
    )

    try:
        # Execute use case
        use_case = AddTaskUseCase(task_repository)
        task_dto = use_case.execute(use_case_input)

        # Convert to API response
        return task_dto_to_response(task_dto)

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except EntityNotFoundError as e:
        # This shouldn't happen since we validate JWT, but handle gracefully
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{user_id}/tasks", response_model=TaskListResponse)
async def list_tasks(
    user_id: Annotated[UUID, Path(description="User ID (must match authenticated user)")],
    current_user_id: Annotated[UUID, Depends(get_current_user_id)],
    task_repository: TaskRepository = Depends(get_task_repository),
):
    """
    List all tasks for the authenticated user.

    - Requires JWT authentication
    - User can only see their own tasks
    - Tasks sorted by created_at DESC
    """
    # Validate user ownership
    validate_user_ownership(user_id, current_user_id)

    try:
        # Execute use case
        use_case = ListTasksUseCase(task_repository)
        task_dtos = use_case.execute(current_user_id)

        # Convert to API response
        tasks = [task_dto_to_response(task) for task in task_dtos]
        return TaskListResponse(tasks=tasks, total=len(tasks))

    except EntityNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
