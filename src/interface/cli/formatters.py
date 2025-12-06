"""Rich formatters for CLI display."""

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text

from src.application.dto.task_dto import TaskDTO


def get_status_symbol(is_complete: bool) -> str:
    """
    Get status symbol for task completion.

    Args:
        is_complete: Task completion status

    Returns:
        "✓" for complete, "○" for incomplete
    """
    return "✓" if is_complete else "○"


def format_task_table(tasks: list[TaskDTO]) -> Table:
    """
    Format tasks as a Rich table.

    Args:
        tasks: List of task DTOs

    Returns:
        Rich Table object with task data
    """
    table = Table(title="📋 Todo List", show_header=True, header_style="bold cyan")
    table.add_column("ID", style="dim", width=4, justify="right")
    table.add_column("Status", width=6, justify="center")
    table.add_column("Title", style="bold")
    table.add_column("Description", style="dim")
    table.add_column("Created", style="dim", width=19)

    for task in tasks:
        status_symbol = get_status_symbol(task.is_complete)
        status_color = "green" if task.is_complete else "yellow"
        created_str = task.created_at.strftime("%Y-%m-%d %H:%M:%S")

        # Truncate long descriptions for table display
        description = task.description
        if len(description) > 50:
            description = description[:47] + "..."

        table.add_row(
            str(task.id),
            f"[{status_color}]{status_symbol}[/{status_color}]",
            task.title,
            description,
            created_str,
        )

    return table


def format_success_message(message: str) -> Panel:
    """
    Format success message as Rich panel.

    Args:
        message: Success message text

    Returns:
        Rich Panel with success styling
    """
    text = Text(f"✅ {message}", style="bold green")
    return Panel(text, border_style="green")


def format_error_message(message: str) -> Panel:
    """
    Format error message as Rich panel.

    Args:
        message: Error message text

    Returns:
        Rich Panel with error styling
    """
    text = Text(f"❌ {message}", style="bold red")
    return Panel(text, border_style="red")
