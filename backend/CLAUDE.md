# Backend Context: FastAPI Application

## Architecture

**Framework**: FastAPI  
**Language**: Python 3.13+ (strict typing)  
**ORM**: SQLModel  
**Database**: PostgreSQL (Neon Serverless)  
**Auth**: JWT verification (PyJWT)

## Project Structure

```
backend/
├── main.py                    # FastAPI app entry point
├── src/
│   ├── api/
│   │   ├── auth_routes.py     # /api/auth/* endpoints
│   │   ├── task_routes.py     # /api/{user_id}/tasks/* endpoints
│   │   └── dependencies.py    # JWT middleware, DB session
│   ├── application/
│   │   ├── use_cases/         # Business logic (from Phase I)
│   │   └── dto/               # Data transfer objects
│   ├── domain/
│   │   ├── entities/          # Task, User models
│   │   └── repositories/      # Repository protocols
│   └── infrastructure/
│       ├── database.py        # SQLModel engine, session
│       └── repositories/
│           └── postgres_task_repository.py
├── migrations/                # Alembic migrations
└── tests/
    ├── unit/                  # Use case tests
    └── integration/           # API endpoint tests
```

## Key Patterns

### Clean Architecture Layers

1. **API Layer** (`src/api/`) - Route handlers, request/response validation
2. **Application Layer** (`src/application/`) - Use cases (business logic)
3. **Domain Layer** (`src/domain/`) - Entities, repository protocols
4. **Infrastructure Layer** (`src/infrastructure/`) - Database, external services

### JWT Middleware

```python
from src.api.dependencies import get_current_user

@router.get("/api/{user_id}/tasks")
async def list_tasks(
    user_id: UUID,
    current_user: UUID = Depends(get_current_user)
):
    if user_id != current_user:
        raise HTTPException(403, "Forbidden")
    # ...
```

### Repository Pattern

Use cases depend on repository protocols, not implementations:

```python
# Use case receives TaskRepository (protocol)
class ListTasksUseCase:
    def __init__(self, task_repository: TaskRepository):
        self.task_repository = task_repository
    
    def execute(self, user_id: UUID) -> list[TaskDTO]:
        tasks = self.task_repository.list_by_user(user_id)
        # ...
```

Dependency injection at API layer provides concrete implementation.

### Database Sessions

```python
from src.api.dependencies import get_db

@router.post("/api/{user_id}/tasks")
async def create_task(
    db: Session = Depends(get_db)
):
    repository = PostgresTaskRepository(db)
    # ...
```

## Environment Variables

```bash
DATABASE_URL=postgresql://...       # Neon connection string
BETTER_AUTH_SECRET=...              # JWT signing secret (shared with frontend)
```

## Specifications

Read these before implementing:
- `specs/002-phase-web-app/api/rest-endpoints.md` - API contracts
- `specs/002-phase-web-app/database/schema.md` - Database schema
- `specs/002-phase-web-app/architecture.md` - System design

## Testing

```bash
pytest tests/unit/              # Use case tests
pytest tests/integration/       # API endpoint tests
pytest --cov=src tests/         # Coverage report (target: ≥80%)
```

## Reusing Phase I Code

✅ **Reuse**: All use cases from `src/application/use_cases/`  
✅ **Reuse**: Domain entities from `src/domain/entities/`  
❌ **Replace**: InMemoryTaskRepository → PostgresTaskRepository  
✅ **Add**: JWT middleware, FastAPI routes, SQLModel database layer
