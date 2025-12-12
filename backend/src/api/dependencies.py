"""FastAPI dependencies for authentication and authorization."""

from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from src.domain.exceptions.domain_exceptions import EntityNotFoundError
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.persistence.database import get_session
from src.infrastructure.persistence.postgres_user_repository import PostgresUserRepository
from src.infrastructure.security.security import decode_access_token

# HTTP Bearer token scheme for JWT
security = HTTPBearer()


def get_user_repository(session: Session = Depends(get_session)) -> UserRepository:
    """
    Dependency to get user repository.

    Args:
        session: Database session

    Returns:
        UserRepository instance
    """
    return PostgresUserRepository(session)


async def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> UUID:
    """
    Get the current authenticated user ID from JWT token.

    Args:
        credentials: HTTP Bearer token credentials

    Returns:
        User UUID from JWT token

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    token = credentials.credentials
    user_id = decode_access_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


async def get_current_user(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
):
    """
    Get the current authenticated user entity.

    Args:
        user_id: User ID from JWT token
        user_repository: User repository for database operations

    Returns:
        User entity

    Raises:
        HTTPException: 404 if user not found
    """
    try:
        user = user_repository.get_by_id(user_id)
        return user
    except EntityNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
