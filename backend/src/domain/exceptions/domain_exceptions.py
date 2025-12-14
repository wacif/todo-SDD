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


class UnauthorizedError(DomainException):
    """Raised when user is not authorized to perform an action."""

    pass


class DuplicateEntityError(DomainException):
    """Raised when attempting to create duplicate entity."""

    pass
