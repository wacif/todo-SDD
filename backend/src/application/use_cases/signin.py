"""Sign in use case for user authentication."""

from dataclasses import dataclass
from datetime import datetime, timedelta
from uuid import UUID

from src.application.dto.user_dto import UserDTO
from src.domain.exceptions.domain_exceptions import EntityNotFoundError
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.security.security import verify_password, create_access_token


class InvalidCredentialsError(Exception):
    """Exception raised when email or password is incorrect."""

    pass


@dataclass
class SigninResult:
    """Result of signin operation with token and user data."""

    token: str
    user: UserDTO
    expires_at: datetime


class SigninUseCase:
    """Use case for user authentication."""

    def __init__(self, user_repository: UserRepository):
        """
        Initialize signin use case.

        Args:
            user_repository: User repository for database operations
        """
        self.user_repository = user_repository

    def execute(self, email: str, password: str) -> SigninResult:
        """
        Authenticate user with email and password.

        Args:
            email: User email address
            password: Plain text password

        Returns:
            SigninResult with JWT token, user data, and expiration

        Raises:
            InvalidCredentialsError: If email doesn't exist or password is wrong
        """
        # Get user by email
        user = self.user_repository.get_by_email(email)
        if user is None:
            raise InvalidCredentialsError("Email or password is incorrect")

        # Verify password
        if not verify_password(password, user.password_hash):
            raise InvalidCredentialsError("Email or password is incorrect")

        # Generate JWT token
        token = create_access_token(user.id)

        # Calculate expiration (7 days from now)
        expires_at = datetime.utcnow() + timedelta(days=7)

        # Create user DTO (without password hash)
        user_dto = UserDTO(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

        return SigninResult(token=token, user=user_dto, expires_at=expires_at)
