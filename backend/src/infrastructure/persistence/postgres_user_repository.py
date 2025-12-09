"""PostgreSQL user repository implementation."""

from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from src.domain.entities.user import User
from src.domain.exceptions.domain_exceptions import (
    DuplicateEntityError,
    EntityNotFoundError,
)
from src.infrastructure.persistence.models import UserModel


class PostgresUserRepository:
    """
    PostgreSQL implementation of UserRepository.

    Uses SQLModel for ORM operations and type-safe queries.
    """

    def __init__(self, session: Session) -> None:
        """
        Initialize repository with database session.

        Args:
            session: SQLModel database session
        """
        self._session = session

    def add(self, user: User) -> User:
        """Add a new user to the database."""
        # Check for duplicate email
        existing = self.get_by_email(user.email)
        if existing:
            raise DuplicateEntityError(f"User with email {user.email} already exists")

        # Convert domain entity to database model
        user_model = UserModel(
            id=user.id,
            email=user.email.lower(),  # Store lowercase for case-insensitive queries
            name=user.name,
            password_hash=user.password_hash,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

        # Persist to database
        self._session.add(user_model)
        self._session.commit()
        self._session.refresh(user_model)

        # Convert back to domain entity
        return User(
            id=user_model.id,
            email=user_model.email,
            name=user_model.name,
            password_hash=user_model.password_hash,
            created_at=user_model.created_at,
            updated_at=user_model.updated_at,
        )

    def get_by_id(self, user_id: UUID) -> User:
        """Retrieve a user by ID."""
        statement = select(UserModel).where(UserModel.id == user_id)
        user_model = self._session.exec(statement).first()

        if not user_model:
            raise EntityNotFoundError(f"User with ID {user_id} not found")

        return User(
            id=user_model.id,
            email=user_model.email,
            name=user_model.name,
            password_hash=user_model.password_hash,
            created_at=user_model.created_at,
            updated_at=user_model.updated_at,
        )

    def get_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user by email (case-insensitive)."""
        statement = select(UserModel).where(UserModel.email == email.lower())
        user_model = self._session.exec(statement).first()

        if not user_model:
            return None

        return User(
            id=user_model.id,
            email=user_model.email,
            name=user_model.name,
            password_hash=user_model.password_hash,
            created_at=user_model.created_at,
            updated_at=user_model.updated_at,
        )

    def update(self, user: User) -> User:
        """Update an existing user."""
        statement = select(UserModel).where(UserModel.id == user.id)
        user_model = self._session.exec(statement).first()

        if not user_model:
            raise EntityNotFoundError(f"User with ID {user.id} not found")

        # Update fields
        user_model.email = user.email.lower()
        user_model.name = user.name
        user_model.password_hash = user.password_hash
        user_model.updated_at = user.updated_at

        self._session.add(user_model)
        self._session.commit()
        self._session.refresh(user_model)

        return User(
            id=user_model.id,
            email=user_model.email,
            name=user_model.name,
            password_hash=user_model.password_hash,
            created_at=user_model.created_at,
            updated_at=user_model.updated_at,
        )

    def delete(self, user_id: UUID) -> None:
        """Delete a user and cascade to all their tasks."""
        statement = select(UserModel).where(UserModel.id == user_id)
        user_model = self._session.exec(statement).first()

        if not user_model:
            raise EntityNotFoundError(f"User with ID {user_id} not found")

        self._session.delete(user_model)
        self._session.commit()
