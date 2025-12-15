"""Pydantic models for task API."""

from typing import Optional

from pydantic import BaseModel, Field


class TaskInputDTO(BaseModel):
    """Request model for creating/updating tasks."""

    title: str = Field(
        ..., min_length=1, max_length=200, description="Task title (1-200 characters)"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Task description (optional, max 1000 characters)"
    )
    priority: str = Field(
        "medium", description="Task priority (high | medium | low)"
    )
    tags: list[str] = Field(default_factory=list, description="Task tags/categories")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Milk, eggs, bread, and vegetables",
                "priority": "medium",
                "tags": ["home"],
            }
        }


class TaskResponse(BaseModel):
    """Response model for task operations."""

    id: int = Field(..., description="Task ID")
    user_id: str = Field(..., description="Owner's user ID")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    completed: bool = Field(..., description="Task completion status")
    priority: str = Field(..., description="Task priority (high | medium | low)")
    tags: list[str] = Field(default_factory=list, description="Task tags/categories")
    created_at: str = Field(..., description="Creation timestamp (ISO 8601)")
    updated_at: str = Field(..., description="Last update timestamp (ISO 8601)")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "VYcFllAL8M3MULquuSCUH3gd3yyxpnvo",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "priority": "medium",
                "tags": ["home"],
                "created_at": "2025-12-09T10:30:00Z",
                "updated_at": "2025-12-09T10:30:00Z",
            }
        }


class TaskListResponse(BaseModel):
    """Response model for task list."""

    tasks: list[TaskResponse] = Field(..., description="List of tasks")
    total: int = Field(..., description="Total number of tasks")
    has_more: bool = Field(False, description="Whether more tasks are available")

    class Config:
        json_schema_extra = {
            "example": {
                "tasks": [
                    {
                        "id": 1,
                        "user_id": "VYcFllAL8M3MULquuSCUH3gd3yyxpnvo",
                        "title": "Buy groceries",
                        "description": "Milk, eggs, bread",
                        "completed": False,
                        "priority": "medium",
                        "tags": ["home"],
                        "created_at": "2025-12-09T10:30:00Z",
                        "updated_at": "2025-12-09T10:30:00Z",
                    }
                ],
                "total": 1,
                "has_more": False,
            }
        }
