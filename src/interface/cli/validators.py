"""Input validators for CLI."""


def validate_task_id(input_str: str) -> int:
    """
    Validate and convert task ID input.

    Args:
        input_str: User input string

    Returns:
        Validated task ID as integer

    Raises:
        ValueError: If input is not a positive integer
    """
    try:
        task_id = int(input_str)
        if task_id <= 0:
            raise ValueError("Task ID must be a positive integer")
        return task_id
    except ValueError as e:
        if "invalid literal" in str(e):
            raise ValueError("Task ID must be a positive integer")
        raise


def validate_title(input_str: str) -> str:
    """
    Validate task title.

    Args:
        input_str: User input string

    Returns:
        Validated and stripped title

    Raises:
        ValueError: If title is empty or exceeds maximum length
    """
    title = input_str.strip()
    if not title:
        raise ValueError("Title cannot be empty")
    if len(title) > 200:
        raise ValueError("Title exceeds maximum length of 200 characters")
    return title


def validate_description(input_str: str) -> str:
    """
    Validate task description.

    Args:
        input_str: User input string

    Returns:
        Validated and stripped description

    Raises:
        ValueError: If description exceeds maximum length
    """
    description = input_str.strip()
    if len(description) > 1000:
        raise ValueError("Description exceeds maximum length of 1000 characters")
    return description


def validate_menu_choice(input_str: str, valid_choices: list[str]) -> str:
    """
    Validate menu choice.

    Args:
        input_str: User input string
        valid_choices: List of valid menu options

    Returns:
        Validated choice

    Raises:
        ValueError: If choice is not in valid options
    """
    if input_str not in valid_choices:
        raise ValueError(f"Invalid choice. Please select from {', '.join(valid_choices)}")
    return input_str
