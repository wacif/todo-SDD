"""Authentication routes for signup and signin."""

from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from src.api.models.auth_models import AuthResponse, SigninRequest, SignupRequest
from src.api.validators import validate_password
from src.application.dto.user_input_dto import UserSignupDTO
from src.application.use_cases.signin import InvalidCredentialsError, SigninUseCase
from src.application.use_cases.signup import SignupUseCase
from src.domain.exceptions.domain_exceptions import DuplicateEntityError, ValidationError
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.persistence.database import get_session
from src.infrastructure.persistence.postgres_user_repository import PostgresUserRepository
from src.infrastructure.security.security import create_access_token, hash_password

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def get_user_repository(session: Session = Depends(get_session)) -> UserRepository:
    """Dependency to get user repository."""
    return PostgresUserRepository(session)


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: SignupRequest,
    user_repository: UserRepository = Depends(get_user_repository),
):
    """
    Create a new user account.

    - Validates email and password
    - Hashes password with bcrypt
    - Creates user in database
    - Returns JWT token
    """
    # Validate password strength
    is_valid, error_msg = validate_password(request.password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)

    # Create signup DTO
    signup_dto = UserSignupDTO(
        email=request.email, name=request.name, password=request.password
    )

    try:
        # Execute signup use case
        signup_use_case = SignupUseCase(user_repository)
        user_dto = signup_use_case.execute(signup_dto)

        # Create JWT token
        access_token = create_access_token(user_dto.id)

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=str(user_dto.id),
            email=user_dto.email,
            name=user_dto.name,
        )
    except DuplicateEntityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/signin", response_model=dict, status_code=status.HTTP_200_OK)
async def signin(
    request: SigninRequest,
    user_repository: UserRepository = Depends(get_user_repository),
):
    """
    Authenticate user and receive JWT token.

    - Verifies email exists
    - Verifies password matches
    - Returns JWT token with user data and expiration
    """
    try:
        # Execute signin use case
        signin_use_case = SigninUseCase(user_repository)
        result = signin_use_case.execute(request.email, request.password)

        return {
            "token": result.token,
            "user": {
                "id": str(result.user.id),
                "email": result.user.email,
                "name": result.user.name,
            },
            "expires_at": result.expires_at.isoformat() + "Z",
        }
    except InvalidCredentialsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect",
        )
