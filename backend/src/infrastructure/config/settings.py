"""Configuration settings for the application."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


_BACKEND_DIR = Path(__file__).resolve().parents[3]
_REPO_ROOT = _BACKEND_DIR.parent
_ENV_FILES = tuple(
    str(p)
    for p in (
        _BACKEND_DIR / ".env",
        _BACKEND_DIR / ".env.local",
        _REPO_ROOT / ".env",
        _REPO_ROOT / ".env.local",
        _REPO_ROOT / "frontend" / ".env.local",
    )
    if p.exists()
)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=_ENV_FILES or None,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database
    database_url: str = "postgresql://user:password@localhost:5432/todo_app"

    # JWT
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_days: int = 7
    better_auth_secret: str = "better-auth-secret-must-match-frontend"

    # Better Auth
    better_auth_url: str = "http://localhost:3000"

    # Application
    app_env: str = "development"
    debug: bool = True
    allowed_origins: str = "http://localhost:3000"
    log_request_timing: bool = False
    log_slow_request_ms: int = 500
    log_sql_timing: bool = False
    log_slow_query_ms: int = 200

    # Server
    host: str = "0.0.0.0"
    port: int = 8000


settings = Settings()
