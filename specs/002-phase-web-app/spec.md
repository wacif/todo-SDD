# Feature Specification: Phase II - Full-Stack Web Application

**Feature Branch**: `002-phase-web-app`  
**Created**: 2025-12-07  
**Status**: In Progress  
**Parent Phase**: Phase I - Basic Todo Management (Console App)

## Executive Summary

Transform the console-based todo application into a modern, multi-user web application with:
- Persistent storage in Neon PostgreSQL
- RESTful API backend (FastAPI)
- Responsive web frontend (Next.js 16+)
- User authentication (Better Auth + JWT)
- Secure, isolated data per user

All 5 core features from Phase I (Add, View, Update, Delete, Mark Complete) are reimplemented as web features with authentication and database persistence.

## User Personas

### Primary Persona: Sarah - Productive Professional
- **Age**: 28-45
- **Tech Savvy**: Medium to High
- **Goals**: Track personal and work tasks efficiently
- **Pain Points**: Needs access from multiple devices, wants data to persist
- **Expectations**: Fast, intuitive interface; secure authentication; reliable data storage

### Secondary Persona: Team Lead - Mike
- **Age**: 30-50
- **Tech Savvy**: High
- **Goals**: Manage team tasks, track progress
- **Pain Points**: Needs multi-user support, API access for integrations
- **Expectations**: RESTful API, role-based access (future), extensibility

## User Stories & Acceptance Criteria

---

### US-W1: User Registration (Priority: P0 - Prerequisite)

**As a** new user  
**I want to** create an account with email and password  
**So that** I can access my personal todo list securely

**Why this priority**: Must exist before any task operations. Without authentication, cannot implement multi-user isolation.

**Acceptance Criteria**:

1. **Given** I am on the signup page  
   **When** I provide email "sarah@example.com", name "Sarah", and password "SecurePass123!"  
   **Then** my account is created and I'm redirected to the login page

2. **Given** I try to register  
   **When** I provide an email that's already registered  
   **Then** I see error "Email already exists"

3. **Given** I try to register  
   **When** I provide a password shorter than 8 characters  
   **Then** I see error "Password must be at least 8 characters"

4. **Given** I successfully register  
   **When** I check the database  
   **Then** my password is hashed (not stored in plain text)

**Technical Requirements**:
- Email validation (RFC 5322)
- Password strength: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
- Password hashing with bcrypt
- Unique email constraint in database

---

### US-W2: User Login (Priority: P0 - Prerequisite)

**As a** registered user  
**I want to** log in with my email and password  
**So that** I can access my tasks

**Why this priority**: Required for all subsequent operations. No task operations possible without authentication.

**Acceptance Criteria**:

1. **Given** I am registered with email "sarah@example.com"  
   **When** I log in with correct email and password  
   **Then** I receive a JWT token and am redirected to the tasks page

2. **Given** I am on the login page  
   **When** I provide incorrect credentials  
   **Then** I see error "Invalid email or password"

3. **Given** I successfully log in  
   **When** I inspect the token  
   **Then** it contains my user ID, email, and expiry timestamp

4. **Given** I am logged in  
   **When** I close the browser and return within token expiry period  
   **Then** I remain logged in (session persisted)

**Technical Requirements**:
- JWT token with 7-day expiry
- Token includes: user_id, email, issued_at, expires_at
- Secure HTTP-only cookies for token storage
- Better Auth session management

---

### US-W3: Add Task (Web) (Priority: P1 - MVP)

**As a** logged-in user  
**I want to** create new tasks via a web form  
**So that** I can track things I need to do

**Why this priority**: Core functionality - MVP cannot exist without ability to add tasks.

**Acceptance Criteria**:

1. **Given** I am logged in as Sarah  
   **When** I submit form with title "Buy groceries" and description "Milk, eggs, bread"  
   **Then** task is created with my user_id and I see success message

2. **Given** I create a task  
   **When** I check the tasks list  
   **Then** the new task appears at the top with "incomplete" status

3. **Given** I try to create a task  
   **When** I submit without a title  
   **Then** I see error "Title is required" and form doesn't submit

4. **Given** I create a task  
   **When** I log out and log back in  
   **Then** my task is still there (persisted to database)

5. **Given** I create a task  
   **When** another user logs in  
   **Then** they do NOT see my task (data isolation)

**Technical Requirements**:
- Frontend: Task form with title (required), description (optional)
- Backend: POST /api/{user_id}/tasks endpoint
- Database: Insert into tasks table with user_id foreign key
- Validation: Title 1-200 chars, description 0-1000 chars
- Authorization: JWT token required, user_id in URL must match token user_id

**API Request**:
```json
POST /api/{user_id}/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**API Response** (201 Created):
```json
{
  "id": 1,
  "user_id": "uuid-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-07T10:30:00Z",
  "updated_at": "2025-12-07T10:30:00Z"
}
```

---

### US-W4: View Task List (Web) (Priority: P2)

**As a** logged-in user  
**I want to** see all my tasks in a web interface  
**So that** I can review what I need to do

**Why this priority**: After adding tasks, viewing them is essential. Validates tasks were created correctly.

**Acceptance Criteria**:

1. **Given** I am logged in and have 5 tasks (3 incomplete, 2 complete)  
   **When** I load the tasks page  
   **Then** all 5 tasks are displayed with title, description, status, and action buttons

2. **Given** I have no tasks  
   **When** I load the tasks page  
   **Then** I see message "No tasks yet. Create your first task!"

3. **Given** I have tasks  
   **When** I view the list  
   **Then** tasks are ordered by creation date (newest first)

4. **Given** I am logged in as Sarah  
   **When** Mike creates a task  
   **Then** I do NOT see Mike's task in my list (data isolation)

5. **Given** I have 50 tasks  
   **When** I load the page  
   **Then** page loads in under 2 seconds (performance requirement)

**Technical Requirements**:
- Frontend: Task list component with TaskCard sub-components
- Backend: GET /api/{user_id}/tasks endpoint
- Database: Query tasks WHERE user_id = {authenticated_user_id}
- Sort: ORDER BY created_at DESC
- Authorization: JWT token required

**API Request**:
```json
GET /api/{user_id}/tasks
Authorization: Bearer <jwt_token>
```

**API Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 5,
      "user_id": "uuid-123",
      "title": "Latest task",
      "description": "...",
      "completed": false,
      "created_at": "2025-12-07T15:00:00Z",
      "updated_at": "2025-12-07T15:00:00Z"
    },
    {
      "id": 1,
      "user_id": "uuid-123",
      "title": "Oldest task",
      "description": "...",
      "completed": true,
      "created_at": "2025-12-06T10:00:00Z",
      "updated_at": "2025-12-07T12:00:00Z"
    }
  ],
  "total": 5
}
```

---

### US-W5: Mark Task Complete (Web) (Priority: P3)

**As a** logged-in user  
**I want to** toggle task completion status with a button click  
**So that** I can track my progress

**Why this priority**: Core todo feature - distinguishes between pending and done tasks.

**Acceptance Criteria**:

1. **Given** I have an incomplete task  
   **When** I click the "Mark Complete" button  
   **Then** task status changes to complete and button changes to "Mark Incomplete"

2. **Given** I have a complete task  
   **When** I click the "Mark Incomplete" button  
   **Then** task status changes back to incomplete

3. **Given** I toggle a task status  
   **When** I refresh the page  
   **Then** the status remains as I set it (persisted)

4. **Given** I try to mark another user's task complete  
   **When** I send API request with their task ID  
   **Then** I receive 403 Forbidden error

**Technical Requirements**:
- Frontend: Toggle button with visual state change
- Backend: PATCH /api/{user_id}/tasks/{id}/complete endpoint
- Database: UPDATE tasks SET completed = NOT completed WHERE id = {id} AND user_id = {user_id}
- Authorization: JWT token required, verify task belongs to user

**API Request**:
```json
PATCH /api/{user_id}/tasks/5/complete
Authorization: Bearer <jwt_token>
```

**API Response** (200 OK):
```json
{
  "id": 5,
  "user_id": "uuid-123",
  "title": "Buy groceries",
  "description": "...",
  "completed": true,
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T15:30:00Z"
}
```

---

### US-W6: Update Task (Web) (Priority: P4)

**As a** logged-in user  
**I want to** edit task title and description via a form  
**So that** I can correct mistakes or update details

**Why this priority**: Important for task maintenance, but app is usable without it.

**Acceptance Criteria**:

1. **Given** I have a task with title "Buy grocieries" (typo)  
   **When** I edit it to "Buy groceries" and save  
   **Then** the task title updates and I see success message

2. **Given** I edit a task  
   **When** I change only the description  
   **Then** the title remains unchanged and description updates

3. **Given** I try to update a task  
   **When** I clear the title field  
   **Then** I see error "Title is required" and changes are not saved

4. **Given** I try to update another user's task  
   **When** I send API request with their task ID  
   **Then** I receive 403 Forbidden error

5. **Given** I update a task  
   **When** I check the updated_at timestamp  
   **Then** it reflects the time of the update

**Technical Requirements**:
- Frontend: Edit form modal or inline editing
- Backend: PUT /api/{user_id}/tasks/{id} endpoint
- Database: UPDATE tasks SET title = ?, description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?
- Validation: Same as create (title 1-200 chars, description 0-1000 chars)
- Authorization: JWT token required, verify task belongs to user

**API Request**:
```json
PUT /api/{user_id}/tasks/5
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, cheese"
}
```

**API Response** (200 OK):
```json
{
  "id": 5,
  "user_id": "uuid-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, cheese",
  "completed": false,
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T16:00:00Z"
}
```

---

### US-W7: Delete Task (Web) (Priority: P5)

**As a** logged-in user  
**I want to** permanently delete tasks with a confirmation dialog  
**So that** I can remove tasks I no longer need

**Why this priority**: Useful but not critical - users can live without deletion.

**Acceptance Criteria**:

1. **Given** I have a task  
   **When** I click delete button and confirm in the dialog  
   **Then** the task is permanently removed from my list

2. **Given** I click delete  
   **When** I cancel the confirmation dialog  
   **Then** the task is NOT deleted

3. **Given** I delete a task  
   **When** I refresh the page  
   **Then** the deleted task does not reappear (permanent deletion)

4. **Given** I try to delete another user's task  
   **When** I send API request with their task ID  
   **Then** I receive 403 Forbidden error

5. **Given** I try to delete a non-existent task  
   **When** I send API request with invalid task ID  
   **Then** I receive 404 Not Found error

**Technical Requirements**:
- Frontend: Delete button with confirmation dialog
- Backend: DELETE /api/{user_id}/tasks/{id} endpoint
- Database: DELETE FROM tasks WHERE id = ? AND user_id = ?
- Authorization: JWT token required, verify task belongs to user

**API Request**:
```json
DELETE /api/{user_id}/tasks/5
Authorization: Bearer <jwt_token>
```

**API Response** (204 No Content):
```json
(empty response body)
```

---

## Non-Functional Requirements

### NFR-W1: Performance
- Page load time: < 2 seconds
- API response time: < 500ms for 95th percentile
- Database queries: < 100ms average
- Frontend bundle size: < 500KB gzipped

### NFR-W2: Security
- All passwords hashed with bcrypt (cost factor 12)
- JWT tokens signed with HS256 algorithm
- HTTPS required in production
- CORS configured for frontend domain only
- SQL injection prevention via SQLModel parameterized queries
- XSS prevention via React's automatic escaping

### NFR-W3: Scalability
- Support 1000+ concurrent users
- Neon PostgreSQL auto-scaling
- Stateless backend (horizontal scaling ready)
- CDN for static assets

### NFR-W4: Reliability
- 99.9% uptime target
- Database backups every 24 hours
- Error logging and monitoring
- Graceful error handling (no stack traces to users)

### NFR-W5: Usability
- Responsive design (mobile, tablet, desktop)
- Accessible (WCAG 2.1 Level AA)
- Clear error messages
- Loading states for all async operations

### NFR-W6: Maintainability
- Clean Architecture (frontend + backend)
- Test coverage ≥ 80%
- TypeScript for frontend (type safety)
- SQLModel for backend (type safety)
- API documentation (OpenAPI/Swagger)

### NFR-W7: Compatibility
- Frontend: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Backend: Python 3.13+
- Database: PostgreSQL 15+
- Node.js 20+ (for Next.js)

---

## Technical Constraints

1. **Monorepo Structure**: Frontend and backend in single repository
2. **Authentication**: Must use Better Auth (not auth0, clerk, etc.)
3. **Database**: Must use Neon Serverless PostgreSQL (not RDS, MongoDB, etc.)
4. **ORM**: Must use SQLModel (not Prisma, TypeORM, raw SQL)
5. **JWT Shared Secret**: Same key for frontend and backend
6. **No Sessions Database**: Stateless authentication only

---

## Data Validation Rules

### Task Fields
| Field | Required | Min Length | Max Length | Type | Validation |
|-------|----------|------------|------------|------|------------|
| title | Yes | 1 | 200 | string | Non-empty, trimmed |
| description | No | 0 | 1000 | string | Trimmed |
| completed | Auto | - | - | boolean | Default false |

### User Fields
| Field | Required | Min Length | Max Length | Type | Validation |
|-------|----------|------------|------------|------|------------|
| email | Yes | 5 | 255 | string | Valid email format |
| name | Yes | 2 | 100 | string | Non-empty, trimmed |
| password | Yes | 8 | 128 | string | At least 1 upper, 1 lower, 1 digit |

---

## Error Handling

### Frontend Errors
- Display user-friendly messages in UI
- Toast notifications for success/error
- Form validation with inline error messages
- Loading states during API calls

### Backend Errors
| Status Code | Scenario | Response |
|-------------|----------|----------|
| 400 Bad Request | Invalid input data | `{"error": "Title is required"}` |
| 401 Unauthorized | Missing/invalid JWT | `{"error": "Authentication required"}` |
| 403 Forbidden | Accessing other user's data | `{"error": "Access denied"}` |
| 404 Not Found | Task doesn't exist | `{"error": "Task not found"}` |
| 409 Conflict | Email already exists | `{"error": "Email already registered"}` |
| 500 Internal Server Error | Unexpected errors | `{"error": "Internal server error"}` |

---

## Dependencies

### Frontend
```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "better-auth": "^1.0.0",
  "tailwindcss": "^3.4.0",
  "axios": "^1.6.0"
}
```

### Backend
```python
{
  "fastapi": "^0.110.0",
  "sqlmodel": "^0.0.14",
  "psycopg2-binary": "^2.9.9",
  "pyjwt": "^2.8.0",
  "bcrypt": "^4.1.2",
  "python-dotenv": "^1.0.0"
}
```

---

## Testing Strategy

### Backend Tests
- **Unit Tests**: Use cases, models, utilities (pytest)
- **Integration Tests**: API endpoints with test database
- **Test Coverage**: ≥ 80%

### Frontend Tests
- **Component Tests**: React components (Jest + React Testing Library)
- **Integration Tests**: API client interactions
- **E2E Tests**: User flows (Playwright)

### Test Scenarios
1. User registration and login flow
2. Create task and verify it appears in list
3. Update task and verify changes persist
4. Mark task complete and verify status change
5. Delete task and verify it's removed
6. Attempt to access another user's task (should fail)
7. Attempt API calls without JWT token (should fail)

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | ≥80% | Pytest-cov, Jest coverage |
| API Response Time | <500ms p95 | Logging, monitoring |
| Page Load Time | <2s | Lighthouse, WebPageTest |
| User Registration | 100% success | Integration tests |
| Task CRUD Operations | 100% functional | E2E tests |
| Multi-User Isolation | 100% enforced | Security tests |

---

## Migration from Phase I

### Preserved
- ✅ Domain models (Task entity structure)
- ✅ Use case logic (business rules)
- ✅ Validation rules (title/description constraints)
- ✅ Test-driven development workflow

### Changed
- ❌ Storage: In-Memory → PostgreSQL
- ❌ Interface: Console CLI → Web UI
- ❌ Users: Single → Multi-user with auth
- ❌ API: None → RESTful HTTP API
- ❌ State: Transient → Persistent

### Extended
- ➕ User authentication and authorization
- ➕ JWT token management
- ➕ Database migrations
- ➕ API documentation
- ➕ Frontend components and pages

---

## Phase III Preview

After Phase II is complete, Phase III will add:
- AI chatbot interface for natural language task management
- MCP (Model Context Protocol) tool integration
- Voice commands for task operations
- Smart task suggestions and prioritization
- Integration with external calendars/tools

---

## References

- Phase I Spec: `specs/001-phase-basic-todo/spec.md`
- Phase I Implementation: Complete (108 tests, 100% coverage)
- Better Auth Docs: https://better-auth.com
- FastAPI Docs: https://fastapi.tiangolo.com
- Next.js Docs: https://nextjs.org/docs
- SQLModel Docs: https://sqlmodel.tiangolo.com
- Neon Docs: https://neon.tech/docs

---

**Status**: ✅ Specification Complete  
**Next Step**: Create architecture design document  
**Approved By**: (Pending review)  
**Last Updated**: 2025-12-07
