"""Pydantic models for task API."""

from pydantic import BaseModel, Field
from typing import Optional


class TaskInputDTO(BaseModel):
    """Request model for creating/updating tasks."""

    title: str = Field(
        ..., min_length=1, max_length=200, description="Task title (1-200 characters)"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Task description (optional, max 1000 characters)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Milk, eggs, bread, and vegetables",
            }
        }


class TaskResponse(BaseModel):
    """Response model for task operations."""

    id: int = Field(..., description="Task ID")
    user_id: str = Field(..., description="Owner's user ID (UUID)")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    completed: bool = Field(..., description="Task completion status")
    created_at: str = Field(..., description="Creation timestamp (ISO 8601)")
    updated_at: str = Field(..., description="Last update timestamp (ISO 8601)")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "created_at": "2025-12-09T10:30:00Z",
                "updated_at": "2025-12-09T10:30:00Z",
            }
        }


class TaskListResponse(BaseModel):
    """Response model for task list."""

    tasks: list[TaskResponse] = Field(..., description="List of tasks")
    total: int = Field(..., description="Total number of tasks")

    class Config:
        json_schema_extra = {
            "example": {
                "tasks": [
                    {
                        "id": 1,
                        "user_id": "550e8400-e29b-41d4-a716-446655440000",
                        "title": "Buy groceries",
                        "description": "Milk, eggs, bread",
                        "completed": False,
                        "created_at": "2025-12-09T10:30:00Z",
                        "updated_at": "2025-12-09T10:30:00Z",
                    }
                ],
                "total": 1,
            }
        }
