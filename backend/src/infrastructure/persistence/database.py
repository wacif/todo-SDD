"""Database connection management."""

from sqlmodel import Session, create_engine

from src.infrastructure.config.settings import settings

# Create database engine
engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)


def get_session() -> Session:
    """
    Get database session for dependency injection.

    Yields:
        SQLModel database session
    """
    with Session(engine) as session:
        yield session
