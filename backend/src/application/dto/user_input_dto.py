"""User input DTOs - for registration and authentication."""

from dataclasses import dataclass


@dataclass(frozen=True)
class UserSignupDTO:
    """
    Data Transfer Object for user registration.

    Used to transfer signup data from interface → application layer.
    Password is plain text (transmitted over HTTPS).
    """

    email: str
    name: str
    password: str  # Plain text - will be hashed in application layer


@dataclass(frozen=True)
class UserLoginDTO:
    """
    Data Transfer Object for user authentication.

    Used to transfer login credentials from interface → application layer.
    """

    email: str
    password: str  # Plain text - compared against password_hash
