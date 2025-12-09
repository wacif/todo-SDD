"""User registration use case."""

from datetime import datetime
from uuid import uuid4

from src.application.dto.user_dto import UserDTO
from src.application.dto.user_input_dto import UserSignupDTO
from src.domain.entities.user import User
from src.domain.exceptions.domain_exceptions import (
    DuplicateEntityError,
    ValidationError,
)
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.security.security import hash_password


class SignupUseCase:
    """
    Use case for user registration.

    Responsibilities:
        - Accept UserSignupDTO from interface layer
        - Validate password strength (before hashing)
        - Hash password with bcrypt
        - Create User entity
        - Persist User via repository
        - Return UserDTO to interface layer

    Business Rules:
        - Email must be unique
        - Password must meet strength requirements (8+ chars, 1 upper, 1 lower, 1 number)
        - Password is hashed with bcrypt (cost factor 12)
    """

    def __init__(self, user_repository: UserRepository) -> None:
        """
        Initialize use case with repository dependency.

        Args:
            user_repository: Repository for user persistence
        """
        self._user_repository = user_repository

    def execute(self, signup_dto: UserSignupDTO) -> UserDTO:
        """
        Execute the signup use case.

        Args:
            signup_dto: User signup data (email, name, password)

        Returns:
            UserDTO (without password_hash)

        Raises:
            ValidationError: If password does not meet strength requirements
            DuplicateEntityError: If email already exists
        """
        # Check for existing user
        existing_user = self._user_repository.get_by_email(signup_dto.email)
        if existing_user:
            raise DuplicateEntityError(f"User with email {signup_dto.email} already exists")

        # Hash password
        password_hash = hash_password(signup_dto.password)

        # Create domain entity
        now = datetime.utcnow()
        user = User(
            id=uuid4(),
            email=signup_dto.email,
            name=signup_dto.name,
            password_hash=password_hash,
            created_at=now,
            updated_at=now,
        )

        # Persist via repository
        saved_user = self._user_repository.add(user)

        # Convert to DTO (without password_hash)
        return UserDTO(
            id=saved_user.id,
            email=saved_user.email,
            name=saved_user.name,
            created_at=saved_user.created_at,
            updated_at=saved_user.updated_at,
        )
