"""Console application with interactive menu."""

from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.panel import Panel
from rich.text import Text

from src.application.use_cases.add_task import AddTaskUseCase
from src.application.use_cases.list_tasks import ListTasksUseCase
from src.application.use_cases.mark_task_complete import MarkTaskCompleteUseCase
from src.application.use_cases.update_task import UpdateTaskUseCase
from src.application.use_cases.delete_task import DeleteTaskUseCase
from src.application.dto.task_input_dto import TaskInputDTO
from src.domain.exceptions.domain_exceptions import (
    EntityNotFoundError,
    ValidationError,
)
from src.domain.repositories.task_repository import TaskRepository
from src.interface.cli.formatters import (
    format_task_table,
    format_success_message,
    format_error_message,
)
from src.interface.cli.validators import (
    validate_task_id,
    validate_title,
    validate_description,
)


class ConsoleApp:
    """
    Interactive console application for todo management.

    Provides a menu-driven interface connecting all use cases.
    """

    def __init__(self, repository: TaskRepository):
        """
        Initialize console app with repository dependency.

        Args:
            repository: TaskRepository implementation
        """
        self.console = Console()
        self.repository = repository

        # Initialize use cases
        self.add_task = AddTaskUseCase(repository)
        self.list_tasks = ListTasksUseCase(repository)
        self.mark_complete = MarkTaskCompleteUseCase(repository)
        self.update_task = UpdateTaskUseCase(repository)
        self.delete_task = DeleteTaskUseCase(repository)

    def run(self) -> None:
        """Run the interactive console application."""
        self._show_welcome()

        while True:
            self._show_menu()
            choice = Prompt.ask("Select an option", choices=["1", "2", "3", "4", "5", "6"])

            if choice == "1":
                self._handle_add_task()
            elif choice == "2":
                self._handle_view_tasks()
            elif choice == "3":
                self._handle_mark_complete()
            elif choice == "4":
                self._handle_update_task()
            elif choice == "5":
                self._handle_delete_task()
            elif choice == "6":
                self._handle_exit()
                break

    def _show_welcome(self) -> None:
        """Display welcome banner."""
        welcome_text = Text("📝 Todo App - Phase I", style="bold cyan", justify="center")
        panel = Panel(welcome_text, border_style="cyan")
        self.console.print(panel)
        self.console.print()

    def _show_menu(self) -> None:
        """Display main menu."""
        self.console.print("\n[bold cyan]Main Menu[/bold cyan]")
        self.console.print("  [1] ➕ Add Task")
        self.console.print("  [2] 📋 View All Tasks")
        self.console.print("  [3] ✓  Mark Task Complete/Incomplete")
        self.console.print("  [4] ✏️  Update Task")
        self.console.print("  [5] 🗑️  Delete Task")
        self.console.print("  [6] 👋 Exit")
        self.console.print()

    def _handle_add_task(self) -> None:
        """Handle add task operation."""
        try:
            self.console.print("\n[bold]Add New Task[/bold]")
            title = Prompt.ask("Title")
            title = validate_title(title)

            description = Prompt.ask("Description (optional)", default="")
            description = validate_description(description)

            input_dto = TaskInputDTO(title=title, description=description)
            task_dto = self.add_task.execute(input_dto)

            message = f"Task added successfully! (ID: {task_dto.id})"
            self.console.print(format_success_message(message))

        except ValidationError as e:
            self.console.print(format_error_message(str(e)))
        except Exception as e:
            self.console.print(format_error_message(f"Unexpected error: {e}"))

    def _handle_view_tasks(self) -> None:
        """Handle view all tasks operation."""
        try:
            tasks = self.list_tasks.execute()

            if not tasks:
                self.console.print("\n[dim]No tasks found. Add your first task![/dim]\n")
            else:
                table = format_task_table(tasks)
                self.console.print()
                self.console.print(table)
                self.console.print()

        except Exception as e:
            self.console.print(format_error_message(f"Error retrieving tasks: {e}"))

    def _handle_mark_complete(self) -> None:
        """Handle mark task complete/incomplete operation."""
        try:
            self.console.print("\n[bold]Mark Task Complete/Incomplete[/bold]")
            task_id_str = Prompt.ask("Task ID")
            task_id = validate_task_id(task_id_str)

            # Get current task to show status
            current_task = self.repository.get_by_id(task_id)
            current_status = "complete" if current_task.is_complete else "incomplete"

            # Ask for new status
            mark_complete = Confirm.ask(
                f"Current status: {current_status}. Mark as complete?", default=not current_task.is_complete
            )

            task_dto = self.mark_complete.execute(task_id, mark_complete)

            status = "complete" if task_dto.is_complete else "incomplete"
            message = f"Task {task_id} marked as {status}"
            self.console.print(format_success_message(message))

        except EntityNotFoundError as e:
            self.console.print(format_error_message(str(e)))
        except ValueError as e:
            self.console.print(format_error_message(str(e)))
        except Exception as e:
            self.console.print(format_error_message(f"Unexpected error: {e}"))

    def _handle_update_task(self) -> None:
        """Handle update task operation."""
        try:
            self.console.print("\n[bold]Update Task[/bold]")
            task_id_str = Prompt.ask("Task ID")
            task_id = validate_task_id(task_id_str)

            # Get current task to show existing values
            current_task = self.repository.get_by_id(task_id)
            self.console.print(f"[dim]Current title: {current_task.title}[/dim]")
            self.console.print(f"[dim]Current description: {current_task.description}[/dim]")

            # Get new values
            title = Prompt.ask("New title", default=current_task.title)
            title = validate_title(title)

            description = Prompt.ask("New description", default=current_task.description)
            description = validate_description(description)

            input_dto = TaskInputDTO(title=title, description=description)
            task_dto = self.update_task.execute(task_id, input_dto)

            message = f"Task {task_id} updated successfully"
            self.console.print(format_success_message(message))

        except EntityNotFoundError as e:
            self.console.print(format_error_message(str(e)))
        except ValidationError as e:
            self.console.print(format_error_message(str(e)))
        except ValueError as e:
            self.console.print(format_error_message(str(e)))
        except Exception as e:
            self.console.print(format_error_message(f"Unexpected error: {e}"))

    def _handle_delete_task(self) -> None:
        """Handle delete task operation."""
        try:
            self.console.print("\n[bold]Delete Task[/bold]")
            task_id_str = Prompt.ask("Task ID")
            task_id = validate_task_id(task_id_str)

            # Confirm deletion
            confirm = Confirm.ask(f"Are you sure you want to delete task {task_id}?", default=False)

            if confirm:
                self.delete_task.execute(task_id)
                message = f"Task {task_id} deleted successfully"
                self.console.print(format_success_message(message))
            else:
                self.console.print("[dim]Deletion cancelled[/dim]")

        except EntityNotFoundError as e:
            self.console.print(format_error_message(str(e)))
        except ValueError as e:
            self.console.print(format_error_message(str(e)))
        except Exception as e:
            self.console.print(format_error_message(f"Unexpected error: {e}"))

    def _handle_exit(self) -> None:
        """Handle exit operation."""
        self.console.print("\n[bold cyan]Thank you for using Todo App! 👋[/bold cyan]\n")
