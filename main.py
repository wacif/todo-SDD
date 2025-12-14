#!/usr/bin/env python3
"""Main entry point for DoBot - Phase I: Basic Task Management."""

from src.infrastructure.persistence.in_memory_task_repository import InMemoryTaskRepository
from src.interface.cli.console_app import ConsoleApp


def main() -> None:
    """
    Main function with dependency injection.

    Initializes repository and starts the console application.
    """
    # Initialize repository (in-memory for Phase I)
    repository = InMemoryTaskRepository()

    # Create and run console app
    app = ConsoleApp(repository)
    app.run()


if __name__ == "__main__":
    main()
