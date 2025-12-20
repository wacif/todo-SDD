"""Database connection management."""

import logging
import time

from sqlmodel import Session, create_engine
from sqlalchemy import event

from src.infrastructure.config.settings import settings

_logger = logging.getLogger("uvicorn.error")


def _install_sql_timing(db_engine) -> None:
    if not settings.log_sql_timing:
        return

    @event.listens_for(db_engine, "before_cursor_execute")
    def _before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        conn.info.setdefault("query_start_time", []).append(time.perf_counter())

    @event.listens_for(db_engine, "after_cursor_execute")
    def _after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        start_time = conn.info.get("query_start_time", []).pop(-1)
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        if elapsed_ms >= settings.log_slow_query_ms:
            _logger.info("slow query duration_ms=%.2f statement=%s", elapsed_ms, statement)


# Create database engine
engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)
_install_sql_timing(engine)


def get_session() -> Session:
    """
    Get database session for dependency injection.

    Yields:
        SQLModel database session
    """
    with Session(engine) as session:
        yield session
