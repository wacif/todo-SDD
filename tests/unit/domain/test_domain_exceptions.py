"""Unit tests for domain exceptions."""

import pytest
from src.domain.exceptions.domain_exceptions import (
    DomainException,
    ValidationError,
    EntityNotFoundError,
    DuplicateEntityError,
)


class TestDomainExceptions:
    """Test domain exception hierarchy."""

    def test_validation_error_inherits_from_domain_exception(self):
        """Test that ValidationError inherits from DomainException."""
        error = ValidationError("Test validation error")
        assert isinstance(error, DomainException)
        assert isinstance(error, Exception)

    def test_validation_error_message(self):
        """Test ValidationError message."""
        error = ValidationError("Title cannot be empty")
        assert str(error) == "Title cannot be empty"

    def test_entity_not_found_error_inherits_from_domain_exception(self):
        """Test that EntityNotFoundError inherits from DomainException."""
        error = EntityNotFoundError("Task not found")
        assert isinstance(error, DomainException)
        assert isinstance(error, Exception)

    def test_entity_not_found_error_message(self):
        """Test EntityNotFoundError message."""
        error = EntityNotFoundError("Task with ID 5 not found")
        assert str(error) == "Task with ID 5 not found"

    def test_duplicate_entity_error_inherits_from_domain_exception(self):
        """Test that DuplicateEntityError inherits from DomainException."""
        error = DuplicateEntityError("Duplicate task")
        assert isinstance(error, DomainException)
        assert isinstance(error, Exception)

    def test_duplicate_entity_error_message(self):
        """Test DuplicateEntityError message."""
        error = DuplicateEntityError("Task with ID 1 already exists")
        assert str(error) == "Task with ID 1 already exists"

    def test_domain_exception_base(self):
        """Test DomainException base class."""
        error = DomainException("Base domain error")
        assert isinstance(error, Exception)
        assert str(error) == "Base domain error"
