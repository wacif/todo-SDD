"""Task management routes for CRUD operations."""

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlmodel import Session

from src.api.dependencies import get_current_user_id
from src.api.models.task_models import TaskInputDTO, TaskListResponse, TaskResponse
from src.application.dto.task_dto import TaskDTO
from src.application.dto.task_input_dto import (
    TaskInputDTO as UseCaseTaskInputDTO,
    TaskUpdateDTO,
)
from src.application.use_cases.add_task import AddTaskUseCase
from src.application.use_cases.delete_task import DeleteTaskUseCase
from src.application.use_cases.list_tasks import ListTasksUseCase
from src.application.use_cases.mark_task_complete import MarkTaskCompleteUseCase
from src.application.use_cases.update_task import UpdateTaskUseCase
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


def validate_user_ownership(path_user_id: str, token_user_id: str) -> None:
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
    user_id: Annotated[str, Path(description="User ID (must match authenticated user)")],
    request: TaskInputDTO,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
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
    user_id: Annotated[str, Path(description="User ID (must match authenticated user)")],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
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


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: Annotated[str, Path(description="User ID (must match authenticated user)")],
    task_id: Annotated[int, Path(description="Task ID to update")],
    request: TaskInputDTO,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    task_repository: TaskRepository = Depends(get_task_repository),
):
    """
    Update an existing task.

    - Requires JWT authentication
    - User can only update their own tasks
    - Updates title and description
    """
    # Validate user ownership
    validate_user_ownership(user_id, current_user_id)

    # Create update DTO
    update_dto = TaskUpdateDTO(
        task_id=task_id,
        user_id=current_user_id,
        title=request.title,
        description=request.description,
    )

    try:
        # Execute use case
        use_case = UpdateTaskUseCase(task_repository)
        task_dto = use_case.execute(update_dto)

        # Convert to API response
        return task_dto_to_response(task_dto)

    except EntityNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: Annotated[str, Path(description="User ID (must match authenticated user)")],
    task_id: Annotated[int, Path(description="Task ID to delete")],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    task_repository: TaskRepository = Depends(get_task_repository),
):
    """
    Delete a task.

    - Requires JWT authentication
    - User can only delete their own tasks
    """
    # Validate user ownership
    validate_user_ownership(user_id, current_user_id)

    try:
        # Execute use case
        use_case = DeleteTaskUseCase(task_repository)
        use_case.execute(task_id, current_user_id)

    except EntityNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_complete(
    user_id: Annotated[str, Path(description="User ID (must match authenticated user)")],
    task_id: Annotated[int, Path(description="Task ID to toggle completion status")],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    task_repository: TaskRepository = Depends(get_task_repository),
):
    """
    Toggle task completion status.

    - Requires JWT authentication
    - User can only toggle their own tasks
    - Toggles between completed and incomplete states
    """
    # Validate user ownership
    validate_user_ownership(user_id, current_user_id)

    try:
        # First, get the current task to determine its completed state
        current_task = task_repository.get_by_id(task_id, current_user_id)
        
        # Toggle the completion status
        new_completed_status = not current_task.completed
        
        # Execute use case with toggled status
        use_case = MarkTaskCompleteUseCase(task_repository)
        task_dto = use_case.execute(task_id, current_user_id, new_completed_status)

        # Convert to API response
        return task_dto_to_response(task_dto)

    except EntityNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
