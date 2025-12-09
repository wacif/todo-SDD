"""User repository interface - port for persistence."""

from typing import Optional, Protocol
from uuid import UUID

from src.domain.entities.user import User


class UserRepository(Protocol):
    """
    Repository interface for User entity persistence.

    This is a port in Clean Architecture - implementations are in infrastructure layer.
    Defines the contract for user storage operations.
    """

    def add(self, user: User) -> User:
        """
        Add a new user to the repository.

        Args:
            user: User entity to add

        Returns:
            The added user (may include generated timestamps)

        Raises:
            DuplicateEntityError: If user with same email already exists
        """
        ...

    def get_by_id(self, user_id: UUID) -> User:
        """
        Retrieve a user by their ID.

        Args:
            user_id: Unique user identifier

        Returns:
            User entity

        Raises:
            EntityNotFoundError: If user with given ID does not exist
        """
        ...

    def get_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by their email address.

        Args:
            email: User's email address (case-insensitive)

        Returns:
            User entity if found, None otherwise
        """
        ...

    def update(self, user: User) -> User:
        """
        Update an existing user.

        Args:
            user: User entity with updated fields

        Returns:
            Updated user entity

        Raises:
            EntityNotFoundError: If user does not exist
        """
        ...

    def delete(self, user_id: UUID) -> None:
        """
        Delete a user and all their tasks (cascade).

        Args:
            user_id: Unique user identifier

        Raises:
            EntityNotFoundError: If user does not exist
        """
        ...
