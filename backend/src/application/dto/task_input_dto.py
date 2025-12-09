"""Task input DTO - for task creation and updates."""

from dataclasses import dataclass
from typing import Optional
from uuid import UUID


@dataclass(frozen=True)
class TaskInputDTO:
    """
    Data Transfer Object for task input (create/update).

    Used to transfer task input data from interface → application layer.
    Excludes auto-generated fields (id, timestamps).
    """

    user_id: UUID
    title: str
    description: str = ""
    completed: bool = False


@dataclass(frozen=True)
class TaskUpdateDTO:
    """
    Data Transfer Object for partial task updates.

    Allows optional fields for PATCH operations.
    """

    task_id: int
    user_id: UUID  # For authorization
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
