"""Task entity - core domain model."""

from dataclasses import dataclass
from datetime import datetime

from src.domain.exceptions.domain_exceptions import ValidationError


@dataclass(frozen=True)
class Task:
    """
    Task entity representing a todo item.

    Attributes:
        id: Unique task identifier (positive integer, auto-increment)
        title: Task title/summary (1-200 characters, required)
        description: Detailed task description (0-1000 characters, optional)
        is_complete: Completion status flag (default: False)
        created_at: Creation timestamp (immutable, auto-generated)

    Business Rules:
        - ID must be unique and auto-incrementing
        - Title cannot be empty (minimum 1 character after stripping whitespace)
        - Title maximum length: 200 characters
        - Description maximum length: 1000 characters
        - is_complete defaults to False
        - created_at is immutable
    """

    id: int
    title: str
    description: str
    is_complete: bool
    created_at: datetime

    def __post_init__(self):
        """Validate task attributes after initialization."""
        self._validate_title()
        self._validate_description()

    def _validate_title(self) -> None:
        """Validate title according to business rules."""
        if not self.title or not self.title.strip():
            raise ValidationError("Title cannot be empty")
        if len(self.title) > 200:
            raise ValidationError("Title exceeds maximum length of 200 characters")

    def _validate_description(self) -> None:
        """Validate description according to business rules."""
        if len(self.description) > 1000:
            raise ValidationError("Description exceeds maximum length of 1000 characters")
