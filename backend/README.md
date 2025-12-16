# DoBot Backend

FastAPI backend for the DoBot application.

## Setup

```bash
uv venv
uv pip install -e ".[dev]"
```

## Development

```bash
uvicorn src.api.main:app --reload
```

## Database migrations (Alembic)

Local (uses your current environment / `DATABASE_URL`):

```bash
cd backend
alembic upgrade head
```

Docker Compose (runs migrations inside the backend service container):

```bash
docker compose exec backend alembic upgrade head
```
