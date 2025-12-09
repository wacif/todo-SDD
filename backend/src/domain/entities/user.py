"""User entity - domain model for authentication."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from src.domain.exceptions.domain_exceptions import ValidationError


@dataclass(frozen=True)
class User:
    """
    User entity representing an authenticated user account.

    Attributes:
        id: Unique user identifier (UUID)
        email: User's email address (unique, used for login)
        name: User's display name
        password_hash: Bcrypt hashed password (never plain text)
        created_at: Account creation timestamp
        updated_at: Last profile update timestamp

    Business Rules:
        - Email must be unique and valid RFC 5322 format
        - Name minimum 1 character, maximum 100 characters
        - Password (before hashing): min 8 chars, 1 uppercase, 1 lowercase, 1 number
        - password_hash stored with bcrypt (cost factor 12)
    """

    id: UUID
    email: str
    name: str
    password_hash: str
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        """Validate user entity invariants."""
        # Email validation
        if not self.email or not isinstance(self.email, str):
            raise ValidationError("Email is required")
        if len(self.email) > 255:
            raise ValidationError("Email cannot exceed 255 characters")
        if "@" not in self.email or "." not in self.email.split("@")[-1]:
            raise ValidationError("Invalid email format")

        # Name validation
        if not self.name or not isinstance(self.name, str):
            raise ValidationError("Name is required")
        if len(self.name.strip()) == 0:
            raise ValidationError("Name cannot be only whitespace")
        if len(self.name) > 100:
            raise ValidationError("Name cannot exceed 100 characters")

        # Password hash validation
        if not self.password_hash or not isinstance(self.password_hash, str):
            raise ValidationError("Password hash is required")
