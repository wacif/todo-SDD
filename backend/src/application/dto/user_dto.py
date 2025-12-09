"""User DTO - data transfer object for user representation."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True)
class UserDTO:
    """
    Data Transfer Object for User entity.

    Used to transfer user data between layers (application → interface).
    NEVER includes password_hash for security.
    """

    id: UUID
    email: str
    name: str
    created_at: datetime
    updated_at: datetime
