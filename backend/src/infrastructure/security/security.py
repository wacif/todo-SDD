"""Security utilities for password hashing and JWT."""

from datetime import datetime, timedelta
import logging
from typing import Optional
from uuid import UUID

import base64
import json
import time
import urllib.request

import bcrypt
import jwt
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

from src.infrastructure.config.settings import settings

# Bcrypt cost factor for password hashing
BCRYPT_ROUNDS = 12

logger = logging.getLogger(__name__)


_JWKS_CACHE: dict[str, object] = {"fetched_at": 0.0, "jwks": None}
_JWKS_CACHE_TTL_SECONDS = 300


def _fetch_better_auth_jwks() -> dict:
    now = time.time()
    cached_at = float(_JWKS_CACHE.get("fetched_at", 0.0) or 0.0)
    cached_jwks = _JWKS_CACHE.get("jwks")

    if cached_jwks is not None and (now - cached_at) < _JWKS_CACHE_TTL_SECONDS:
        return cached_jwks  # type: ignore[return-value]

    jwks_url = f"{settings.better_auth_url.rstrip('/')}/api/auth/jwks"
    with urllib.request.urlopen(jwks_url, timeout=5) as response:
        body = response.read().decode("utf-8")
        jwks = json.loads(body)

    _JWKS_CACHE["fetched_at"] = now
    _JWKS_CACHE["jwks"] = jwks
    return jwks


def _b64url_decode(data: str) -> bytes:
    padded = data + "=" * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode(padded.encode("utf-8"))


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Bcrypt hashed password
    """
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Bcrypt hashed password

    Returns:
        True if password matches, False otherwise
    """
    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(user_id: UUID, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token for a user.

    Args:
        user_id: Unique user identifier
        expires_delta: Token expiration time (defaults to JWT_EXPIRATION_DAYS)

    Returns:
        Encoded JWT token
    """
    if expires_delta is None:
        expires_delta = timedelta(days=settings.jwt_expiration_days)

    expire = datetime.utcnow() + expires_delta
    to_encode = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    encoded_jwt = jwt.encode(
        to_encode, settings.better_auth_secret or settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[str]:
    """
    Decode and verify a JWT access token.

    Args:
        token: Encoded JWT token

    Returns:
        User ID if token is valid, None otherwise
    """
    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")

        if alg == "EdDSA":
            kid = header.get("kid")
            if not kid:
                return None

            jwks = _fetch_better_auth_jwks()
            keys = jwks.get("keys", [])
            jwk = next((k for k in keys if k.get("kid") == kid), None)
            if jwk is None:
                return None

            if jwk.get("kty") != "OKP" or jwk.get("crv") != "Ed25519" or "x" not in jwk:
                return None

            public_bytes = _b64url_decode(jwk["x"])
            public_key = Ed25519PublicKey.from_public_bytes(public_bytes)

            payload = jwt.decode(
                token,
                public_key,
                algorithms=["EdDSA"],
                options={"verify_aud": False},
            )
        else:
            # Legacy HS* tokens (backend-issued)
            secret = settings.better_auth_secret or settings.jwt_secret_key
            payload = jwt.decode(token, secret, algorithms=[settings.jwt_algorithm])

        user_id = payload.get("sub")
        if not isinstance(user_id, str) or not user_id:
            return None
        return user_id
    except Exception as e:
        logger.debug("Token validation error", exc_info=True)
        return None
