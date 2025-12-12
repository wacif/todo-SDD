# Implementation Plan: Phase II - Full-Stack Web Application

**Branch**: `002-phase-web-app` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-phase-web-app/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Transform the console-based todo application into a modern, multi-user web application with persistent storage, RESTful API, responsive web interface, and JWT-based authentication. This implementation reuses Phase I domain logic and use cases while replacing in-memory storage with PostgreSQL and adding web/API layers.

## Technical Context

**Language/Version**: 
- Backend: Python 3.13+
- Frontend: TypeScript 5.0+ (strict mode)

**Primary Dependencies**:
- Backend: FastAPI 0.104+, SQLModel 0.0.14+, PyJWT 2.8+, Pydantic 2.5+, Alembic
- Frontend: Next.js 16+ (App Router), React 19, Better Auth, Tailwind CSS 3.4+, axios

**Storage**: Neon Serverless PostgreSQL 15+ (cloud-hosted, connection pooling included)

**Testing**: 
- Backend: pytest 7.4+, pytest-asyncio, pytest-cov (≥80% coverage)
- Frontend: Jest 29+, React Testing Library, Playwright (E2E)

**Target Platform**: 
- Backend: Linux server (Docker container)
- Frontend: Node.js 20+ (Docker container)
- Database: Neon cloud (managed PostgreSQL)

**Project Type**: Web application (monorepo with frontend/ and backend/ directories)

**Performance Goals**: 
- API response time: <500ms p95 for mutations, <1s p95 for queries
- Frontend TTI: <3s on 4G connection
- Database queries: <100ms p95 with proper indexing

**Constraints**: 
- JWT token expiry: 7 days (no refresh tokens in v1)
- Max task title: 200 characters
- Max task description: 1000 characters
- Rate limiting: 5 auth requests per 15min, 100 task operations per min per user

**Scale/Scope**: 
- Initial: 100-1000 users, ~100 tasks per user
- Architecture supports: 10k+ users with horizontal scaling
- 7 user stories, 8 API endpoints, 15 React components, 7 Next.js pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Spec-Driven Development ✅
- [x] Comprehensive specifications exist in `specs/002-phase-web-app/`
- [x] User stories with acceptance criteria defined (7 stories: US-W1 to US-W7)
- [x] Test cases derivable from acceptance criteria
- [x] All specifications versioned in git (commits 6645fcd, 65d324e)

### II. Progressive Evolution Architecture ✅
- [x] Builds upon Phase I foundation (reuses domain entities and use cases)
- [x] Clean Architecture maintained across phases
- [x] Interfaces designed for future evolution (Phase III AI integration)
- [x] Migration path documented (InMemoryTaskRepository → PostgresTaskRepository)

### III. Test-First Development ✅
- [x] Test requirements defined in feature specifications
- [x] Unit test strategy: pytest for use cases and repositories
- [x] Integration test strategy: pytest for API endpoints
- [x] E2E test strategy: Playwright for user workflows
- [x] Coverage target: ≥80% (enforced by constitution)

### IV. Clean Architecture & Separation of Concerns ✅
- [x] 4-layer architecture maintained: Domain → Application → API → Infrastructure
- [x] Domain layer has zero external dependencies
- [x] Repository protocols isolate infrastructure
- [x] Use cases orchestrate business logic without framework coupling
- [x] File organization follows clean architecture conventions

### V. Feature Completeness Standards ✅
- [x] All Phase I features (Add/View/Update/Delete/Complete) reimplemented for web
- [x] Each feature has specification with acceptance criteria
- [x] Test coverage planned for all features
- [x] Documentation exists (overview.md, architecture.md, 9 other specs)

### VI. AI Integration Standards (Phase III) 🔄
- [x] Architecture designed for AI layer addition (Phase III future work)
- [x] Use cases reusable by AI interface (same as CLI and API)
- [ ] Actual AI integration deferred to Phase III

### VII. Cloud-Native & DevOps Excellence 🔄
- [x] Containerization planned (Docker Compose for local dev)
- [x] Health checks required in specifications
- [x] 12-factor principles applied (environment-based config)
- [ ] Kubernetes deployment deferred to Phase IV
- [ ] Observability (metrics/tracing) planned for Phase IV+

**GATE STATUS**: ✅ PASS - All required gates for Phase II satisfied. Phase III/IV items are future work as expected.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/                              # FastAPI backend application
├── src/
│   ├── api/                         # API layer (routes, middleware)
│   │   ├── __init__.py
│   │   ├── auth_routes.py          # POST /api/auth/signup, /signin
│   │   ├── task_routes.py          # /api/{user_id}/tasks/* endpoints
│   │   └── dependencies.py         # JWT middleware, DB session injection
│   ├── application/                 # Application layer (use cases) - REUSED FROM PHASE I
│   │   ├── dto/
│   │   │   ├── task_dto.py
│   │   │   └── task_input_dto.py
│   │   └── use_cases/
│   │       ├── add_task.py
│   │       ├── list_tasks.py
│   │       ├── update_task.py
│   │       ├── delete_task.py
│   │       └── mark_task_complete.py
│   ├── domain/                      # Domain layer (entities) - REUSED FROM PHASE I
│   │   ├── entities/
│   │   │   ├── task.py             # Task entity
│   │   │   └── user.py             # User entity (NEW)
│   │   ├── exceptions/
│   │   │   └── domain_exceptions.py
│   │   └── repositories/
│   │       ├── task_repository.py  # Protocol (interface)
│   │       └── user_repository.py  # Protocol (NEW)
│   └── infrastructure/              # Infrastructure layer (NEW)
│       ├── database.py              # SQLModel engine, session factory
│       └── repositories/
│           ├── postgres_task_repository.py   # Replaces InMemoryTaskRepository
│           └── postgres_user_repository.py   # NEW
├── migrations/                       # Alembic migrations
│   ├── env.py
│   └── versions/
│       └── 001_initial_schema.sql
├── tests/
│   ├── unit/                        # Use case tests (REUSE FROM PHASE I)
│   │   ├── test_add_task.py
│   │   ├── test_list_tasks.py
│   │   ├── test_update_task.py
│   │   ├── test_delete_task.py
│   │   └── test_mark_complete.py
│   └── integration/                 # API endpoint tests (NEW)
│       ├── test_auth_routes.py
│       └── test_task_routes.py
├── main.py                          # FastAPI app entry point
├── pyproject.toml                   # Dependencies (FastAPI, SQLModel, PyJWT)
└── Dockerfile

frontend/                             # Next.js frontend application
├── app/                             # App Router pages (Next.js 13+)
│   ├── (auth)/                      # Auth route group (no layout inheritance)
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   └── signup/
│   │       └── page.tsx            # Signup page
│   ├── (dashboard)/                 # Protected routes
│   │   └── tasks/
│   │       ├── page.tsx            # Task list page
│   │       ├── new/
│   │       │   └── page.tsx        # Create task page
│   │       └── [id]/
│   │           ├── page.tsx        # Task detail page
│   │           └── edit/
│   │               └── page.tsx    # Edit task page
│   ├── layout.tsx                   # Root layout (Better Auth provider)
│   └── page.tsx                     # Landing page
├── components/
│   ├── ui/                          # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   └── Modal.tsx
│   ├── auth/
│   │   └── AuthForm.tsx            # Reusable login/signup form
│   ├── tasks/
│   │   ├── TaskCard.tsx            # Single task display
│   │   ├── TaskList.tsx            # Task list container
│   │   └── TaskForm.tsx            # Task create/edit form
│   ├── Navbar.tsx                   # Navigation bar
│   └── PageLayout.tsx               # Common page wrapper
├── lib/
│   ├── api.ts                       # API client (axios + JWT injection)
│   ├── auth.ts                      # Better Auth configuration
│   └── types.ts                     # TypeScript types (TaskDTO, UserDTO)
├── middleware.ts                    # Route protection middleware
├── tests/
│   ├── components/                  # Component tests (Jest + RTL)
│   │   ├── TaskCard.test.tsx
│   │   ├── TaskList.test.tsx
│   │   └── TaskForm.test.tsx
│   └── e2e/                         # End-to-end tests (Playwright)
│       ├── auth.spec.ts
│       └── tasks.spec.ts
├── package.json                     # Dependencies (Next.js, React, Better Auth)
├── next.config.js
├── tailwind.config.js
└── Dockerfile

src/                                  # Phase I console app (REFERENCE ONLY)
├── application/                      # Use cases reused in backend/src/application/
├── domain/                           # Entities reused in backend/src/domain/
├── infrastructure/                   # InMemoryTaskRepository NOT reused
└── interface/                        # Console interface NOT reused

specs/002-phase-web-app/              # Phase II specifications
├── spec.md                          # 7 user stories
├── architecture.md                  # System design
├── overview.md                      # Phase objectives
├── database/
│   └── schema.md                    # PostgreSQL schema
├── api/
│   └── rest-endpoints.md            # 8 API endpoints
├── ui/
│   ├── components.md                # 15 React components
│   └── pages.md                     # 7 Next.js pages
└── features/
    ├── task-crud.md                 # CRUD operations
    ├── authentication.md            # Better Auth + JWT
    └── persistent-storage.md        # PostgreSQL patterns

docker-compose.yml                    # Local development setup
```

**Structure Decision**: Monorepo with separate backend/ and frontend/ directories. This structure:
- Isolates frontend and backend concerns while keeping them in one repository
- Allows independent deployment of frontend and backend
- Reuses Phase I domain logic and use cases from src/ directory
- Follows Next.js App Router conventions for file-based routing
- Maintains Clean Architecture in backend (api/ → application/ → domain/ → infrastructure/)
- Enables shared TypeScript types between frontend and backend (future optimization)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations detected. All constitution gates pass for Phase II scope.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
