# Feature: Task CRUD Operations (Web)

**Feature ID**: task-crud-web  
**Priority**: P1 (MVP)  
**Phase**: Phase II - Full-Stack Web Application  
**Created**: 2025-12-07

## Overview

This feature implements Create, Read, Update, Delete operations for tasks in the web interface. It extends Phase I console functionality to a multi-user web application with persistent storage.

## User Value

Users can manage their todo tasks through a modern web interface accessible from any device, with data persisting across sessions and devices.

## User Stories

### US-W3: Create Task
As a logged-in user, I want to create new tasks via a web form so that I can track things I need to do.

**Acceptance Criteria**:
- User can access create form via "+ New Task" button
- Form includes title (required) and description (optional) fields
- Character counters show remaining characters
- Submit creates task and shows success message
- New task appears in task list immediately
- Task persists after page reload

### US-W4: View Tasks  
As a logged-in user, I want to see all my tasks in a web interface so that I can review what I need to do.

**Acceptance Criteria**:
- Tasks displayed as cards in a list/grid
- Each card shows title, description, status, created date
- Tasks ordered by creation date (newest first)
- Empty state shown when no tasks exist
- Only user's own tasks are visible (data isolation)
- Filter by status (all/pending/completed)

### US-W5: Mark Complete
As a logged-in user, I want to toggle task completion status with a button click so that I can track my progress.

**Acceptance Criteria**:
- Checkbox on each task card toggles completion
- Visual indicator for completed tasks (strikethrough, muted colors)
- Status persists across page reloads
- Instant UI feedback (optimistic updates)

### US-W6: Update Task
As a logged-in user, I want to edit task title and description via a form so that I can correct mistakes or update details.

**Acceptance Criteria**:
- Edit button opens pre-filled form
- Form validation same as create
- Save updates task and shows success message
- Cancel returns to previous view without changes
- Updated timestamp reflects modification time

### US-W7: Delete Task
As a logged-in user, I want to permanently delete tasks with a confirmation dialog so that I can remove tasks I no longer need.

**Acceptance Criteria**:
- Delete button shows confirmation dialog
- Cancel preserves task
- Confirm permanently removes task
- Task disappears from list immediately
- Deletion persists (cannot be undone)

## Technical Requirements

### Frontend (Next.js)

**Pages**:
- `/tasks` - Task list page
- `/tasks/new` - Create task page
- `/tasks/[id]` - Task detail page
- `/tasks/[id]/edit` - Edit task page

**Components**:
- `TaskCard` - Display task with actions
- `TaskForm` - Create/edit form
- `TaskList` - Container for task cards
- `EmptyState` - No tasks message

**State Management**:
- React hooks for local state
- Server actions for mutations
- Optimistic updates for better UX

### Backend (FastAPI)

**Endpoints**:
- `GET /api/{user_id}/tasks` - List all user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get task details
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion
- `DELETE /api/{user_id}/tasks/{id}` - Delete task

**Use Cases** (from Phase I, adapted):
- `AddTaskUseCase` - Validate and create task
- `ListTasksUseCase` - Fetch user's tasks
- `GetTaskUseCase` - Fetch single task
- `UpdateTaskUseCase` - Validate and update task
- `MarkCompleteUseCase` - Toggle completion status
- `DeleteTaskUseCase` - Remove task permanently

**Repository**:
- `PostgresTaskRepository` - Database operations using SQLModel

### Database (PostgreSQL)

**Table**: `tasks`
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

**Indexes**:
- `idx_tasks_user_id` - Filter by user
- `idx_tasks_created_at` - Order by created date
- `idx_tasks_user_created` - Composite index (user + date)

## Data Flow

### Create Task Flow
```
User fills form
  ↓
Frontend validates input
  ↓
POST /api/{user_id}/tasks + JWT token
  ↓
Backend middleware verifies JWT
  ↓
Backend validates authorization (user_id matches token)
  ↓
AddTaskUseCase validates business rules
  ↓
Repository INSERT INTO tasks
  ↓
Database returns new task with ID
  ↓
Backend returns 201 Created + task JSON
  ↓
Frontend updates UI, shows success
```

### List Tasks Flow
```
User navigates to /tasks
  ↓
GET /api/{user_id}/tasks + JWT token
  ↓
Backend middleware verifies JWT
  ↓
Backend validates authorization
  ↓
ListTasksUseCase calls repository
  ↓
Repository SELECT * FROM tasks WHERE user_id = ?
  ↓
Database returns task array
  ↓
Backend returns 200 OK + tasks JSON
  ↓
Frontend renders TaskCard for each task
```

### Update Task Flow
```
User clicks Edit button
  ↓
Navigate to /tasks/[id]/edit
  ↓
Form pre-filled with task data
  ↓
User modifies and submits
  ↓
PUT /api/{user_id}/tasks/{id} + JWT token
  ↓
Backend verifies JWT and authorization
  ↓
UpdateTaskUseCase validates changes
  ↓
Repository UPDATE tasks SET ... WHERE id = ? AND user_id = ?
  ↓
Database returns updated task
  ↓
Backend returns 200 OK + task JSON
  ↓
Frontend redirects to /tasks, shows success
```

### Delete Task Flow
```
User clicks Delete button
  ↓
Confirmation dialog appears
  ↓
User confirms
  ↓
DELETE /api/{user_id}/tasks/{id} + JWT token
  ↓
Backend verifies JWT and authorization
  ↓
DeleteTaskUseCase calls repository
  ↓
Repository DELETE FROM tasks WHERE id = ? AND user_id = ?
  ↓
Database confirms deletion
  ↓
Backend returns 204 No Content
  ↓
Frontend removes task from UI, shows success
```

## Validation Rules

### Title
- Required: Yes
- Min length: 1 character
- Max length: 200 characters
- Trimmed: Yes (whitespace removed from ends)

### Description
- Required: No
- Min length: 0 characters
- Max length: 1000 characters
- Trimmed: Yes

### Completed
- Required: Auto-set
- Default: false
- Type: Boolean

## Error Handling

### Frontend Errors
| Scenario | Error Message | UI Action |
|----------|---------------|-----------|
| Empty title | "Title is required" | Show inline error |
| Title too long | "Title cannot exceed 200 characters" | Show character counter in red |
| Description too long | "Description cannot exceed 1000 characters" | Show character counter in red |
| Network error | "Connection failed. Please try again" | Show toast notification |
| Server error | "An error occurred. Please try again" | Show error message with retry |

### Backend Errors
| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Validation error | `{"error": "Validation error", "message": "Title is required"}` |
| 401 | Missing JWT | `{"error": "Authentication required"}` |
| 403 | Wrong user | `{"error": "Access denied", "message": "You can only modify your own tasks"}` |
| 404 | Task not found | `{"error": "Task not found"}` |
| 500 | Server error | `{"error": "Internal server error"}` |

## Testing Strategy

### Backend Tests (pytest)

**Unit Tests** - Use cases:
```python
def test_add_task_success():
    # Given valid task data
    # When AddTaskUseCase is called
    # Then task is created with correct data

def test_add_task_empty_title():
    # Given empty title
    # When AddTaskUseCase is called
    # Then ValidationError is raised

def test_list_tasks_filters_by_user():
    # Given tasks for multiple users
    # When ListTasksUseCase is called with user_id
    # Then only that user's tasks are returned
```

**Integration Tests** - API endpoints:
```python
def test_create_task_endpoint(client, auth_token):
    # Given authenticated request with task data
    # When POST /api/{user_id}/tasks
    # Then 201 Created with task JSON

def test_create_task_unauthorized(client):
    # Given request without JWT token
    # When POST /api/{user_id}/tasks
    # Then 401 Unauthorized

def test_create_task_wrong_user(client, auth_token):
    # Given request with JWT for user A
    # When POST /api/{user_b_id}/tasks
    # Then 403 Forbidden
```

### Frontend Tests (Jest + React Testing Library)

**Component Tests**:
```typescript
describe('TaskCard', () => {
  it('renders task data correctly', () => {
    // Given a task object
    // When TaskCard is rendered
    // Then title, description, status are displayed
  })
  
  it('calls onComplete when checkbox clicked', () => {
    // Given TaskCard with onComplete handler
    // When checkbox is clicked
    // Then onComplete is called with task ID
  })
})

describe('TaskForm', () => {
  it('shows error when title is empty', () => {
    // Given empty title
    // When form is submitted
    // Then error message is displayed
  })
  
  it('calls onSubmit with form data', () => {
    // Given valid form data
    // When form is submitted
    // Then onSubmit is called with {title, description}
  })
})
```

**E2E Tests** (Playwright):
```typescript
test('create task flow', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  
  // Create task
  await page.click('text=New Task')
  await page.fill('input[name="title"]', 'Test Task')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.click('button:has-text("Create")')
  
  // Verify task appears
  await expect(page.locator('text=Test Task')).toBeVisible()
})
```

## Performance Requirements

| Metric | Target |
|--------|--------|
| Create task | < 500ms |
| Load task list | < 1s |
| Update task | < 500ms |
| Delete task | < 500ms |
| UI render | < 100ms |

## Security Requirements

- ✅ All operations require JWT authentication
- ✅ User can only access their own tasks
- ✅ SQL injection prevented by SQLModel parameterization
- ✅ XSS prevented by React automatic escaping
- ✅ CSRF protected by SameSite cookies

## Migration from Phase I

### Code Reuse
- ✅ Use case logic (business rules)
- ✅ Validation rules (title/description constraints)
- ✅ Domain exceptions (TaskNotFound, ValidationError)

### New Code
- ❌ PostgreSQL repository (replaces InMemoryRepository)
- ❌ FastAPI routes (new interface layer)
- ❌ Next.js pages and components (new UI)
- ❌ Multi-user support (user_id filtering)

## Future Enhancements (Phase III+)

- Task categories/tags
- Task due dates
- Task priorities
- Task attachments
- Task sharing between users
- Task search
- Task sorting options
- Bulk operations (mark all complete, delete all)

---

**Status**: ✅ Feature Specification Complete  
**Dependencies**: Authentication feature (Better Auth + JWT)  
**Estimated Effort**: 3-4 days  
**Last Updated**: 2025-12-07
