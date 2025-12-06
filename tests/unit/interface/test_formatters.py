"""Unit tests for Rich formatters."""

import pytest
from datetime import datetime
from rich.console import Console
from rich.table import Table

from src.interface.cli.formatters import (
    get_status_symbol,
    format_task_table,
    format_success_message,
    format_error_message,
)
from src.application.dto.task_dto import TaskDTO


class TestGetStatusSymbol:
    """Test status symbol formatting."""

    def test_complete_status_symbol(self):
        """Test that complete task returns checkmark."""
        assert get_status_symbol(True) == "✓"

    def test_incomplete_status_symbol(self):
        """Test that incomplete task returns circle."""
        assert get_status_symbol(False) == "○"


class TestFormatTaskTable:
    """Test task table formatting."""

    def test_format_empty_task_list(self):
        """Test formatting empty task list."""
        table = format_task_table([])
        assert isinstance(table, Table)
        assert table.title == "📋 Todo List"

    def test_format_single_task(self):
        """Test formatting single task."""
        task = TaskDTO(
            id=1,
            title="Test Task",
            description="Test Description",
            is_complete=False,
            created_at=datetime(2024, 1, 1, 10, 0, 0),
        )
        table = format_task_table([task])
        assert isinstance(table, Table)
        assert table.title == "📋 Todo List"

    def test_format_multiple_tasks(self):
        """Test formatting multiple tasks."""
        tasks = [
            TaskDTO(1, "Task 1", "Desc 1", False, datetime.now()),
            TaskDTO(2, "Task 2", "Desc 2", True, datetime.now()),
            TaskDTO(3, "Task 3", "", False, datetime.now()),
        ]
        table = format_task_table(tasks)
        assert isinstance(table, Table)


class TestFormatSuccessMessage:
    """Test success message formatting."""

    def test_format_success_message(self):
        """Test that success message is formatted correctly."""
        from rich.panel import Panel

        panel = format_success_message("Task added successfully")
        assert isinstance(panel, Panel)


class TestFormatErrorMessage:
    """Test error message formatting."""

    def test_format_error_message(self):
        """Test that error message is formatted correctly."""
        from rich.panel import Panel

        panel = format_error_message("Task not found")
        assert isinstance(panel, Panel)
