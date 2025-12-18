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

## Deploy to Fly.io

This branch includes `backend/Dockerfile` and `backend/fly.toml`.

From the repo root:

```bash
cd backend
fly launch   # pick an app name + region
fly secrets set \
  DATABASE_URL='...' \
  JWT_SECRET_KEY='...' \
  BETTER_AUTH_SECRET='...' \
  BETTER_AUTH_URL='https://your-frontend-domain'

# optional (CORS)
fly secrets set ALLOWED_ORIGINS='https://your-frontend-domain'

fly deploy
```

Health check: `GET /health`
