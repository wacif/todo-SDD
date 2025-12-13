"""PostgreSQL task repository implementation."""

import json

from sqlmodel import Session, select

from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import (
    EntityNotFoundError,
    UnauthorizedError,
)
from src.infrastructure.persistence.models import TaskModel


def _tags_to_json(tags: tuple[str, ...]) -> str:
    return json.dumps(list(tags))


def _tags_from_json(tags_json: str | None) -> tuple[str, ...]:
    if not tags_json:
        return ()
    try:
        parsed = json.loads(tags_json)
    except json.JSONDecodeError:
        return ()
    if not isinstance(parsed, list):
        return ()
    cleaned: list[str] = []
    for tag in parsed:
        if not isinstance(tag, str):
            continue
        t = tag.strip().lower()
        if t and t not in cleaned:
            cleaned.append(t)
    return tuple(cleaned)


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
            description=task.description or "",
            completed=task.completed,
            priority=task.priority,
            tags=_tags_to_json(task.tags),
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
            priority=task_model.priority,
            tags=_tags_from_json(task_model.tags),
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
            priority=task_model.priority,
            tags=_tags_from_json(task_model.tags),
            created_at=task_model.created_at,
            updated_at=task_model.updated_at,
        )

    def list_by_user(
        self,
        user_id: str,
        status: str | None = None,
        priority: str | None = None,
        tag: str | None = None,
        q: str | None = None,
        sort: str | None = None,
        order: str | None = None,
    ) -> list[Task]:
        """Retrieve tasks for a specific user with optional filter/search/sort."""
        statement = select(TaskModel).where(TaskModel.user_id == user_id)
        task_models = self._session.exec(statement).all()

        tasks: list[Task] = [
            Task(
                id=model.id,
                user_id=model.user_id,
                title=model.title,
                description=model.description,
                completed=model.completed,
                priority=model.priority or "medium",
                tags=_tags_from_json(model.tags),
                created_at=model.created_at,
                updated_at=model.updated_at,
            )
            for model in task_models
        ]

        if status in {"completed", "pending"}:
            want_completed = status == "completed"
            tasks = [t for t in tasks if t.completed is want_completed]

        if priority in {"high", "medium", "low"}:
            tasks = [t for t in tasks if t.priority == priority]

        if tag:
            tag_norm = tag.strip().lower()
            if tag_norm:
                tasks = [t for t in tasks if tag_norm in t.tags]

        if q:
            q_norm = q.strip().lower()
            if q_norm:
                tasks = [
                    t
                    for t in tasks
                    if q_norm in t.title.lower()
                    or (t.description is not None and q_norm in t.description.lower())
                ]

        sort_key = (sort or "").strip().lower()
        order_norm = (order or "desc").strip().lower()
        reverse = order_norm != "asc"

        if sort_key == "title":
            tasks.sort(key=lambda t: t.title.lower(), reverse=reverse)
        elif sort_key == "priority":
            rank = {"low": 1, "medium": 2, "high": 3}
            tasks.sort(key=lambda t: rank.get(t.priority, 0), reverse=reverse)
        else:
            tasks.sort(key=lambda t: t.created_at, reverse=True)

        return tasks

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
        task_model.description = task.description or ""
        task_model.completed = task.completed
        task_model.priority = task.priority
        task_model.tags = _tags_to_json(task.tags)
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
            priority=task_model.priority,
            tags=_tags_from_json(task_model.tags),
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
