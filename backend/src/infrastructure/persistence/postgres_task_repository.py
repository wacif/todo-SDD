"""PostgreSQL task repository implementation."""

from sqlmodel import Session, select

from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import (
    EntityNotFoundError,
    UnauthorizedError,
)
from src.infrastructure.persistence.models import TaskModel


class PostgresTaskRepository:
    """
    PostgreSQL implementation of TaskRepository.

    Uses SQLModel for ORM operations and type-safe queries.
    """

    def __init__(self, session: Session) -> None:
        """
        Initialize repository with database session.

        Args:
            session: SQLModel database session
        """
        self._session = session

    def add(self, task: Task) -> Task:
        """Add a new task to the database."""
        # Convert domain entity to database model
        task_model = TaskModel(
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at,
        )

        # Persist to database
        self._session.add(task_model)
        self._session.commit()
        self._session.refresh(task_model)

        # Convert back to domain entity
        return Task(
            id=task_model.id,
            user_id=task_model.user_id,
            title=task_model.title,
            description=task_model.description,
            completed=task_model.completed,
            created_at=task_model.created_at,
            updated_at=task_model.updated_at,
        )

    def get_by_id(self, task_id: int, user_id: str) -> Task:
        """Retrieve a task by ID with user authorization."""
        statement = select(TaskModel).where(TaskModel.id == task_id)
        task_model = self._session.exec(statement).first()

        if not task_model:
            raise EntityNotFoundError(f"Task with ID {task_id} not found")

        # Authorization check
        if task_model.user_id != user_id:
            raise UnauthorizedError(f"Task {task_id} belongs to different user")

        return Task(
            id=task_model.id,
            user_id=task_model.user_id,
            title=task_model.title,
            description=task_model.description,
            completed=task_model.completed,
            created_at=task_model.created_at,
            updated_at=task_model.updated_at,
        )

    def list_by_user(self, user_id: str) -> list[Task]:
        """Retrieve all tasks for a specific user."""
        statement = (
            select(TaskModel)
            .where(TaskModel.user_id == user_id)
            .order_by(TaskModel.created_at.desc())
        )
        task_models = self._session.exec(statement).all()

        return [
            Task(
                id=model.id,
                user_id=model.user_id,
                title=model.title,
                description=model.description,
                completed=model.completed,
                created_at=model.created_at,
                updated_at=model.updated_at,
            )
            for model in task_models
        ]

    def update(self, task: Task) -> Task:
        """Update an existing task."""
        statement = select(TaskModel).where(TaskModel.id == task.id)
        task_model = self._session.exec(statement).first()

        if not task_model:
            raise EntityNotFoundError(f"Task with ID {task.id} not found")

        # Authorization check
        if task_model.user_id != task.user_id:
            raise UnauthorizedError(f"Task {task.id} belongs to different user")

        # Update fields
        task_model.title = task.title
        task_model.description = task.description
        task_model.completed = task.completed
        task_model.updated_at = task.updated_at

        self._session.add(task_model)
        self._session.commit()
        self._session.refresh(task_model)

        return Task(
            id=task_model.id,
            user_id=task_model.user_id,
            title=task_model.title,
            description=task_model.description,
            completed=task_model.completed,
            created_at=task_model.created_at,
            updated_at=task_model.updated_at,
        )

    def delete(self, task_id: int, user_id: str) -> None:
        """Delete a task with user authorization."""
        statement = select(TaskModel).where(TaskModel.id == task_id)
        task_model = self._session.exec(statement).first()

        if not task_model:
            raise EntityNotFoundError(f"Task with ID {task_id} not found")

        # Authorization check
        if task_model.user_id != user_id:
            raise UnauthorizedError(f"Task {task_id} belongs to different user")

        self._session.delete(task_model)
        self._session.commit()
