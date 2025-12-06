"""Unit tests for CLI input validators."""

import pytest
from src.interface.cli.validators import (
    validate_task_id,
    validate_title,
    validate_description,
    validate_menu_choice,
)


class TestValidateTaskId:
    """Test task ID validation."""

    def test_valid_positive_integer(self):
        """Test that valid positive integer passes."""
        assert validate_task_id("1") == 1
        assert validate_task_id("42") == 42
        assert validate_task_id("999") == 999

    def test_invalid_zero_raises_error(self):
        """Test that zero raises ValueError."""
        with pytest.raises(ValueError, match="Task ID must be a positive integer"):
            validate_task_id("0")

    def test_invalid_negative_raises_error(self):
        """Test that negative number raises ValueError."""
        with pytest.raises(ValueError, match="Task ID must be a positive integer"):
            validate_task_id("-1")

    def test_invalid_non_numeric_raises_error(self):
        """Test that non-numeric input raises ValueError."""
        with pytest.raises(ValueError, match="Task ID must be a positive integer"):
            validate_task_id("abc")

    def test_invalid_empty_string_raises_error(self):
        """Test that empty string raises ValueError."""
        with pytest.raises(ValueError, match="Task ID must be a positive integer"):
            validate_task_id("")


class TestValidateTitle:
    """Test title validation."""

    def test_valid_title(self):
        """Test that valid title passes."""
        assert validate_title("Valid Title") == "Valid Title"
        assert validate_title("a") == "a"

    def test_title_strips_whitespace(self):
        """Test that leading/trailing whitespace is stripped."""
        assert validate_title("  Title  ") == "Title"

    def test_empty_title_raises_error(self):
        """Test that empty title raises ValueError."""
        with pytest.raises(ValueError, match="Title cannot be empty"):
            validate_title("")

    def test_whitespace_only_title_raises_error(self):
        """Test that whitespace-only title raises ValueError."""
        with pytest.raises(ValueError, match="Title cannot be empty"):
            validate_title("   ")

    def test_title_too_long_raises_error(self):
        """Test that title > 200 chars raises ValueError."""
        long_title = "a" * 201
        with pytest.raises(ValueError, match="Title exceeds maximum length of 200"):
            validate_title(long_title)


class TestValidateDescription:
    """Test description validation."""

    def test_valid_description(self):
        """Test that valid description passes."""
        assert validate_description("Valid description") == "Valid description"
        assert validate_description("") == ""

    def test_description_strips_whitespace(self):
        """Test that leading/trailing whitespace is stripped."""
        assert validate_description("  Description  ") == "Description"

    def test_empty_description_allowed(self):
        """Test that empty description is allowed."""
        assert validate_description("") == ""
        assert validate_description("   ") == ""

    def test_description_too_long_raises_error(self):
        """Test that description > 1000 chars raises ValueError."""
        long_desc = "a" * 1001
        with pytest.raises(ValueError, match="Description exceeds maximum length of 1000"):
            validate_description(long_desc)


class TestValidateMenuChoice:
    """Test menu choice validation."""

    def test_valid_choices(self):
        """Test that valid menu choices pass."""
        assert validate_menu_choice("1", ["1", "2", "3", "4", "5", "6"]) == "1"
        assert validate_menu_choice("6", ["1", "2", "3", "4", "5", "6"]) == "6"

    def test_invalid_choice_raises_error(self):
        """Test that invalid choice raises ValueError."""
        with pytest.raises(ValueError, match="Invalid choice"):
            validate_menu_choice("7", ["1", "2", "3", "4", "5", "6"])

    def test_empty_choice_raises_error(self):
        """Test that empty choice raises ValueError."""
        with pytest.raises(ValueError, match="Invalid choice"):
            validate_menu_choice("", ["1", "2", "3", "4", "5", "6"])
