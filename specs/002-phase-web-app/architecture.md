# System Architecture: Phase II - Full-Stack Web Application

**Version**: 2.0  
**Created**: 2025-12-07  
**Status**: Design  
**Phase**: Phase II - Web Application

## Architecture Overview

Phase II evolves from a single-process console application to a distributed full-stack web application with:
- **Frontend**: Next.js 16+ (App Router) for server-side rendered React application
- **Backend**: FastAPI for high-performance REST API
- **Database**: Neon Serverless PostgreSQL for persistent storage
- **Authentication**: Better Auth + JWT for stateless authentication
- **Deployment**: Docker Compose for local development, cloud-ready architecture

## High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            Next.js Frontend (Port 3000)                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │  │
│  │  │   Pages    │  │ Components │  │  API Client│             │  │
│  │  │ (App       │  │ (TaskCard, │  │  (axios)   │             │  │
│  │  │  Router)   │  │  TaskForm) │  │            │             │  │
│  │  └────────────┘  └────────────┘  └──────┬─────┘             │  │
│  │                                          │                    │  │
│  │  ┌──────────────────────────────────────▼─────────────────┐  │  │
│  │  │  Better Auth Client (Session Management + JWT)         │  │  │
│  │  └──────────────────────────────────────┬─────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬───────────────────────────────────┘
                                 │ HTTPS + JWT Token
                                 │ (Authorization: Bearer <token>)
                                 │
┌────────────────────────────────▼───────────────────────────────────┐
│                    FastAPI Backend (Port 8000)                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               JWT Middleware (Token Verification)            │  │
│  │  • Extracts token from Authorization header                  │  │
│  │  • Verifies signature using BETTER_AUTH_SECRET               │  │
│  │  • Decodes user_id and email                                 │  │
│  │  • Injects authenticated user into request context           │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│  ┌────────────────────────────▼─────────────────────────────────┐  │
│  │                      API Routes Layer                         │  │
│  │  /api/auth/*     - Authentication endpoints                  │  │
│  │  /api/{uid}/tasks - Task CRUD endpoints                      │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│  ┌────────────────────────────▼─────────────────────────────────┐  │
│  │                   Application Layer (Use Cases)               │  │
│  │  • AddTaskUseCase           • UpdateTaskUseCase              │  │
│  │  • ListTasksUseCase         • DeleteTaskUseCase              │  │
│  │  • MarkCompleteUseCase      • AuthenticateUserUseCase        │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│  ┌────────────────────────────▼─────────────────────────────────┐  │
│  │                      Domain Layer                             │  │
│  │  • Task Entity              • User Entity                     │  │
│  │  • TaskRepository Protocol  • UserRepository Protocol        │  │
│  │  • Domain Exceptions                                          │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│  ┌────────────────────────────▼─────────────────────────────────┐  │
│  │              Infrastructure Layer (SQLModel ORM)              │  │
│  │  • PostgresTaskRepository   • PostgresUserRepository         │  │
│  │  • Database Session Management                               │  │
│  │  • Connection Pooling                                        │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────────┬───────────────────────────────────┘
                                 │ SQL Queries
                                 │
┌────────────────────────────────▼───────────────────────────────────┐
│              Neon Serverless PostgreSQL (Cloud)                     │
│  ┌──────────────────────┐      ┌──────────────────────┐           │
│  │   users table        │      │   tasks table        │           │
│  │  (Better Auth)       │◄─────│  (Application Data)  │           │
│  │                      │  FK  │                      │           │
│  │  • id (PK)           │      │  • id (PK)           │           │
│  │  • email             │      │  • user_id (FK)      │           │
│  │  • password_hash     │      │  • title             │           │
│  │  • name              │      │  • description       │           │
│  │  • created_at        │      │  • completed         │           │
│  │                      │      │  • created_at        │           │
│  │                      │      │  • updated_at        │           │
│  └──────────────────────┘      └──────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (Next.js 16+)

**Technology**: Next.js with App Router, React 19, TypeScript, Tailwind CSS

**Responsibilities**:
- Server-side rendering (SSR) for fast initial page loads
- Client-side routing for smooth navigation
- Form handling and validation
- JWT token management (storage, refresh)
- API communication with backend
- User session management via Better Auth

**Key Files**:
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── (dashboard)/
│   │   ├── tasks/page.tsx          # Task list page
│   │   └── tasks/[id]/page.tsx     # Task detail page
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home/landing page
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── TaskCard.tsx                # Task display component
│   ├── TaskForm.tsx                # Task create/edit form
│   ├── TaskList.tsx                # Task list container
│   └── Navbar.tsx                  # Navigation bar
├── lib/
│   ├── api.ts                      # API client (axios wrapper)
│   ├── auth.ts                     # Better Auth configuration
│   └── types.ts                    # TypeScript types
└── middleware.ts                   # Next.js middleware for auth
```

**Data Flow**:
1. User interacts with UI component
2. Component calls API client function
3. API client attaches JWT token to request
4. Request sent to backend
5. Response received and parsed
6. Component state updated, UI re-renders

---

### 2. Backend (FastAPI)

**Technology**: FastAPI, Python 3.13+, SQLModel, Pydantic

**Responsibilities**:
- RESTful API endpoints
- JWT token verification
- Business logic execution (use cases)
- Database operations
- Error handling and logging
- API documentation (OpenAPI/Swagger)

**Key Files**:
```
backend/
├── main.py                         # FastAPI app entry point
├── config.py                       # Configuration (env vars)
├── middleware/
│   └── auth.py                     # JWT verification middleware
├── routes/
│   ├── auth.py                     # Authentication endpoints
│   └── tasks.py                    # Task CRUD endpoints
├── models/
│   ├── user.py                     # SQLModel User model
│   └── task.py                     # SQLModel Task model
├── schemas/
│   ├── user_schema.py              # Pydantic request/response schemas
│   └── task_schema.py              # Pydantic request/response schemas
├── use_cases/
│   ├── add_task.py                 # Business logic for adding task
│   ├── list_tasks.py               # Business logic for listing tasks
│   ├── update_task.py              # Business logic for updating task
│   ├── delete_task.py              # Business logic for deleting task
│   └── mark_complete.py            # Business logic for toggling status
├── repositories/
│   ├── task_repository.py          # Database operations for tasks
│   └── user_repository.py          # Database operations for users
├── db.py                           # Database connection and session
└── exceptions.py                   # Custom exception classes
```

**Request Flow**:
1. Request arrives at endpoint
2. JWT middleware verifies token
3. Route handler extracts user_id from token
4. Use case executed with validated data
5. Repository performs database operation
6. Response returned to client

---

### 3. Authentication Flow (Better Auth + JWT)

**Better Auth Configuration**:
```typescript
// frontend/lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  jwt: {
    enabled: true,
    expiresIn: "7d",
    algorithm: "HS256"
  },
  database: {
    // Uses shared Neon PostgreSQL
  }
})
```

**JWT Middleware (Backend)**:
```python
# backend/middleware/auth.py
from fastapi import Request, HTTPException
import jwt

async def verify_jwt(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    
    token = auth_header.replace("Bearer ", "")
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        request.state.user_id = payload["user_id"]
        request.state.email = payload["email"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

**Authentication Sequence Diagram**:
```
User          Frontend         Backend         Database
 │               │                │                │
 │─Login Form──►│                │                │
 │               │─POST /auth/───►│                │
 │               │   signin       │─SELECT user──►│
 │               │                │◄──user data───│
 │               │                │                │
 │               │                │ (verify password)
 │               │                │                │
 │               │◄─JWT token────│                │
 │◄─Redirect────│                │                │
 │               │                │                │
 │─View Tasks───►│                │                │
 │               │─GET /api/      │                │
 │               │  {uid}/tasks   │                │
 │               │  + JWT token──►│                │
 │               │                │ (verify JWT)   │
 │               │                │─SELECT tasks──►│
 │               │                │◄──tasks───────│
 │               │◄─tasks JSON────│                │
 │◄─UI renders──│                │                │
```

---

### 4. Database Schema (Neon PostgreSQL)

**Technology**: PostgreSQL 15+, SQLModel for ORM

**Tables**:

#### users (Managed by Better Auth)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### tasks (Application Managed)
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

**Relationships**:
- One user → Many tasks (1:N)
- Foreign key: tasks.user_id → users.id
- Cascade delete: Deleting user deletes all their tasks

**Connection**:
```python
# backend/db.py
from sqlmodel import create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL")  # Neon connection string
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session
```

---

### 5. API Endpoints

**Base URL**: `http://localhost:8000` (dev), `https://api.example.com` (prod)

**Authentication Endpoints**:
```
POST /api/auth/signup    - Register new user
POST /api/auth/signin    - Login (get JWT token)
POST /api/auth/signout   - Logout (invalidate session)
GET  /api/auth/session   - Get current session info
```

**Task Endpoints** (all require JWT):
```
GET    /api/{user_id}/tasks              - List all user's tasks
POST   /api/{user_id}/tasks              - Create new task
GET    /api/{user_id}/tasks/{id}         - Get single task
PUT    /api/{user_id}/tasks/{id}         - Update task
DELETE /api/{user_id}/tasks/{id}         - Delete task
PATCH  /api/{user_id}/tasks/{id}/complete - Toggle completion
```

**Authorization Logic**:
```python
# backend/routes/tasks.py
@router.get("/api/{user_id}/tasks")
async def list_tasks(
    user_id: str,
    request: Request,
    session: Session = Depends(get_session)
):
    # Verify user_id in URL matches authenticated user
    if request.state.user_id != user_id:
        raise HTTPException(403, "Access denied")
    
    # Query only this user's tasks
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
    
    return {"tasks": tasks}
```

---

### 6. Clean Architecture Layers

**Domain Layer** (Business Logic):
- Entities: Task, User (pure Python dataclasses)
- Repository Protocols (interfaces)
- Domain Exceptions (TaskNotFound, ValidationError)
- Business rules (title length, validation)

**Application Layer** (Use Cases):
- AddTaskUseCase: Validates input, creates task
- ListTasksUseCase: Retrieves tasks for user
- UpdateTaskUseCase: Validates and updates task
- DeleteTaskUseCase: Removes task
- MarkCompleteUseCase: Toggles task status
- AuthenticateUserUseCase: Verifies credentials

**Interface Layer** (API):
- FastAPI route handlers
- Request/response schema validation (Pydantic)
- Error handling middleware
- OpenAPI documentation

**Infrastructure Layer** (External):
- PostgresTaskRepository: Database operations
- PostgresUserRepository: User database operations
- JWT utilities: Token generation/verification
- Environment configuration
- Logging setup

**Dependency Flow**:
```
Interface → Application → Domain ← Infrastructure
   ↓            ↓           ↓           ↓
FastAPI    Use Cases   Entities    Database
Routes                 Protocols   JWT Utils
```

---

### 7. Security Architecture

**Threat Model**:

| Threat | Mitigation |
|--------|------------|
| SQL Injection | SQLModel parameterized queries |
| XSS | React automatic escaping |
| CSRF | SameSite cookies, CORS config |
| Password Theft | Bcrypt hashing (cost 12) |
| Token Theft | HTTP-only cookies, short expiry |
| Unauthorized Access | JWT verification on every request |
| Data Leakage | User-scoped queries, foreign key constraints |

**Defense in Depth**:
1. **Frontend**: Input validation, sanitization
2. **Transport**: HTTPS only (TLS 1.3)
3. **Backend**: JWT verification, authorization checks
4. **Database**: Row-level security via user_id filtering
5. **Infrastructure**: Environment variable secrets, no hardcoded keys

**JWT Token Structure**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "uuid-123",
    "email": "sarah@example.com",
    "iat": 1701960000,
    "exp": 1702564800
  },
  "signature": "<signed with BETTER_AUTH_SECRET>"
}
```

---

### 8. Deployment Architecture

**Development (Docker Compose)**:
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=todo_dev
      - POSTGRES_USER=dev
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Production (Cloud-Native)**:
```
┌─────────────────┐
│  Users (HTTPS)  │
└────────┬────────┘
         │
┌────────▼────────────────────┐
│   CDN (Static Assets)        │
└────────┬────────────────────┘
         │
┌────────▼────────────────────┐
│  Next.js (Vercel/AWS)        │
│  - SSR                       │
│  - API Routes (optional)     │
└────────┬────────────────────┘
         │
┌────────▼────────────────────┐
│  FastAPI (AWS/GCP/Azure)     │
│  - Auto-scaling              │
│  - Load balancer             │
└────────┬────────────────────┘
         │
┌────────▼────────────────────┐
│  Neon PostgreSQL (Cloud)     │
│  - Auto-scaling              │
│  - Automated backups         │
└─────────────────────────────┘
```

---

### 9. Data Flow Examples

**Create Task Flow**:
```
1. User fills form: title="Buy milk", description="2% milk"
2. Frontend validates: title non-empty, < 200 chars
3. Frontend sends: POST /api/uuid-123/tasks + JWT token
4. Backend middleware: Verifies JWT, extracts user_id
5. Backend route: Checks user_id matches URL
6. Use case: Validates business rules, creates Task entity
7. Repository: INSERT INTO tasks (...) VALUES (...)
8. Database: Returns new task with id, timestamps
9. Repository: Returns Task object
10. Use case: Returns success
11. Route: Returns 201 Created + task JSON
12. Frontend: Updates UI, shows success message
```

**List Tasks Flow**:
```
1. User navigates to /tasks page
2. Frontend: GET /api/uuid-123/tasks + JWT token
3. Backend middleware: Verifies JWT
4. Backend route: Checks authorization
5. Use case: Calls ListTasksUseCase
6. Repository: SELECT * FROM tasks WHERE user_id = 'uuid-123' ORDER BY created_at DESC
7. Database: Returns array of tasks
8. Repository: Maps to Task entities
9. Use case: Returns task list
10. Route: Returns 200 OK + tasks JSON
11. Frontend: Renders TaskList component with TaskCard for each task
```

---

## Technology Decisions (ADRs)

### ADR-001: Why Next.js App Router?
- **Decision**: Use Next.js 16+ with App Router (not Pages Router)
- **Rationale**: Server components reduce client bundle, better performance, modern patterns
- **Alternatives**: Pages Router (older), Remix, SvelteKit
- **Consequences**: Steeper learning curve, but better long-term maintainability

### ADR-002: Why FastAPI over Django/Flask?
- **Decision**: Use FastAPI for backend
- **Rationale**: Async support, automatic OpenAPI docs, type safety with Pydantic
- **Alternatives**: Django (too heavy), Flask (no async), Django REST Framework
- **Consequences**: Requires async programming knowledge

### ADR-003: Why SQLModel over Prisma/TypeORM?
- **Decision**: Use SQLModel for Python ORM
- **Rationale**: Type-safe, integrates with Pydantic, simpler than SQLAlchemy
- **Alternatives**: SQLAlchemy (complex), Prisma (Node.js only), raw SQL (no type safety)
- **Consequences**: Smaller community than SQLAlchemy

### ADR-004: Why Neon over RDS/Heroku Postgres?
- **Decision**: Use Neon Serverless PostgreSQL
- **Rationale**: Auto-scaling, generous free tier, modern developer experience
- **Alternatives**: AWS RDS (expensive), Heroku (less modern), Supabase (includes extra features)
- **Consequences**: Vendor lock-in to Neon

### ADR-005: Why Better Auth over Auth0/Clerk?
- **Decision**: Use Better Auth for authentication
- **Rationale**: Open-source, self-hosted, no per-user pricing, full control
- **Alternatives**: Auth0 (expensive), Clerk (less flexible), NextAuth (complex)
- **Consequences**: More setup work, but no vendor lock-in

### ADR-006: Why Monorepo over Separate Repos?
- **Decision**: Use monorepo for frontend + backend
- **Rationale**: Easier for Claude Code to navigate, atomic commits, shared types
- **Alternatives**: Separate repos (more complex CI/CD)
- **Consequences**: Larger repo size, need monorepo tooling

---

## Non-Functional Architecture

### Performance
- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Connection pooling, query optimization, caching (future)
- **Database**: Indexes on user_id, completed, created_at

### Scalability
- **Frontend**: Stateless, horizontal scaling via CDN
- **Backend**: Stateless (JWT), horizontal scaling ready
- **Database**: Neon auto-scaling, read replicas (future)

### Reliability
- **Frontend**: Error boundaries, fallback UI
- **Backend**: Health checks, graceful shutdown
- **Database**: Automated backups, point-in-time recovery

### Observability
- **Frontend**: Error tracking (Sentry), analytics
- **Backend**: Structured logging (JSON), request tracing
- **Database**: Query performance monitoring

---

## Migration Strategy (Phase I → Phase II)

### Code Reuse
- ✅ Domain entities (Task structure)
- ✅ Use case logic (business rules)
- ✅ Validation rules (title/description)
- ✅ Test scenarios (adapt to API)

### New Code
- Frontend: Next.js pages, components, API client
- Backend: FastAPI routes, SQLModel models, JWT middleware
- Database: PostgreSQL schema, migrations
- Infrastructure: Docker Compose, environment config

### Testing Strategy
- **Backend**: Adapt Phase I unit tests to new repository implementation
- **API**: New integration tests for HTTP endpoints
- **Frontend**: New component and E2E tests
- **Coverage**: Maintain ≥80% target

---

## Development Workflow

1. **Setup**: Clone repo, configure environment variables
2. **Backend First**: Implement API endpoints with tests
3. **Frontend**: Build UI components consuming API
4. **Integration**: Connect frontend to backend
5. **Testing**: E2E tests for complete flows
6. **Deployment**: Docker Compose for local, cloud for production

---

## Success Criteria

| Metric | Target |
|--------|--------|
| API Response Time | < 500ms (p95) |
| Page Load Time | < 2s |
| Test Coverage | ≥ 80% |
| Uptime | 99.9% |
| Security | All OWASP Top 10 mitigated |

---

**Status**: ✅ Architecture Design Complete  
**Next Step**: Database schema specification  
**Approved By**: (Pending review)  
**Last Updated**: 2025-12-07
