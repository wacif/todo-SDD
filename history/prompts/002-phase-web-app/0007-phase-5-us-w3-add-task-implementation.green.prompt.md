---
id: 0007
title: Phase 5 US-W3 Add Task implementation
stage: green
date: 2025-12-09T00:00:00Z
surface: vscode
model: Claude Sonnet 4.5
feature: 002-phase-web-app
branch: 002-phase-web-app
user: wasi
command: /sp.implement
labels: ["task-creation", "crud", "jwt", "backend", "frontend", "validation"]
links:
  spec: specs/002-phase-web-app/spec.md
  ticket: T041-T050
  adr: null
  pr: null
files:
  - path: backend/src/api/models/task_models.py
    purpose: Pydantic models for task API (TaskInputDTO, TaskResponse, TaskListResponse)
    lines: 78
  - path: backend/src/api/routes/task_routes.py
    purpose: REST endpoints for task CRUD (POST /api/{user_id}/tasks, GET /api/{user_id}/tasks)
    lines: 150
  - path: backend/src/api/main.py
    purpose: Register task router in FastAPI app
    lines: 2
  - path: backend/tests/integration/test_task_routes.py
    purpose: Integration tests for task routes (11 tests, all passing)
    lines: 253
  - path: backend/src/domain/entities/task.py
    purpose: Fixed Task entity to allow optional description (str | None)
    lines: 2
  - path: backend/src/application/dto/task_input_dto.py
    purpose: Fixed TaskInputDTO to use Optional[str] = None for description
    lines: 1
  - path: frontend/lib/api.ts
    purpose: API client with createTask, listTasks, and other task operations
    lines: 254
  - path: frontend/components/tasks/TaskForm.tsx
    purpose: Reusable form component for creating/editing tasks
    lines: 160
  - path: frontend/app/(dashboard)/tasks/new/page.tsx
    purpose: Task creation page with authentication and error handling
    lines: 115
  - path: .gitignore
    purpose: Fixed to allow frontend/lib/ directory (removed lib/ from ignore list)
    lines: 1
tests:
  - name: test_create_task_success
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_create_task_without_jwt
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_create_task_mismatched_user_id
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_create_task_empty_title
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_create_task_title_too_long
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_create_task_description_too_long
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_list_tasks_empty
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_list_tasks_with_data
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_list_tasks_without_jwt
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_list_tasks_mismatched_user_id
    status: PASS
    file: backend/tests/integration/test_task_routes.py
  - name: test_user_isolation
    status: PASS
    file: backend/tests/integration/test_task_routes.py
---

## Prompt

User invoked `/sp.implement` command to continue Phase II implementation following spec-driven approach.

Command context:
- Feature: 002-phase-web-app
- Tasks remaining: Phase 5 US-W3 Add Task (T041-T050)
- Previous work: Phases 1-4 complete (T001-T040): Setup, Foundational, US-W1 Registration, US-W2 Login

Implementation plan for Phase 5 US-W3:
- Backend: TaskInputDTO model, POST /api/{user_id}/tasks route, JWT middleware, user ownership validation, title/description validation, integration tests
- Frontend: TaskForm component, task creation page, API client createTask method, wire to API with error handling

## Response snapshot

**Phase 5 US-W3 Add Task Implementation Complete**

Implemented backend task creation API with 11/11 integration tests passing:

**Backend (T041-T046):**
- Created `TaskInputDTO` Pydantic model with validation (title 1-200 chars, description 0-1000 chars optional)
- Created `POST /api/{user_id}/tasks` endpoint with JWT authentication
- Wired `AddTaskUseCase` with user_id ownership validation (403 if mismatch)
- Added title/description validation in Task entity, fixed to allow `description: str | None`
- Fixed `TaskInputDTO` to use `Optional[str] = None` for description (was defaulting to "")
- Created 11 integration tests covering success, auth errors, validation errors, user isolation

**Bug Fix:**
- Task entity was rejecting `None` for description with `isinstance(self.description, str)` check
- Fixed by changing type to `str | None` and conditional validation: `if self.description is not None:`
- Also updated TaskInputDTO default from `""` to `None`

**Frontend (T047-T050):**
- Created API client (`frontend/lib/api.ts`) with `createTask()`, `listTasks()`, error handling, JWT injection
- Created reusable `TaskForm` component with client-side validation, character counters, loading states
- Created task creation page (`/tasks/new`) with auth check, error handling, success redirect to `/tasks`

**Infrastructure:**
- Fixed `.gitignore` to allow `frontend/lib/` directory (was ignored by global `lib/` pattern)

**Test Results:**
- 11/11 integration tests passing
- Coverage: 74% overall (87% for task routes)
- All test cases: success, 401 (no JWT), 403 (mismatched user), 422 (validation), user isolation

## Outcome

- ✅ Impact: Users can create tasks via web form with full validation and JWT authentication. Backend enforces user ownership (403 if user_id mismatch). Task entity now correctly handles optional descriptions.
- 🧪 Tests: 11/11 passing (test_create_task_success, test_create_task_without_jwt, test_create_task_mismatched_user_id, test_create_task_empty_title, test_create_task_title_too_long, test_create_task_description_too_long, test_list_tasks_empty, test_list_tasks_with_data, test_list_tasks_without_jwt, test_list_tasks_mismatched_user_id, test_user_isolation)
- 📁 Files: 10 files created/modified (4 backend, 3 frontend, 1 test, 1 entity fix, 1 gitignore fix)
- 🔁 Next prompts: Phase 6 US-W4 View Tasks (T051-T058) - task list page, TaskCard/TaskList components, GET endpoint
- 🧠 Reflection: The Task entity description field issue revealed a gap between domain entity validation and API contracts. Using `Optional[str] = None` consistently across DTOs and entities prevents this class of bugs.

## Evaluation notes (flywheel)

- Failure modes observed: 
  1. Test failure (test_user_isolation) due to Task entity rejecting None for description
  2. HTTP status code mismatches (expected 403, got 401 for missing JWT - HTTPBearer returns 401, not 403)
  3. .gitignore blocking frontend/lib/ directory (global lib/ pattern too broad)
- Graders run and results (PASS/FAIL): All 11 integration tests PASS after fixing Task entity and test expectations
- Prompt variant (if applicable): Standard /sp.implement workflow - no variant
- Next experiment (smallest change to try): Consider using Pydantic models for domain entities instead of dataclasses to unify validation logic (avoid duplicate validation between DTO and entity)
