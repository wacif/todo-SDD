"""Domain exceptions - business rule violations."""


class DomainException(Exception):
    """Base exception for all domain-related errors."""

    pass


class ValidationError(DomainException):
    """Raised when entity validation fails (business rule violation)."""

    pass


class EntityNotFoundError(DomainException):
    """Raised when requested entity does not exist."""

    pass


class DuplicateEntityError(DomainException):
    """Raised when attempting to create duplicate entity."""

    pass


class UnauthorizedError(DomainException):
    """Raised when user lacks permission for operation."""

    pass
