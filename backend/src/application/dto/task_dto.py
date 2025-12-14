"""Task DTO - data transfer object for task representation."""

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class TaskDTO:
    """
    Data Transfer Object for Task entity.

    Used to transfer task data between layers (application → interface).
    Matches Task entity structure but is serializable.
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
