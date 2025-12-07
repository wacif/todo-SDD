# Quick Start Guide: Phase II Development

**Phase**: Phase II - Full-Stack Web Application  
**Date**: 2025-12-07  
**Audience**: Developers implementing Phase II

## Prerequisites

- [x] Phase II specifications complete (`/specs/002-phase-web-app/`)
- [x] Implementation plan reviewed (`plan.md`)
- [x] Research document read (`research.md`)
- [x] Data model understood (`data-model.md`)
- [x] API contracts reviewed (`contracts/openapi.yaml`)

## Development Environment Setup

### 1. Install Dependencies

**Backend Requirements**:
```bash
# Python 3.13+ with UV package manager
python --version  # Should be 3.13+
pip install uv

# Install backend dependencies
cd backend
uv pip install -r requirements.txt
```

**Frontend Requirements**:
```bash
# Node.js 20+ with npm
node --version  # Should be 20+

# Install frontend dependencies
cd frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:pass@neon.tech:5432/todo_db
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Important**: Use the same `BETTER_AUTH_SECRET` in both backend and frontend for JWT validation.

### 3. Setup Database

**Create Neon Project**:
1. Sign up at https://neon.tech
2. Create new project named "todo-app"
3. Copy connection string to `DATABASE_URL` in backend/.env

**Run Migrations**:
```bash
cd backend
alembic upgrade head
```

### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# API available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# App available at http://localhost:3000
```

---

## Implementation Workflow

### Phase 1: Backend Foundation (Days 1-3)

**Day 1: Infrastructure Layer**
1. Setup PostgreSQL connection (`backend/src/infrastructure/database.py`)
2. Implement `PostgresTaskRepository` (`backend/src/infrastructure/repositories/postgres_task_repository.py`)
3. Implement `PostgresUserRepository` (`backend/src/infrastructure/repositories/postgres_user_repository.py`)
4. Write repository unit tests

**Day 2: API Layer - Authentication**
1. Create User entity (`backend/src/domain/entities/user.py`)
2. Implement JWT middleware (`backend/src/api/dependencies.py`)
3. Create auth routes (`backend/src/api/auth_routes.py`)
   - POST /api/auth/signup
   - POST /api/auth/signin
4. Write authentication integration tests

**Day 3: API Layer - Task CRUD**
1. Copy Phase I use cases to `backend/src/application/use_cases/`
2. Modify use cases to use PostgreSQL repository
3. Create task routes (`backend/src/api/task_routes.py`)
   - GET /api/{user_id}/tasks
   - POST /api/{user_id}/tasks
   - GET /api/{user_id}/tasks/{id}
   - PUT /api/{user_id}/tasks/{id}
   - PATCH /api/{user_id}/tasks/{id}/complete
   - DELETE /api/{user_id}/tasks/{id}
4. Write task CRUD integration tests

**Verification**: All backend tests pass (≥80% coverage)

---

### Phase 2: Frontend Foundation (Days 4-6)

**Day 4: Base UI Components**
1. Setup Tailwind CSS configuration
2. Create base UI components (`frontend/components/ui/`)
   - Button (4 variants: primary, secondary, danger, ghost)
   - Input (text, email, password types)
   - Textarea
   - Modal
3. Write component tests (Jest + RTL)

**Day 5: Authentication Pages**
1. Setup Better Auth configuration (`frontend/lib/auth.ts`)
2. Create API client with JWT injection (`frontend/lib/api.ts`)
3. Implement auth pages:
   - `/app/(auth)/login/page.tsx`
   - `/app/(auth)/signup/page.tsx`
4. Create route protection middleware (`frontend/middleware.ts`)
5. Test authentication flow

**Day 6: Task Management Pages**
1. Create task components (`frontend/components/tasks/`)
   - TaskCard
   - TaskList
   - TaskForm
2. Implement task pages:
   - `/app/(dashboard)/tasks/page.tsx` (list)
   - `/app/(dashboard)/tasks/new/page.tsx` (create)
   - `/app/(dashboard)/tasks/[id]/page.tsx` (detail)
   - `/app/(dashboard)/tasks/[id]/edit/page.tsx` (edit)
3. Wire up API calls to backend
4. Test task CRUD operations

**Verification**: All frontend component tests pass

---

### Phase 3: Integration & Testing (Days 7-8)

**Day 7: End-to-End Testing**
1. Setup Playwright (`frontend/tests/e2e/`)
2. Write E2E test scenarios:
   - User signup → login → create task → mark complete → delete
   - Form validation (empty title, long description)
   - Authentication errors (wrong password, expired token)
3. Run full test suite (backend + frontend + E2E)

**Day 8: Polish & Documentation**
1. Add loading states and error messages
2. Implement accessibility features (ARIA labels, keyboard navigation)
3. Write API documentation (Swagger UI enhancements)
4. Update README with deployment instructions
5. Performance testing (verify <500ms API, <3s TTI)

**Verification**: All tests green, performance targets met

---

## Testing Commands

### Backend Tests
```bash
cd backend

# Run all tests
pytest tests/

# Run with coverage
pytest --cov=src --cov-report=html tests/

# Run specific test file
pytest tests/unit/test_add_task.py

# Run integration tests only
pytest tests/integration/
```

### Frontend Tests
```bash
cd frontend

# Run component tests
npm test

# Run component tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

---

## Common Tasks

### Add New Endpoint

1. **Define in OpenAPI** (`contracts/openapi.yaml`)
2. **Create route handler** (`backend/src/api/task_routes.py`)
3. **Write integration test** (`backend/tests/integration/test_task_routes.py`)
4. **Add API client method** (`frontend/lib/api.ts`)
5. **Use in component** (`frontend/components/tasks/*.tsx`)

### Add New UI Component

1. **Define props** (`frontend/components/ui/ComponentName.tsx`)
2. **Implement variants** (primary, secondary, etc.)
3. **Write tests** (`frontend/tests/components/ComponentName.test.tsx`)
4. **Document in Storybook** (future enhancement)

### Debug JWT Issues

```bash
# Decode JWT token (backend)
python -c "import jwt; print(jwt.decode('YOUR_TOKEN', 'SECRET', algorithms=['HS256']))"

# Check token expiry
date -d @1234567890  # Unix timestamp from token

# Verify BETTER_AUTH_SECRET matches in both .env files
grep BETTER_AUTH_SECRET backend/.env frontend/.env.local
```

---

## Architecture Reference

### Clean Architecture Layers

```
Request → API Layer → Application Layer → Domain Layer
              ↓              ↓                ↓
       FastAPI Routes   Use Cases      Entities
              ↓              ↓                ↓
       JWT Middleware   Orchestration  Protocols
              ↓
    Infrastructure Layer
              ↓
       PostgreSQL
```

### Data Flow Example (Create Task)

```
User submits form → Frontend validation → API client
    ↓
POST /api/{user_id}/tasks with JWT token
    ↓
Backend JWT middleware verifies token → Extracts user_id
    ↓
Route handler validates request body (Pydantic)
    ↓
AddTaskUseCase.execute(user_id, title, description)
    ↓
PostgresTaskRepository.add(task)
    ↓
Database INSERT → Return Task entity
    ↓
Convert to TaskDTO → Return JSON response
    ↓
Frontend receives TaskDTO → Update UI state
```

---

## Troubleshooting

### Backend Won't Start
- Check `DATABASE_URL` is valid Neon connection string
- Verify Python 3.13+ is installed
- Run `uv pip install -r requirements.txt` again
- Check port 8000 is not already in use

### Frontend Won't Start
- Check Node.js 20+ is installed
- Delete `node_modules` and `.next`, then `npm install` again
- Verify `NEXT_PUBLIC_API_URL` points to backend
- Check port 3000 is not already in use

### Authentication Not Working
- Verify `BETTER_AUTH_SECRET` is identical in both .env files
- Check JWT token is being sent in Authorization header
- Inspect browser cookies (should see auth token)
- Check backend logs for JWT verification errors

### Database Connection Errors
- Verify Neon project is active (not paused)
- Check IP allowlist in Neon dashboard
- Test connection string with `psql` command
- Ensure migrations ran successfully

---

## Next Steps

After completing implementation:

1. **Run full test suite**: `pytest && npm test && npm run test:e2e`
2. **Check coverage**: Backend ≥80%, Frontend ≥70%
3. **Generate documentation**: OpenAPI docs at `/docs`
4. **Create PHR**: Document implementation with `/sp.phr`
5. **Commit**: `git commit -m "feat: complete Phase II implementation"`
6. **Deploy**: Follow deployment guide in `docs/deployment.md` (future)

---

## Resources

**Documentation**:
- [spec.md](./spec.md) - User stories and acceptance criteria
- [architecture.md](./architecture.md) - System design
- [database/schema.md](./database/schema.md) - Database schema
- [api/rest-endpoints.md](./api/rest-endpoints.md) - API documentation

**External Resources**:
- FastAPI: https://fastapi.tiangolo.com/
- Next.js App Router: https://nextjs.org/docs/app
- SQLModel: https://sqlmodel.tiangolo.com/
- Better Auth: https://better-auth.com/docs
- Neon: https://neon.tech/docs

**Constitutional Guidelines**:
- [.specify/memory/constitution.md](../../.specify/memory/constitution.md) - Project principles

---

**Status**: Ready for implementation. Follow TDD workflow strictly (write tests first, then implement to make them pass).
