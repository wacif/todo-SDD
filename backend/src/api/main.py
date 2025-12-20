"""FastAPI application initialization."""

import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.auth_routes import router as auth_router
from src.api.routes.task_routes import router as task_router
from src.infrastructure.config.settings import settings

app = FastAPI(
    title="DoBot API",
    description="DoBot task management API with user authentication",
    version="1.0.0",
    debug=settings.debug,
)

_perf_logger = logging.getLogger("uvicorn.error")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(task_router)

@app.middleware("http")
async def log_request_timing(request: Request, call_next):
    if not settings.log_request_timing:
        return await call_next(request)

    start_time = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - start_time) * 1000
    if elapsed_ms >= settings.log_slow_request_ms:
        _perf_logger.info(
            "slow request method=%s path=%s status=%s duration_ms=%.2f",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
    return response


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
