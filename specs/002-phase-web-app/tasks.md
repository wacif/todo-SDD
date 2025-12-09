# Implementation Tasks: Phase II - Full-Stack Web Application

**Feature**: Phase II - Full-Stack Web Application  
**Branch**: `002-phase-web-app`  
**Created**: 2025-12-07  
**Status**: Ready for Implementation

## Overview

This document provides a dependency-ordered task breakdown for implementing Phase II. Tasks are organized by user story to enable independent implementation and testing. Each phase represents a complete, shippable increment.

**Total Tasks**: 85  
**User Stories**: 7 (US-W1 to US-W7)  
**Estimated Duration**: 5-8 days

---

## Task Summary by User Story

| User Story | Priority | Tasks | Dependencies | Test Criteria |
|------------|----------|-------|--------------|---------------|
| Setup | - | 10 | None | Project builds successfully |
| Foundational | - | 15 | Setup complete | Repository tests pass |
| US-W1 (Registration) | P0 | 8 | Foundational | User can create account |
| US-W2 (Login) | P0 | 7 | US-W1 | User can authenticate and receive JWT |
| US-W3 (Add Task) | P1 | 10 | US-W2 | User can create tasks via web form |
| US-W4 (View Tasks) | P2 | 8 | US-W3 | User can see their task list |
| US-W5 (Mark Complete) | P3 | 7 | US-W4 | User can toggle task status |
| US-W6 (Update Task) | P4 | 10 | US-W4 | User can edit task details |
| US-W7 (Delete Task) | P5 | 7 | US-W4 | User can remove tasks |
| Polish | - | 3 | All stories | Performance and UX improvements |

---

## Implementation Strategy

### MVP Scope (Day 1-3)
- Setup + Foundational + US-W1 + US-W2 + US-W3
- Deliverable: Users can register, login, and create tasks

### Full Feature Set (Day 4-6)
- US-W4 + US-W5 + US-W6 + US-W7
- Deliverable: Complete CRUD operations

### Polish (Day 7-8)
- Performance optimization, accessibility, documentation
- Deliverable: Production-ready application

---

## Phase 1: Setup (No Story Label)

**Goal**: Initialize project structure and development environment  
**Duration**: 1-2 hours  
**Dependencies**: None

### Tasks

- [X] T001 Create backend directory structure: backend/src/{api,application,domain,infrastructure}
- [X] T002 Create frontend directory structure: frontend/app/{(auth),(dashboard)}/components/lib
- [X] T003 Initialize backend Python environment with uv and create pyproject.toml
- [X] T004 Initialize frontend Node.js project with npm and create package.json
- [X] T005 [P] Configure backend dependencies in pyproject.toml (FastAPI, SQLModel, PyJWT, Alembic, pytest)
- [X] T006 [P] Configure frontend dependencies in package.json (Next.js 16, React 19, Better Auth, Tailwind CSS)
- [X] T007 [P] Create backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
- [X] T008 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET
- [X] T009 Setup Neon PostgreSQL database and obtain connection string
- [X] T010 Configure docker-compose.yml for local development (frontend, backend, database)

**Test Criteria**:
- ✅ `cd backend && uv pip install` succeeds
- ✅ `cd frontend && npm install` succeeds
- ✅ `docker-compose up` starts all services
- ✅ Backend health check responds at `http://localhost:8000/health`
- ✅ Frontend loads at `http://localhost:3000`

---

## Phase 2: Foundational (No Story Label)

**Goal**: Implement shared infrastructure and reusable Phase I components  
**Duration**: 4-6 hours  
**Dependencies**: Phase 1 complete

### Tasks

- [X] T011 [P] Copy Task entity from src/domain/entities/task.py to backend/src/domain/entities/task.py
- [X] T012 [P] Create User entity in backend/src/domain/entities/user.py with SQLModel table definition
- [X] T013 [P] Create TaskRepository protocol in backend/src/domain/repositories/task_repository.py
- [X] T014 [P] Create UserRepository protocol in backend/src/domain/repositories/user_repository.py
- [X] T015 [P] Copy all 5 use cases from src/application/use_cases/ to backend/src/application/use_cases/
- [X] T016 [P] Copy DTOs from src/application/dto/ to backend/src/application/dto/
- [X] T017 Create database connection in backend/src/infrastructure/database.py (SQLModel engine, session factory)
- [X] T018 Implement PostgresTaskRepository in backend/src/infrastructure/repositories/postgres_task_repository.py
- [X] T019 Implement PostgresUserRepository in backend/src/infrastructure/repositories/postgres_user_repository.py
- [X] T020 Create Alembic migration 001_initial_schema.sql in backend/migrations/versions/
- [X] T021 [P] Write unit tests for PostgresTaskRepository in backend/tests/unit/test_postgres_task_repository.py
- [X] T022 [P] Write unit tests for PostgresUserRepository in backend/tests/unit/test_postgres_user_repository.py
- [X] T023 Create FastAPI app entry point in backend/main.py with CORS and health check endpoint
- [X] T024 [P] Setup Tailwind CSS configuration in frontend/tailwind.config.js
- [X] T025 [P] Create base layout in frontend/app/layout.tsx with Better Auth provider

**Test Criteria**:
- ✅ `pytest backend/tests/unit/test_postgres_task_repository.py` passes
- ✅ `pytest backend/tests/unit/test_postgres_user_repository.py` passes
- ✅ `alembic upgrade head` creates tables successfully
- ✅ `curl http://localhost:8000/health` returns `{"status": "healthy"}`
- ✅ Database has `users` and `tasks` tables with correct schema

---

## Phase 3: US-W1 - User Registration (P0)

**Goal**: Users can create accounts with email and password  
**Duration**: 3-4 hours  
**Dependencies**: Phase 2 complete  
**Story**: US-W1 from spec.md

### Tasks

- [X] T026 [P] [US1] Create Pydantic SignupRequest model in backend/src/api/models/auth_models.py
- [X] T027 [P] [US1] Create POST /api/auth/signup route in backend/src/api/auth_routes.py
- [X] T028 [US1] Implement password hashing with bcrypt (cost factor 12) in backend/src/infrastructure/security.py
- [X] T029 [US1] Implement email validation (RFC 5322) in backend/src/api/validators.py
- [X] T030 [US1] Add unique email constraint handling (409 Conflict response)
- [X] T031 [P] [US1] Write integration test for signup endpoint in backend/tests/integration/test_auth_routes.py
- [X] T032 [P] [US1] Create signup page UI in frontend/app/(auth)/signup/page.tsx
- [X] T033 [US1] Create AuthForm component in frontend/components/auth/AuthForm.tsx (reusable for login/signup)

**Test Criteria**:
- ✅ POST /api/auth/signup with valid data creates user and returns 201
- ✅ POST /api/auth/signup with duplicate email returns 409
- ✅ POST /api/auth/signup with weak password returns 400
- ✅ Password stored in database is bcrypt hashed (not plain text)
- ✅ Frontend signup form validates and submits successfully

**API Contract**:
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah@example.com","name":"Sarah","password":"SecurePass123!"}'
```

---

## Phase 4: US-W2 - User Login (P0)

**Goal**: Users can authenticate and receive JWT token  
**Duration**: 3-4 hours  
**Dependencies**: US-W1 complete  
**Story**: US-W2 from spec.md

### Tasks

- [X] T034 [P] [US2] Create Pydantic SigninRequest model in backend/src/api/models/auth_models.py
- [X] T035 [P] [US2] Create POST /api/auth/signin route in backend/src/api/auth_routes.py
- [X] T036 [US2] Implement JWT token generation (HS256, 7-day expiry) in backend/src/infrastructure/jwt.py
- [X] T037 [US2] Implement password verification against bcrypt hash
- [X] T038 [US2] Create JWT middleware for token verification in backend/src/api/dependencies.py (get_current_user)
- [X] T039 [P] [US2] Write integration test for signin endpoint in backend/tests/integration/test_auth_routes.py
- [X] T040 [P] [US2] Create login page UI in frontend/app/(auth)/login/page.tsx

**Test Criteria**:
- ✅ POST /api/auth/signin with correct credentials returns JWT token
- ✅ POST /api/auth/signin with wrong password returns 401
- ✅ JWT token contains user_id, email, iat, exp fields
- ✅ JWT middleware successfully verifies valid tokens
- ✅ JWT middleware rejects expired/invalid tokens
- ✅ Frontend login form authenticates and stores token in cookie

**API Contract**:
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah@example.com","password":"SecurePass123!"}'
```

---

## Phase 5: US-W3 - Add Task (P1)

**Goal**: Authenticated users can create tasks via web form  
**Duration**: 4-5 hours  
**Dependencies**: US-W2 complete  
**Story**: US-W3 from spec.md

### Tasks

- [X] T041 [P] [US3] Create Pydantic TaskInputDTO model in backend/src/api/models/task_models.py
- [X] T042 [P] [US3] Create POST /api/{user_id}/tasks route in backend/src/api/task_routes.py
- [X] T043 [US3] Wire AddTaskUseCase with JWT middleware (inject authenticated user_id)
- [X] T044 [US3] Add user_id ownership validation (403 if URL user_id != token user_id)
- [X] T045 [US3] Add title/description validation (1-200 chars, 0-1000 chars)
- [X] T046 [P] [US3] Write integration test for create task endpoint in backend/tests/integration/test_task_routes.py
- [X] T047 [P] [US3] Create TaskForm component in frontend/components/tasks/TaskForm.tsx
- [X] T048 [P] [US3] Create task creation page in frontend/app/(dashboard)/tasks/new/page.tsx
- [X] T049 [P] [US3] Create API client method createTask in frontend/lib/api.ts (axios with JWT injection)
- [X] T050 [US3] Wire TaskForm to API client and handle success/error states

**Test Criteria**:
- ✅ POST /api/{user_id}/tasks with valid data creates task and returns 201
- ✅ POST /api/{user_id}/tasks with missing JWT returns 401
- ✅ POST /api/{user_id}/tasks with mismatched user_id returns 403
- ✅ POST /api/{user_id}/tasks with empty title returns 400
- ✅ POST /api/{user_id}/tasks with >200 char title returns 400
- ✅ Frontend form validates and creates task successfully
- ✅ Created task appears in database with correct user_id

**API Contract**:
```bash
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```

---

## Phase 6: US-W4 - View Tasks (P2)

**Goal**: Users can see their complete task list  
**Duration**: 3-4 hours  
**Dependencies**: US-W3 complete  
**Story**: US-W4 from spec.md

### Tasks

- [ ] T051 [P] [US4] Create GET /api/{user_id}/tasks route in backend/src/api/task_routes.py
- [ ] T052 [US4] Wire ListTasksUseCase with JWT middleware and user_id filtering
- [ ] T053 [US4] Add query optimization (index on user_id, created_at)
- [ ] T054 [P] [US4] Write integration test for list tasks endpoint in backend/tests/integration/test_task_routes.py
- [ ] T055 [P] [US4] Create TaskCard component in frontend/components/tasks/TaskCard.tsx
- [ ] T056 [P] [US4] Create TaskList component in frontend/components/tasks/TaskList.tsx
- [ ] T057 [P] [US4] Create tasks list page in frontend/app/(dashboard)/tasks/page.tsx
- [ ] T058 [US4] Create API client method listTasks in frontend/lib/api.ts

**Test Criteria**:
- ✅ GET /api/{user_id}/tasks returns only authenticated user's tasks
- ✅ GET /api/{user_id}/tasks returns tasks sorted by created_at DESC
- ✅ GET /api/{user_id}/tasks with missing JWT returns 401
- ✅ GET /api/{user_id}/tasks with mismatched user_id returns 403
- ✅ Frontend displays task list with all fields (title, description, status)
- ✅ Empty state displays when user has no tasks

**API Contract**:
```bash
curl http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Phase 7: US-W5 - Mark Complete (P3)

**Goal**: Users can toggle task completion status  
**Duration**: 3-4 hours  
**Dependencies**: US-W4 complete  
**Story**: US-W5 from spec.md

### Tasks

- [ ] T059 [P] [US5] Create PATCH /api/{user_id}/tasks/{id}/complete route in backend/src/api/task_routes.py
- [ ] T060 [US5] Wire MarkTaskCompleteUseCase with JWT middleware
- [ ] T061 [US5] Add task ownership validation (user_id match)
- [ ] T062 [P] [US5] Write integration test for complete endpoint in backend/tests/integration/test_task_routes.py
- [ ] T063 [P] [US5] Add toggle button to TaskCard component in frontend/components/tasks/TaskCard.tsx
- [ ] T064 [P] [US5] Create API client method toggleComplete in frontend/lib/api.ts
- [ ] T065 [US5] Add optimistic UI update for task completion status

**Test Criteria**:
- ✅ PATCH /api/{user_id}/tasks/{id}/complete toggles status and returns 200
- ✅ PATCH with missing JWT returns 401
- ✅ PATCH with mismatched user_id returns 403
- ✅ PATCH with non-existent task returns 404
- ✅ Frontend button toggles and updates UI immediately
- ✅ Task status persists after page refresh

**API Contract**:
```bash
curl -X PATCH http://localhost:8000/api/{user_id}/tasks/5/complete \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Phase 8: US-W6 - Update Task (P4)

**Goal**: Users can edit task details  
**Duration**: 4-5 hours  
**Dependencies**: US-W4 complete  
**Story**: US-W6 from spec.md

### Tasks

- [ ] T066 [P] [US6] Create GET /api/{user_id}/tasks/{id} route in backend/src/api/task_routes.py
- [ ] T067 [P] [US6] Create PUT /api/{user_id}/tasks/{id} route in backend/src/api/task_routes.py
- [ ] T068 [US6] Wire UpdateTaskUseCase with JWT middleware
- [ ] T069 [US6] Add task ownership validation and 404 handling
- [ ] T070 [P] [US6] Write integration tests for get/update endpoints in backend/tests/integration/test_task_routes.py
- [ ] T071 [P] [US6] Create task detail page in frontend/app/(dashboard)/tasks/[id]/page.tsx
- [ ] T072 [P] [US6] Create task edit page in frontend/app/(dashboard)/tasks/[id]/edit/page.tsx
- [ ] T073 [P] [US6] Create API client methods getTask and updateTask in frontend/lib/api.ts
- [ ] T074 [US6] Reuse TaskForm component for editing (populate with existing data)
- [ ] T075 [US6] Add form submission handling with success/error feedback

**Test Criteria**:
- ✅ GET /api/{user_id}/tasks/{id} returns task details
- ✅ PUT /api/{user_id}/tasks/{id} updates task and returns 200
- ✅ PUT with empty title returns 400
- ✅ PUT with mismatched user_id returns 403
- ✅ PUT with non-existent task returns 404
- ✅ Frontend edit form populates with existing data
- ✅ Frontend saves changes and shows success message
- ✅ updated_at timestamp changes after edit

**API Contract**:
```bash
curl -X PUT http://localhost:8000/api/{user_id}/tasks/5 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description"}'
```

---

## Phase 9: US-W7 - Delete Task (P5)

**Goal**: Users can permanently remove tasks  
**Duration**: 3-4 hours  
**Dependencies**: US-W4 complete  
**Story**: US-W7 from spec.md

### Tasks

- [ ] T076 [P] [US7] Create DELETE /api/{user_id}/tasks/{id} route in backend/src/api/task_routes.py
- [ ] T077 [US7] Wire DeleteTaskUseCase with JWT middleware
- [ ] T078 [US7] Add task ownership validation
- [ ] T079 [P] [US7] Write integration test for delete endpoint in backend/tests/integration/test_task_routes.py
- [ ] T080 [P] [US7] Create Modal component for confirmation dialogs in frontend/components/ui/Modal.tsx
- [ ] T081 [P] [US7] Add delete button to TaskCard with confirmation modal
- [ ] T082 [US7] Create API client method deleteTask in frontend/lib/api.ts

**Test Criteria**:
- ✅ DELETE /api/{user_id}/tasks/{id} removes task and returns 204
- ✅ DELETE with missing JWT returns 401
- ✅ DELETE with mismatched user_id returns 403
- ✅ DELETE with non-existent task returns 404
- ✅ Frontend shows confirmation dialog before deletion
- ✅ Frontend removes task from list after successful deletion
- ✅ Task does not reappear after page refresh

**API Contract**:
```bash
curl -X DELETE http://localhost:8000/api/{user_id}/tasks/5 \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Phase 10: Polish & Cross-Cutting Concerns

**Goal**: Production-ready polish  
**Duration**: 4-6 hours  
**Dependencies**: All user stories complete

### Tasks

- [ ] T083 Add loading states and skeletons to all pages in frontend/components/ui/LoadingSpinner.tsx
- [ ] T084 Add ARIA labels and keyboard navigation for accessibility (WCAG 2.1 Level AA)
- [ ] T085 Run performance audit with Lighthouse and optimize bundle size (<500KB gzipped)

**Test Criteria**:
- ✅ Backend test coverage ≥80% (pytest --cov)
- ✅ Frontend test coverage ≥70% (npm test -- --coverage)
- ✅ Lighthouse performance score ≥90
- ✅ All WCAG 2.1 Level AA accessibility checks pass
- ✅ API response times <500ms p95
- ✅ Frontend TTI <3s on 4G connection

---

## Dependencies & Execution Order

### Critical Path (Sequential)
```
Setup → Foundational → US-W1 → US-W2 → US-W3 → US-W4 → [Parallel: US-W5, US-W6, US-W7] → Polish
```

### Parallel Opportunities

**After US-W4 complete**, these stories can be implemented in parallel:
- US-W5 (Mark Complete) - Independent
- US-W6 (Update Task) - Independent  
- US-W7 (Delete Task) - Independent

**Within each story**, tasks marked `[P]` can be executed in parallel:
- Backend tests can run while frontend components are built
- Multiple frontend components can be created simultaneously
- API route handlers for different HTTP methods can be implemented in parallel

---

## Testing Strategy

### Unit Tests (Backend)
- Repository implementations (PostgresTaskRepository, PostgresUserRepository)
- Use cases (reused from Phase I)
- Validation functions
- JWT utilities

### Integration Tests (Backend)
- All API endpoints with test database
- Authentication flow (signup → signin)
- Authorization (user isolation)
- Error handling (400, 401, 403, 404, 500)

### Component Tests (Frontend)
- Base UI components (Button, Input, Modal)
- Auth components (AuthForm)
- Task components (TaskCard, TaskList, TaskForm)

### E2E Tests (Frontend)
- Complete user journey: Signup → Login → Create Task → Complete Task → Edit Task → Delete Task
- Error scenarios: Invalid credentials, validation errors, network errors
- Session persistence: Logout → Login → Tasks still visible

---

## File Structure Reference

```
backend/
├── src/
│   ├── api/
│   │   ├── auth_routes.py         # T027, T035
│   │   ├── task_routes.py         # T042, T051, T059, T067, T076
│   │   ├── dependencies.py        # T038
│   │   ├── models/
│   │   │   ├── auth_models.py     # T026, T034
│   │   │   └── task_models.py     # T041
│   │   └── validators.py          # T029
│   ├── application/
│   │   ├── use_cases/             # T015 (copy from Phase I)
│   │   └── dto/                   # T016 (copy from Phase I)
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── task.py            # T011 (copy from Phase I)
│   │   │   └── user.py            # T012
│   │   └── repositories/
│   │       ├── task_repository.py # T013
│   │       └── user_repository.py # T014
│   └── infrastructure/
│       ├── database.py            # T017
│       ├── security.py            # T028
│       ├── jwt.py                 # T036
│       └── repositories/
│           ├── postgres_task_repository.py    # T018
│           └── postgres_user_repository.py    # T019
├── migrations/
│   └── versions/
│       └── 001_initial_schema.sql # T020
├── tests/
│   ├── unit/
│   │   ├── test_postgres_task_repository.py   # T021
│   │   └── test_postgres_user_repository.py   # T022
│   └── integration/
│       ├── test_auth_routes.py    # T031, T039
│       └── test_task_routes.py    # T046, T054, T062, T070, T079
└── main.py                        # T023

frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx         # T040
│   │   └── signup/page.tsx        # T032
│   ├── (dashboard)/
│   │   └── tasks/
│   │       ├── page.tsx           # T057 (list)
│   │       ├── new/page.tsx       # T048 (create)
│   │       ├── [id]/page.tsx      # T071 (detail)
│   │       └── [id]/edit/page.tsx # T072 (edit)
│   └── layout.tsx                 # T025
├── components/
│   ├── ui/
│   │   ├── Modal.tsx              # T080
│   │   └── LoadingSpinner.tsx     # T083
│   ├── auth/
│   │   └── AuthForm.tsx           # T033
│   └── tasks/
│       ├── TaskCard.tsx           # T055, T063, T081
│       ├── TaskList.tsx           # T056
│       └── TaskForm.tsx           # T047, T074
├── lib/
│   └── api.ts                     # T049, T058, T064, T073, T082
└── tailwind.config.js             # T024
```

---

## Success Criteria (Definition of Done)

### Per User Story
- ✅ All acceptance criteria from spec.md verified
- ✅ Backend integration tests pass
- ✅ Frontend component tests pass
- ✅ E2E test for story passes
- ✅ Code reviewed and approved
- ✅ No regression in existing stories

### Overall Phase II
- ✅ All 7 user stories implemented
- ✅ Test coverage ≥80% backend, ≥70% frontend
- ✅ All NFRs met (performance, security, accessibility)
- ✅ API documentation complete (Swagger UI)
- ✅ Deployment documented in quickstart.md
- ✅ Phase III ready (architecture supports AI integration)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Neon database connection issues | High | Test connection early (T009), use connection pooling |
| JWT secret mismatch | High | Use same .env variable (T007, T008), validate early (T038) |
| Better Auth integration complexity | Medium | Follow official docs, implement incrementally (US-W1, US-W2 first) |
| Test database setup | Medium | Use pytest fixtures (conftest.py), seed test data |
| Frontend bundle size | Low | Code splitting, lazy loading, monitor with Lighthouse (T085) |

---

## Notes

- **TDD Workflow**: Write tests first for each task (red → green → refactor)
- **Incremental Commits**: Commit after each completed task
- **Branch Strategy**: One branch for entire Phase II (`002-phase-web-app`)
- **Code Review**: Self-review before marking task complete
- **Documentation**: Update CLAUDE.md files as patterns emerge

---

**Status**: Ready for implementation  
**Next Command**: `/sp.task T001` to start first task  
**Total Estimated Time**: 40-60 hours (5-8 days at 8 hours/day)
