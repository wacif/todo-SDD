"""Unit tests for PostgreSQL task repository."""

import pytest
from datetime import datetime
from uuid import uuid4

from sqlmodel import Session, create_engine, SQLModel

from src.domain.entities.task import Task
from src.domain.exceptions.domain_exceptions import EntityNotFoundError, UnauthorizedError
from src.infrastructure.persistence.postgres_task_repository import PostgresTaskRepository
from src.infrastructure.persistence.models import UserModel, TaskModel


@pytest.fixture
def db_engine():
    """Create in-memory SQLite database for testing."""
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture
def db_session(db_engine):
    """Create database session for testing."""
    with Session(db_engine) as session:
        yield session


@pytest.fixture
def test_user(db_session):
    """Create a test user."""
    user = UserModel(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        password_hash="hashed_password",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def task_repository(db_session):
    """Create PostgreSQL task repository."""
    return PostgresTaskRepository(db_session)


def test_add_task(task_repository, test_user):
    """Test adding a new task."""
    task = Task(
        id=0,
        user_id=test_user.id,
        title="Test Task",
        description="Test Description",
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    saved_task = task_repository.add(task)

    assert saved_task.id > 0
    assert saved_task.user_id == test_user.id
    assert saved_task.title == "Test Task"
    assert saved_task.description == "Test Description"
    assert saved_task.completed is False


def test_get_by_id(task_repository, test_user):
    """Test retrieving task by ID."""
    task = Task(
        id=0,
        user_id=test_user.id,
        title="Test Task",
        description="Test Description",
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    saved_task = task_repository.add(task)

    retrieved_task = task_repository.get_by_id(saved_task.id, test_user.id)

    assert retrieved_task.id == saved_task.id
    assert retrieved_task.title == "Test Task"


def test_get_by_id_not_found(task_repository, test_user):
    """Test retrieving non-existent task."""
    with pytest.raises(EntityNotFoundError):
        task_repository.get_by_id(999, test_user.id)


def test_get_by_id_unauthorized(task_repository, test_user):
    """Test retrieving task owned by different user."""
    task = Task(
        id=0,
        user_id=test_user.id,
        title="Test Task",
        description="Test Description",
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    saved_task = task_repository.add(task)

    with pytest.raises(UnauthorizedError):
        task_repository.get_by_id(saved_task.id, uuid4())


def test_list_by_user(task_repository, test_user):
    """Test listing all tasks for a user."""
    for i in range(3):
        task = Task(
            id=0,
            user_id=test_user.id,
            title=f"Task {i}",
            description="",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        task_repository.add(task)

    tasks = task_repository.list_by_user(test_user.id)

    assert len(tasks) == 3
    assert all(task.user_id == test_user.id for task in tasks)


def test_update_task(task_repository, test_user):
    """Test updating a task."""
    task = Task(
        id=0,
        user_id=test_user.id,
        title="Original Title",
        description="Original Description",
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    saved_task = task_repository.add(task)

    updated_task = Task(
        id=saved_task.id,
        user_id=test_user.id,
        title="Updated Title",
        description="Updated Description",
        completed=True,
        created_at=saved_task.created_at,
        updated_at=datetime.utcnow(),
    )

    result = task_repository.update(updated_task)

    assert result.title == "Updated Title"
    assert result.description == "Updated Description"
    assert result.completed is True


def test_delete_task(task_repository, test_user):
    """Test deleting a task."""
    task = Task(
        id=0,
        user_id=test_user.id,
        title="Test Task",
        description="",
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    saved_task = task_repository.add(task)

    task_repository.delete(saved_task.id, test_user.id)

    with pytest.raises(EntityNotFoundError):
        task_repository.get_by_id(saved_task.id, test_user.id)
