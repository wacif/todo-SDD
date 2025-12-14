"""Application settings and configuration."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    """
    Application configuration settings.

    For Phase I (in-memory), minimal configuration is needed.
    Future phases will expand this with database URLs, API keys, etc.
    """

    app_name: str = "DoBot"
    version: str = "0.1.0"
    debug: bool = False


# Global settings instance
settings = Settings()
