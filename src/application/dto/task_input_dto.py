"""Task input DTO for creating/updating tasks."""

from dataclasses import dataclass


@dataclass(frozen=True)
class TaskInputDTO:
    """
    Data Transfer Object for task input (create/update operations).

    This DTO carries user input from the interface layer to the application layer.

    Attributes:
        title: Task title (1-200 characters, required)
        description: Task description (0-1000 characters, optional)
    """

    title: str
    description: str
