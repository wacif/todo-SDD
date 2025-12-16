"""Task input DTO - for task creation and updates."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(frozen=True)
class SubtaskInputDTO:
    """Subtask input data transfer object."""
    id: str
    text: str
    completed: bool = False


@dataclass(frozen=True)
class TaskInputDTO:
    """
    Data Transfer Object for task input (create/update).

    Used to transfer task input data from interface → application layer.
    Excludes auto-generated fields (id, timestamps).
    """

    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium"
    tags: tuple[str, ...] = ()
    due_date: Optional[datetime] = None
    subtasks: tuple[SubtaskInputDTO, ...] = ()


@dataclass(frozen=True)
class TaskUpdateDTO:
    """
    Data Transfer Object for partial task updates.

    Allows optional fields for PATCH operations.
    """

    task_id: int
    user_id: str  # For authorization
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[tuple[str, ...]] = None
    due_date: Optional[datetime] = None
    subtasks: Optional[tuple[SubtaskInputDTO, ...]] = None


@dataclass(frozen=True)
class TaskListQueryDTO:
    """DTO for list/search/filter/sort parameters."""

    status: Optional[str] = None  # completed | pending
    priority: Optional[str] = None  # high | medium | low
    tag: Optional[str] = None
    q: Optional[str] = None
    sort: Optional[str] = None  # title | priority
    order: str = "desc"  # asc | desc
    limit: int = 20
    offset: int = 0
