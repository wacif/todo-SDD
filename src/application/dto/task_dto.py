"""Task output DTO for returning task data."""

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class TaskDTO:
    """
    Data Transfer Object for task output (read operations).

    This DTO carries task data from the application layer to the interface layer.

    Attributes:
        id: Unique task identifier
        title: Task title
        description: Task description
        is_complete: Completion status
        created_at: Creation timestamp
    """

    id: int
    title: str
    description: str
    is_complete: bool
    created_at: datetime
