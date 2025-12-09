"""API validators for email and password."""

import re


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength.

    Requirements:
        - Minimum 8 characters
        - At least 1 uppercase letter
        - At least 1 lowercase letter
        - At least 1 number

    Args:
        password: Plain text password to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"

    return True, ""


def validate_email(email: str) -> tuple[bool, str]:
    """
    Validate email format (RFC 5322 basic validation).

    Args:
        email: Email address to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    # Basic RFC 5322 regex pattern
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if not re.match(pattern, email):
        return False, "Invalid email format"

    if len(email) > 255:
        return False, "Email cannot exceed 255 characters"

    return True, ""
