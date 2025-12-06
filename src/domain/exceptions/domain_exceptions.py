"""Domain exceptions for the todo application."""


class DomainException(Exception):
    """Base exception for domain layer errors."""

    pass


class ValidationError(DomainException):
    """Exception raised when validation rules are violated."""

    pass


class EntityNotFoundError(DomainException):
    """Exception raised when an entity is not found."""

    pass


class DuplicateEntityError(DomainException):
    """Exception raised when attempting to create a duplicate entity."""

    pass
