"""Task entity - evolved from Phase I with user ownership."""

from dataclasses import dataclass
from datetime import datetime

from src.domain.exceptions.domain_exceptions import ValidationError


@dataclass(frozen=True)
class Task:
    """
    Task entity representing a todo item owned by a user.

    Attributes:
        id: Unique task identifier (serial integer, auto-increment)
        user_id: Owner of the task (string ID)
        title: Task title/summary (1-200 characters, required)
        description: Detailed task description (0-1000 characters, optional)
        completed: Completion status flag (default: False)
        created_at: Creation timestamp (immutable, auto-generated)
        updated_at: Last modification timestamp (auto-updated)

    Business Rules:
        - ID must be unique and auto-incrementing
        - user_id must be present for ownership isolation
        - Title cannot be empty (minimum 1 character after stripping whitespace)
        - Title maximum length: 200 characters
        - Description maximum length: 1000 characters
        - completed defaults to False
        - created_at is immutable
        - updated_at updates on any modification
    """

    id: int
    user_id: str
    title: str
    description: str | None
    completed: bool
    priority: str
    tags: tuple[str, ...]
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        """Validate task entity invariants."""
        # Title validation
        if not isinstance(self.title, str):
            raise ValidationError("Title must be a string")
        if len(self.title.strip()) == 0:
            raise ValidationError("Title cannot be empty")
        if len(self.title) > 200:
            raise ValidationError("Title cannot exceed 200 characters")

        # Description validation
        if self.description is not None:
            if not isinstance(self.description, str):
                raise ValidationError("Description must be a string")
            if len(self.description) > 1000:
                raise ValidationError("Description cannot exceed 1000 characters")

        # ID validation
        if not isinstance(self.id, int) or self.id < 0:
            raise ValidationError("ID must be a non-negative integer")

        # Priority validation
        if self.priority not in {"high", "medium", "low"}:
            raise ValidationError("Priority must be one of: high, medium, low")

        # Tags validation
        if not isinstance(self.tags, tuple):
            raise ValidationError("Tags must be a tuple")
        normalized: list[str] = []
        for tag in self.tags:
            if not isinstance(tag, str):
                raise ValidationError("Tag must be a string")
            cleaned = tag.strip().lower()
            if not cleaned:
                continue
            if cleaned not in normalized:
                normalized.append(cleaned)

        object.__setattr__(self, "tags", tuple(normalized))
