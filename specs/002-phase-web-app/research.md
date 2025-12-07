# Phase 0: Research & Technical Decisions

**Phase**: Phase II - Full-Stack Web Application  
**Date**: 2025-12-07  
**Status**: Complete

## Overview

This document resolves all technical unknowns and documents technology choices for Phase II implementation. All decisions are based on specification requirements, constitutional constraints, and modern best practices.

---

## 1. Authentication Strategy

### Decision: Better Auth + JWT (Stateless)

**Rationale**:
- **Better Auth**: Modern, lightweight authentication library for Next.js with built-in JWT support
- **JWT Tokens**: Stateless authentication enables horizontal scaling without session storage
- **7-Day Expiry**: Balances security (short-lived tokens) with UX (less frequent logins)
- **Shared Secret**: Backend and frontend share `BETTER_AUTH_SECRET` for token verification

**Alternatives Considered**:
- **NextAuth.js**: More features but heavier, includes unnecessary OAuth providers
- **Supabase Auth**: Couples authentication to Supabase ecosystem
- **Custom JWT**: Reinventing the wheel, more error-prone

**Implementation Details**:
- Frontend: Better Auth client handles token storage (HTTP-only cookies)
- Backend: Custom PyJWT middleware extracts and verifies tokens
- Token payload: `{ user_id: UUID, email: string, exp: timestamp }`
- No refresh tokens in v1 (simplicity over complexity)

**References**:
- Better Auth Docs: https://better-auth.com/docs
- JWT Best Practices: RFC 8725

---

## 2. Database Choice & ORM

### Decision: Neon Serverless PostgreSQL + SQLModel

**Rationale**:
- **Neon**: Serverless PostgreSQL eliminates infrastructure management, built-in connection pooling
- **SQLModel**: Type-safe ORM built on Pydantic + SQLAlchemy, natural fit for FastAPI
- **PostgreSQL**: ACID compliance, robust indexing, JSON support for future features

**Alternatives Considered**:
- **SQLite**: Insufficient for multi-user web app (locking issues)
- **MongoDB**: NoSQL unnecessary for structured task data
- **SQLAlchemy Core**: More verbose, loses type safety benefits
- **Raw SQL**: Error-prone, no type checking, harder to maintain

**Implementation Details**:
- Connection string from `DATABASE_URL` environment variable
- Connection pooling: Neon handles automatically (50 connections per branch)
- Migrations: Alembic for schema versioning
- Repository pattern: `PostgresTaskRepository` implements `TaskRepository` protocol

**Schema Strategy**:
- `users` table: Managed by Better Auth (email, password_hash, metadata)
- `tasks` table: Application data with `user_id` foreign key (CASCADE DELETE)
- Indexes: `idx_tasks_user_id`, `idx_tasks_completed`, composite `idx_tasks_user_created`

**References**:
- Neon Docs: https://neon.tech/docs
- SQLModel Docs: https://sqlmodel.tiangolo.com/

---

## 3. Frontend Framework & Patterns

### Decision: Next.js 16 (App Router) + React 19 + TypeScript

**Rationale**:
- **Next.js App Router**: File-based routing, server components for better performance
- **React 19**: Latest stable with improved hydration and concurrent features
- **TypeScript Strict**: Compile-time type safety reduces runtime errors
- **Tailwind CSS**: Utility-first styling, rapid development, consistent design

**Alternatives Considered**:
- **Pages Router (Next.js 12)**: Legacy, lacks server component benefits
- **Remix**: Less mature ecosystem, steeper learning curve
- **Vite + React**: No SSR out of the box, manual routing setup
- **CSS Modules**: More verbose than Tailwind, harder to maintain consistency

**Implementation Details**:
- **Route Groups**: `(auth)` for login/signup (no auth check), `(dashboard)` for protected routes
- **Server Components**: Default for pages, client components only when needed (forms, interactivity)
- **Middleware**: JWT verification at route level (`middleware.ts`)
- **API Client**: Axios wrapper with JWT injection in `lib/api.ts`

**Component Architecture**:
- **Base UI**: Button, Input, Textarea, Modal (reusable, variant-based)
- **Feature Components**: TaskCard, TaskList, TaskForm (domain-specific)
- **Layouts**: PageLayout (common wrapper), Navbar (navigation)

**References**:
- Next.js App Router: https://nextjs.org/docs/app
- React 19 Features: https://react.dev/blog/2024/12/05/react-19

---

## 4. Backend Architecture & Clean Architecture Enforcement

### Decision: FastAPI + 4-Layer Clean Architecture

**Rationale**:
- **FastAPI**: High performance (async), automatic OpenAPI docs, Pydantic validation
- **Clean Architecture**: Separates concerns, enables testability, isolates framework dependencies
- **Repository Pattern**: Abstracts data access, allows swapping implementations

**Layer Responsibilities**:

**1. API Layer** (`backend/src/api/`):
- Route handlers (FastAPI endpoints)
- Request/response validation (Pydantic models)
- JWT middleware (token verification)
- Dependency injection (DB sessions, repositories)
- **Dependencies**: FastAPI, Pydantic, application layer

**2. Application Layer** (`backend/src/application/`):
- Use cases (business logic orchestration)
- DTOs (data transfer objects)
- Protocol definitions (interfaces)
- **Dependencies**: Domain layer ONLY

**3. Domain Layer** (`backend/src/domain/`):
- Entities (Task, User)
- Repository protocols (TaskRepository, UserRepository)
- Domain exceptions
- **Dependencies**: NONE (pure Python)

**4. Infrastructure Layer** (`backend/src/infrastructure/`):
- Database implementation (SQLModel)
- Repository implementations (PostgresTaskRepository)
- External service integrations
- **Dependencies**: Domain protocols, SQLModel, Neon

**Reuse from Phase I**:
- ✅ Use cases: Copy from `src/application/use_cases/` (no changes needed)
- ✅ Domain entities: Copy from `src/domain/entities/` (add User entity)
- ❌ Infrastructure: Replace InMemoryTaskRepository with PostgresTaskRepository

**References**:
- Clean Architecture: Robert C. Martin (Uncle Bob)
- FastAPI Dependency Injection: https://fastapi.tiangolo.com/tutorial/dependencies/

---

## 5. Testing Strategy

### Decision: Multi-Level Testing (Unit, Integration, E2E)

**Backend Testing** (pytest):

**Unit Tests** (≥80% coverage):
- Target: Use cases in isolation
- Mocking: Mock repository implementations
- Coverage: All business logic paths
- Files: `tests/unit/test_*.py`

**Integration Tests**:
- Target: API endpoints with real database
- Setup: Test database per test suite
- Coverage: Request/response validation, authentication
- Files: `tests/integration/test_*_routes.py`

**Frontend Testing**:

**Component Tests** (Jest + React Testing Library):
- Target: UI components in isolation
- Mocking: Mock API calls
- Coverage: User interactions, accessibility
- Files: `tests/components/*.test.tsx`

**E2E Tests** (Playwright):
- Target: Complete user workflows
- Coverage: Signup → Login → Create Task → Complete Task → Delete Task
- Files: `tests/e2e/*.spec.ts`

**Test Data Strategy**:
- Fixtures in `conftest.py` (pytest) and `setupTests.ts` (Jest)
- Factory functions for test entities
- Database seeding for E2E tests

**References**:
- pytest Best Practices: https://docs.pytest.org/
- React Testing Library: https://testing-library.com/react
- Playwright: https://playwright.dev/

---

## 6. Deployment & DevOps

### Decision: Docker Compose (Local), Cloud-Ready Architecture

**Local Development**:
- `docker-compose.yml`: Frontend (port 3000), Backend (port 8000), Neon (connection string)
- Hot reload enabled for both frontend and backend
- Shared network for container communication

**Environment Variables**:
```env
# Backend (.env)
DATABASE_URL=postgresql://user:pass@neon.tech/db
BETTER_AUTH_SECRET=shared-secret-min-32-chars
CORS_ORIGINS=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=shared-secret-min-32-chars
```

**Production Considerations** (Future):
- Frontend: Vercel/Netlify deployment (Next.js optimized)
- Backend: Railway/Render deployment (FastAPI container)
- Database: Neon production branch
- HTTPS required for production (JWT cookies need secure flag)

**References**:
- Docker Compose: https://docs.docker.com/compose/
- 12-Factor App: https://12factor.net/

---

## 7. API Design Patterns

### Decision: RESTful API with Standard HTTP Methods

**Endpoint Structure**:
```
POST   /api/auth/signup              # Create account
POST   /api/auth/signin              # Get JWT token
GET    /api/{user_id}/tasks          # List tasks (requires JWT)
POST   /api/{user_id}/tasks          # Create task
GET    /api/{user_id}/tasks/{id}     # Get task by ID
PUT    /api/{user_id}/tasks/{id}     # Update task
PATCH  /api/{user_id}/tasks/{id}/complete  # Toggle completion
DELETE /api/{user_id}/tasks/{id}     # Delete task
```

**Design Principles**:
- **Resource-based URLs**: Nouns not verbs (`/tasks` not `/getTasks`)
- **HTTP methods**: GET (read), POST (create), PUT (full update), PATCH (partial), DELETE
- **Status codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
- **JWT in header**: `Authorization: Bearer <token>` (not in URL or body)
- **User isolation**: Backend verifies `user_id` in URL matches JWT token

**Request/Response Format**:
- Content-Type: `application/json`
- Request bodies: Validated by Pydantic models
- Error responses: `{ "error": "message", "code": "ERROR_CODE" }`

**Rate Limiting**:
- Auth endpoints: 5 requests per 15 minutes (prevents brute force)
- Task endpoints: 100 requests per minute per user

**References**:
- REST API Best Practices: https://restfulapi.net/
- HTTP Status Codes: RFC 7231

---

## 8. Security Considerations

### Decision: Defense in Depth

**Authentication Security**:
- Password hashing: bcrypt with cost factor 12
- JWT signing: HS256 algorithm with 256-bit secret
- Token transmission: HTTP-only cookies (XSS protection)
- HTTPS required in production (prevents token interception)

**Authorization**:
- User isolation: All queries filter by `user_id` from JWT
- Middleware verification: Token validated before route handler
- Ownership check: Backend verifies user owns requested resource

**Input Validation**:
- Title: 1-200 characters, required
- Description: 0-1000 characters, optional
- Email: RFC 5322 validation
- SQL injection: Prevented by SQLModel parameterized queries

**CORS Configuration**:
- Development: `http://localhost:3000` allowed
- Production: Specific domain whitelist only
- Credentials: Allowed (for cookie transmission)

**Rate Limiting**:
- Prevents brute force attacks on authentication
- Prevents abuse of task operations

**References**:
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- JWT Security: RFC 8725

---

## 9. Migration Strategy from Phase I

### Decision: Gradual Migration with Protocol Preservation

**What to Reuse** (✅):
1. **Domain Entities**: Copy `src/domain/entities/task.py` to `backend/src/domain/entities/task.py`
2. **Use Cases**: Copy all `src/application/use_cases/*.py` to `backend/src/application/use_cases/*.py`
3. **DTOs**: Copy `src/application/dto/*.py` to `backend/src/application/dto/*.py`
4. **Repository Protocol**: Copy `src/domain/repositories/task_repository.py` (interface unchanged)

**What to Replace** (❌):
1. **InMemoryTaskRepository**: Replace with `PostgresTaskRepository` in `backend/src/infrastructure/repositories/`
2. **Console Interface**: Replace with FastAPI routes in `backend/src/api/`
3. **No Authentication**: Add User entity and authentication logic

**Migration Steps**:
1. Create backend directory structure
2. Copy reusable components (domain, application layers)
3. Implement new infrastructure layer (PostgreSQL)
4. Implement new API layer (FastAPI routes)
5. Add authentication (JWT middleware, User entity)
6. Migrate tests (use cases tests unchanged, add integration tests)

**Benefits of This Approach**:
- Business logic unchanged (use cases validated in Phase I)
- Repository pattern allows clean swap (InMemory → Postgres)
- Tests for use cases can be reused
- Clean Architecture boundaries maintained

---

## 10. Performance Optimization

### Decision: Proactive Performance Design

**Database Optimization**:
- **Indexes**: Primary indexes on `user_id`, `completed`, `created_at`
- **Composite Index**: `(user_id, created_at)` for sorted task lists
- **Connection Pooling**: Neon handles automatically (50 connections)
- **Query Optimization**: Use `SELECT` with specific columns, avoid `SELECT *`

**Backend Optimization**:
- **Async/Await**: FastAPI async endpoints for concurrent request handling
- **Pydantic Validation**: Fast C-based validation (vs manual checks)
- **Response Caching**: Consider Redis for future (not in v1)

**Frontend Optimization**:
- **Server Components**: Default rendering strategy (less JavaScript shipped)
- **Code Splitting**: Next.js automatic route-based splitting
- **Image Optimization**: Next.js `<Image>` component (future if images added)
- **API Call Batching**: Combine related requests where possible

**Monitoring**:
- **Performance Targets**: API <500ms p95, Queries <1s p95, Frontend TTI <3s
- **Logging**: Structured JSON logs (timestamp, level, message, context)
- **Health Checks**: `/health` endpoint for backend liveness

**References**:
- PostgreSQL Indexing: https://www.postgresql.org/docs/current/indexes.html
- FastAPI Performance: https://fastapi.tiangolo.com/async/

---

## Summary of Resolved Clarifications

All items marked "NEEDS CLARIFICATION" in Technical Context have been resolved:

✅ **Language/Version**: Python 3.13+ (backend), TypeScript 5.0+ (frontend)  
✅ **Primary Dependencies**: FastAPI, SQLModel, Next.js, Better Auth  
✅ **Storage**: Neon Serverless PostgreSQL 15+  
✅ **Testing**: pytest (backend), Jest + Playwright (frontend)  
✅ **Target Platform**: Docker containers, Linux server  
✅ **Performance Goals**: <500ms API, <1s queries, <3s TTI  
✅ **Constraints**: JWT 7-day expiry, rate limiting, field length limits  
✅ **Scale/Scope**: 100-1000 users initially, scalable to 10k+

All technology choices documented with rationale, alternatives considered, and implementation details.

**Status**: Research complete. Ready for Phase 1 (Design & Contracts).
