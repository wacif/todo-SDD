"""Task DTO - data transfer object for task representation."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True)
class TaskDTO:
    """
    Data Transfer Object for Task entity.

    Used to transfer task data between layers (application → interface).
    Matches Task entity structure but is serializable.
    """

    id: int
    user_id: UUID
    title: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime
