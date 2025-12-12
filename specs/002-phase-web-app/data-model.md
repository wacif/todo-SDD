# Phase 1: Data Model

**Phase**: Phase II - Full-Stack Web Application  
**Date**: 2025-12-07  
**Status**: Complete

## Overview

This document defines all data entities, their fields, relationships, validation rules, and state transitions for Phase II. The data model builds upon Phase I entities while adding multi-user support and persistence.

---

## 1. User Entity

### Purpose
Represents an authenticated user account with isolated task management.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, UNIQUE | Auto-generated unique identifier |
| `email` | String (255) | NOT NULL, UNIQUE, VALID EMAIL | User's email address (used for login) |
| `name` | String (100) | NOT NULL | User's display name |
| `password_hash` | String (255) | NOT NULL | Bcrypt hashed password (never stored in plain text) |
| `created_at` | DateTime | NOT NULL, DEFAULT NOW() | Account creation timestamp (UTC) |
| `updated_at` | DateTime | NOT NULL, DEFAULT NOW(), AUTO UPDATE | Last profile update timestamp (UTC) |

### Validation Rules

**Email**:
- Must be valid email format (RFC 5322)
- Case-insensitive uniqueness check
- Maximum 255 characters

**Name**:
- Minimum 1 character
- Maximum 100 characters
- Cannot be only whitespace

**Password** (before hashing):
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Hashed with bcrypt (cost factor 12)

### State Transitions

```
[Not Exists] → [Signup] → [Active]
[Active] → [Login] → [Authenticated]
[Authenticated] → [Logout] → [Active]
[Active] → [Delete Account] → [Deleted]
```

**Notes**:
- No "pending verification" state in v1 (email verification future feature)
- No "suspended" or "banned" states in v1 (moderation future feature)
- Account deletion cascades to all user's tasks

### Python Model (SQLModel)

```python
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    """User entity for authentication and task ownership."""
    
    __tablename__ = "users"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    name: str = Field(max_length=100, nullable=False)
    password_hash: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "sarah@example.com",
                "name": "Sarah Johnson",
                "created_at": "2025-12-07T10:00:00Z",
                "updated_at": "2025-12-07T10:00:00Z"
            }
        }
```

### TypeScript Type (Frontend)

```typescript
export interface User {
  id: string;  // UUID as string
  email: string;
  name: string;
  created_at: string;  // ISO 8601 datetime
  updated_at: string;
  // password_hash NEVER exposed to frontend
}

export interface UserSignupInput {
  email: string;
  name: string;
  password: string;  // Plain text, sent over HTTPS only
}

export interface UserLoginInput {
  email: string;
  password: string;
}
```

---

## 2. Task Entity

### Purpose
Represents a single todo item owned by a user. Evolved from Phase I with user ownership and persistence.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Serial (Integer) | PRIMARY KEY, NOT NULL, AUTO INCREMENT | Sequential task identifier |
| `user_id` | UUID | FOREIGN KEY (users.id), NOT NULL, ON DELETE CASCADE | Owner of the task |
| `title` | String (200) | NOT NULL | Brief task description |
| `description` | String (1000) | NULLABLE | Optional detailed task description |
| `completed` | Boolean | NOT NULL, DEFAULT FALSE | Task completion status |
| `created_at` | DateTime | NOT NULL, DEFAULT NOW() | Task creation timestamp (UTC) |
| `updated_at` | DateTime | NOT NULL, DEFAULT NOW(), AUTO UPDATE | Last modification timestamp (UTC) |

### Validation Rules

**Title**:
- Minimum 1 character
- Maximum 200 characters
- Cannot be only whitespace
- Required field

**Description**:
- Maximum 1000 characters
- Optional (can be null or empty string)
- Whitespace trimmed before storage

**Completed**:
- Boolean only (true/false)
- Default: false (new tasks are incomplete)

**User ID**:
- Must reference existing user in `users` table
- Foreign key constraint enforced
- Cascade delete: All tasks deleted when user deleted

### Relationships

```
User (1) ←──→ (N) Task
```

- One user can have many tasks
- Each task belongs to exactly one user
- Relationship enforced via `user_id` foreign key

### State Transitions

```
[Not Exists] → [Create] → [Incomplete]
[Incomplete] → [Mark Complete] → [Complete]
[Complete] → [Mark Incomplete] → [Incomplete]
[Incomplete/Complete] → [Update] → [Incomplete/Complete]
[Incomplete/Complete] → [Delete] → [Deleted]
```

**State Rules**:
- Cannot mark non-existent task as complete
- Can toggle completion status multiple times
- Updates preserve completion status unless explicitly changed
- Deletion is permanent (no soft delete in v1)

### Python Model (SQLModel)

```python
from datetime import datetime
from typing import Optional
from uuid import UUID
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    """Task entity representing a todo item owned by a user."""
    
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Complete Phase II implementation",
                "description": "Implement backend and frontend for web app",
                "completed": False,
                "created_at": "2025-12-07T10:00:00Z",
                "updated_at": "2025-12-07T10:00:00Z"
            }
        }
```

### TypeScript Type (Frontend)

```typescript
export interface Task {
  id: number;
  user_id: string;  // UUID as string
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;  // ISO 8601 datetime
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;  // Optional
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

---

## 3. JWT Token (Authentication)

### Purpose
Stateless authentication token issued after successful login. Not stored in database (stateless design).

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | UUID | Identifies the authenticated user |
| `email` | String | User's email (for display purposes) |
| `iat` | Unix Timestamp | Issued at timestamp |
| `exp` | Unix Timestamp | Expiration timestamp (iat + 7 days) |

### Validation Rules

**Token Signature**:
- Algorithm: HS256 (HMAC SHA-256)
- Secret: `BETTER_AUTH_SECRET` (minimum 32 characters)
- Shared between frontend (Better Auth) and backend (PyJWT)

**Token Expiry**:
- Lifetime: 7 days (604800 seconds)
- No refresh tokens in v1 (user must re-authenticate after expiry)
- Expiry checked on every API request

**Token Transmission**:
- Stored in HTTP-only cookie (frontend)
- Sent in `Authorization: Bearer <token>` header (API requests)
- Never exposed to JavaScript (XSS protection)

### Python JWT Payload (PyJWT)

```python
from datetime import datetime, timedelta
from uuid import UUID

def create_jwt_token(user_id: UUID, email: str, secret: str) -> str:
    """Create JWT token for authenticated user."""
    payload = {
        "user_id": str(user_id),
        "email": email,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, secret, algorithm="HS256")

def verify_jwt_token(token: str, secret: str) -> dict:
    """Verify JWT token and return payload."""
    return jwt.decode(token, secret, algorithms=["HS256"])
```

### TypeScript Type (Frontend)

```typescript
export interface JWTPayload {
  user_id: string;
  email: string;
  iat: number;  // Unix timestamp
  exp: number;
}
```

---

## 4. Data Transfer Objects (DTOs)

### Purpose
Decouple API contracts from internal entities. DTOs sanitize data for API responses (e.g., exclude password_hash).

### UserDTO

```python
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserDTO(BaseModel):
    """User data transfer object (no password_hash)."""
    id: UUID
    email: EmailStr
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### TaskDTO

```python
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class TaskDTO(BaseModel):
    """Task data transfer object."""
    id: int
    user_id: UUID
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### TaskInputDTO

```python
from pydantic import BaseModel, Field
from typing import Optional

class TaskInputDTO(BaseModel):
    """Input DTO for creating/updating tasks."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
```

---

## 5. Database Indexes

### Purpose
Optimize query performance for common access patterns.

### Primary Indexes

| Index Name | Table | Columns | Type | Purpose |
|------------|-------|---------|------|---------|
| `pk_users` | users | id | PRIMARY KEY | Unique user identification |
| `pk_tasks` | tasks | id | PRIMARY KEY | Unique task identification |
| `idx_users_email` | users | email | UNIQUE | Prevent duplicate emails, fast login lookup |
| `idx_tasks_user_id` | tasks | user_id | BTREE | Fast filtering by user (most common query) |
| `idx_tasks_completed` | tasks | completed | BTREE | Fast filtering by status |
| `idx_tasks_created_at` | tasks | created_at | BTREE | Fast sorting by creation date |
| `idx_tasks_user_created` | tasks | (user_id, created_at) | COMPOSITE | Optimized for sorted task lists per user |

### Query Optimization Examples

**List tasks for user (sorted by creation date)**:
```sql
SELECT * FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 100;
-- Uses idx_tasks_user_created composite index
```

**Count completed tasks for user**:
```sql
SELECT COUNT(*) FROM tasks
WHERE user_id = $1 AND completed = TRUE;
-- Uses idx_tasks_user_id and idx_tasks_completed
```

**Find task by ID and user (authorization check)**:
```sql
SELECT * FROM tasks
WHERE id = $1 AND user_id = $2;
-- Uses pk_tasks and idx_tasks_user_id
```

---

## 6. Data Model Evolution from Phase I

### Changes Summary

**Added**:
- ✅ User entity (authentication and ownership)
- ✅ `user_id` foreign key in Task entity
- ✅ `created_at` and `updated_at` timestamps (audit trail)
- ✅ Database constraints (foreign keys, unique indexes)

**Unchanged**:
- ✅ Task fields: `id`, `title`, `description`, `completed` (same semantics)
- ✅ Task validation rules (same constraints as Phase I)

**Removed**:
- ❌ In-memory storage (replaced with PostgreSQL)

### Migration Path

1. **Create User table** with Better Auth compatibility
2. **Modify Task table** to include `user_id` foreign key
3. **Add indexes** for query optimization
4. **Migrate Phase I tasks** (optional: assign to default user for testing)

---

## 7. Validation Summary

### Backend Validation (Pydantic + Database)

- **Pydantic Models**: Validate API request bodies before use case execution
- **Database Constraints**: Enforce data integrity at storage layer
- **Use Case Logic**: Business rule validation (e.g., user owns task before update)

### Frontend Validation (TypeScript + HTML5)

- **HTML5 Attributes**: `required`, `minlength`, `maxlength`, `type="email"`
- **TypeScript Types**: Compile-time type checking
- **Client-Side Checks**: Immediate feedback before API call (UX optimization)

**Validation Flow**:
```
Frontend Form → HTML5 Validation → TypeScript Type Check
    ↓
API Request → Pydantic Validation → Use Case Validation
    ↓
Database → Constraint Validation → Storage
```

---

## Summary

**Entities Defined**: 2 (User, Task)  
**Relationships**: 1 (User → Tasks, 1:N)  
**Indexes**: 7 (optimized for common queries)  
**DTOs**: 3 (UserDTO, TaskDTO, TaskInputDTO)  
**State Machines**: 2 (User lifecycle, Task lifecycle)

**Status**: Data model complete. Ready for contract generation (Phase 1b).
