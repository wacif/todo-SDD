"""Unit tests for PostgreSQL user repository."""

import pytest
from datetime import datetime
from uuid import uuid4

from sqlmodel import Session, create_engine, SQLModel

from src.domain.entities.user import User
from src.domain.exceptions.domain_exceptions import (
    DuplicateEntityError,
    EntityNotFoundError,
)
from src.infrastructure.persistence.postgres_user_repository import PostgresUserRepository


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
def user_repository(db_session):
    """Create PostgreSQL user repository."""
    return PostgresUserRepository(db_session)


def test_add_user(user_repository):
    """Test adding a new user."""
    user = User(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        password_hash="hashed_password",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    saved_user = user_repository.add(user)

    assert saved_user.id == user.id
    assert saved_user.email == "test@example.com"
    assert saved_user.name == "Test User"


def test_add_duplicate_user(user_repository):
    """Test adding user with duplicate email."""
    user1 = User(
        id=uuid4(),
        email="test@example.com",
        name="User 1",
        password_hash="hash1",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    user_repository.add(user1)

    user2 = User(
        id=uuid4(),
        email="test@example.com",  # Duplicate email
        name="User 2",
        password_hash="hash2",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    with pytest.raises(DuplicateEntityError):
        user_repository.add(user2)


def test_get_by_id(user_repository):
    """Test retrieving user by ID."""
    user = User(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        password_hash="hashed_password",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    saved_user = user_repository.add(user)

    retrieved_user = user_repository.get_by_id(saved_user.id)

    assert retrieved_user.id == saved_user.id
    assert retrieved_user.email == "test@example.com"


def test_get_by_id_not_found(user_repository):
    """Test retrieving non-existent user."""
    with pytest.raises(EntityNotFoundError):
        user_repository.get_by_id(uuid4())


def test_get_by_email(user_repository):
    """Test retrieving user by email."""
    user = User(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        password_hash="hashed_password",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    user_repository.add(user)

    retrieved_user = user_repository.get_by_email("test@example.com")

    assert retrieved_user is not None
    assert retrieved_user.email == "test@example.com"


def test_get_by_email_case_insensitive(user_repository):
    """Test email lookup is case-insensitive."""
    user = User(
        id=uuid4(),
        email="Test@Example.COM",
        name="Test User",
        password_hash="hashed_password",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    user_repository.add(user)

    retrieved_user = user_repository.get_by_email("test@example.com")

    assert retrieved_user is not None


def test_update_user(user_repository):
    """Test updating a user."""
    user = User(
        id=uuid4(),
        email="test@example.com",
        name="Original Name",
        password_hash="hash1",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    saved_user = user_repository.add(user)

    updated_user = User(
        id=saved_user.id,
        email="test@example.com",
        name="Updated Name",
        password_hash="hash2",
        created_at=saved_user.created_at,
        updated_at=datetime.utcnow(),
    )

    result = user_repository.update(updated_user)

    assert result.name == "Updated Name"
    assert result.password_hash == "hash2"


def test_delete_user(user_repository):
    """Test deleting a user."""
    user = User(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        password_hash="hashed_password",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    saved_user = user_repository.add(user)

    user_repository.delete(saved_user.id)

    with pytest.raises(EntityNotFoundError):
        user_repository.get_by_id(saved_user.id)
