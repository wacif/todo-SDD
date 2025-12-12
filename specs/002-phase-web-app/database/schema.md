# Database Schema Specification

**Version**: 2.0  
**Database**: Neon Serverless PostgreSQL 15+  
**ORM**: SQLModel 0.0.14+  
**Created**: 2025-12-07

## Overview

The database schema supports multi-user todo application with authentication. Data is organized into two main tables:
- `users` - Managed by Better Auth for authentication
- `tasks` - Application data with foreign key to users

## Entity Relationship Diagram

```
┌─────────────────────────────┐          ┌─────────────────────────────┐
│          users              │          │          tasks              │
├─────────────────────────────┤          ├─────────────────────────────┤
│ id (PK, UUID)               │◄────────┤ id (PK, SERIAL)             │
│ email (UNIQUE, NOT NULL)    │    1:N  │ user_id (FK, NOT NULL)      │
│ name (NOT NULL)             │          │ title (NOT NULL)            │
│ password_hash (NOT NULL)    │          │ description (NULL)          │
│ created_at (TIMESTAMP)      │          │ completed (BOOLEAN)         │
│ updated_at (TIMESTAMP)      │          │ created_at (TIMESTAMP)      │
└─────────────────────────────┘          │ updated_at (TIMESTAMP)      │
                                          └─────────────────────────────┘
```

## Tables

### users

**Purpose**: Store user accounts and authentication credentials (managed by Better Auth)

**SQL Definition**:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);

-- Indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Comments
COMMENT ON TABLE users IS 'User accounts managed by Better Auth';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique, used for login)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password (cost factor 12)';
```

**SQLModel Definition**:
```python
# backend/models/user.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    name: str = Field(min_length=2, max_length=100)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "sarah@example.com",
                "name": "Sarah Johnson",
                "password_hash": "$2b$12$...",
                "created_at": "2025-12-07T10:00:00Z",
                "updated_at": "2025-12-07T10:00:00Z"
            }
        }
```

**Columns**:

| Column | Type | Nullable | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | No | - | UNIQUE, email format | User email for login |
| name | VARCHAR(100) | No | - | 2-100 chars | User's display name |
| password_hash | VARCHAR(255) | No | - | - | Bcrypt hashed password |
| created_at | TIMESTAMP | No | CURRENT_TIMESTAMP | - | Account creation time |
| updated_at | TIMESTAMP | No | CURRENT_TIMESTAMP | - | Last update time |

**Indexes**:
- `idx_users_email` (UNIQUE): Fast email lookup for login
- `idx_users_created_at`: Query users by registration date

**Business Rules**:
1. Email must be unique across all users
2. Email must follow RFC 5322 format
3. Name must be 2-100 characters
4. Password must be hashed with bcrypt (never store plain text)
5. UUID v4 generated automatically for new users

---

### tasks

**Purpose**: Store todo tasks with user ownership and completion status

**SQL Definition**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
    CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 1000)
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);

-- Comments
COMMENT ON TABLE tasks IS 'User todo tasks';
COMMENT ON COLUMN tasks.id IS 'Auto-incrementing task ID';
COMMENT ON COLUMN tasks.user_id IS 'Foreign key to users table (owner)';
COMMENT ON COLUMN tasks.title IS 'Task title (1-200 characters)';
COMMENT ON COLUMN tasks.description IS 'Optional task description (max 1000 characters)';
COMMENT ON COLUMN tasks.completed IS 'Task completion status (false=incomplete, true=complete)';
```

**SQLModel Definition**:
```python
# backend/models/task.py
from sqlmodel import SQLModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "uuid-123",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "created_at": "2025-12-07T10:00:00Z",
                "updated_at": "2025-12-07T10:00:00Z"
            }
        }
```

**Columns**:

| Column | Type | Nullable | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| id | SERIAL | No | auto | PRIMARY KEY | Auto-incrementing task ID |
| user_id | UUID | No | - | FK → users.id | Task owner |
| title | VARCHAR(200) | No | - | 1-200 chars | Task title |
| description | TEXT | Yes | NULL | 0-1000 chars | Task description |
| completed | BOOLEAN | No | FALSE | - | Completion status |
| created_at | TIMESTAMP | No | CURRENT_TIMESTAMP | - | Task creation time |
| updated_at | TIMESTAMP | No | CURRENT_TIMESTAMP | - | Last update time |

**Indexes**:
- `idx_tasks_user_id`: Fast queries for user's tasks
- `idx_tasks_completed`: Filter by completion status
- `idx_tasks_created_at`: Order by creation date
- `idx_tasks_user_created`: Composite index for user + date queries (most common)

**Business Rules**:
1. Title required, 1-200 characters
2. Description optional, max 1000 characters
3. Completed defaults to false (incomplete)
4. Foreign key to users table (CASCADE DELETE)
5. Auto-increment ID starting from 1
6. updated_at automatically updated on modification

---

## Relationships

### users → tasks (One-to-Many)

**Relationship**: One user can have many tasks

**Foreign Key**: `tasks.user_id` → `users.id`

**Delete Behavior**: `ON DELETE CASCADE`
- When user is deleted, all their tasks are automatically deleted
- Ensures no orphaned tasks in database

**SQLModel Relationship**:
```python
# backend/models/user.py
from sqlmodel import Relationship
from typing import List

class User(SQLModel, table=True):
    # ... existing fields ...
    
    # Relationship (optional, for convenience)
    tasks: List["Task"] = Relationship(back_populates="user")

# backend/models/task.py
class Task(SQLModel, table=True):
    # ... existing fields ...
    
    # Relationship (optional, for convenience)
    user: Optional[User] = Relationship(back_populates="tasks")
```

---

## Database Migrations

### Initial Migration (001_initial_schema.sql)

```sql
-- Migration: 001_initial_schema
-- Created: 2025-12-07
-- Description: Create users and tasks tables

BEGIN;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
    CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 1000)
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);

-- Add comments
COMMENT ON TABLE users IS 'User accounts managed by Better Auth';
COMMENT ON TABLE tasks IS 'User todo tasks';

COMMIT;
```

### Rollback Migration (001_rollback.sql)

```sql
-- Rollback Migration: 001_initial_schema
BEGIN;

DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

COMMIT;
```

---

## Sample Data (Development Only)

```sql
-- Insert test users
INSERT INTO users (id, email, name, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'sarah@example.com', 'Sarah Johnson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ByJ1zl5J5l5G'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'mike@example.com', 'Mike Chen', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ByJ1zl5J5l5G');

-- Insert test tasks for Sarah
INSERT INTO tasks (user_id, title, description, completed) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Buy groceries', 'Milk, eggs, bread', false),
('550e8400-e29b-41d4-a716-446655440000', 'Finish report', 'Q4 financial report', false),
('550e8400-e29b-41d4-a716-446655440000', 'Call dentist', 'Schedule cleaning appointment', true);

-- Insert test tasks for Mike
INSERT INTO tasks (user_id, title, description, completed) VALUES
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Review PRs', 'Review team pull requests', false),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Update documentation', 'API docs for v2.0', true);
```

---

## Common Queries

### Get all tasks for a user (ordered by creation date)
```sql
SELECT * FROM tasks
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY created_at DESC;
```

### Get incomplete tasks for a user
```sql
SELECT * FROM tasks
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
  AND completed = FALSE
ORDER BY created_at DESC;
```

### Create new task
```sql
INSERT INTO tasks (user_id, title, description, completed)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'New task',
    'Task description',
    FALSE
)
RETURNING *;
```

### Update task
```sql
UPDATE tasks
SET title = 'Updated title',
    description = 'Updated description',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1
  AND user_id = '550e8400-e29b-41d4-a716-446655440000'
RETURNING *;
```

### Toggle task completion
```sql
UPDATE tasks
SET completed = NOT completed,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1
  AND user_id = '550e8400-e29b-41d4-a716-446655440000'
RETURNING *;
```

### Delete task
```sql
DELETE FROM tasks
WHERE id = 1
  AND user_id = '550e8400-e29b-41d4-a716-446655440000';
```

### Get user by email (login)
```sql
SELECT * FROM users
WHERE email = 'sarah@example.com';
```

---

## Security Considerations

### Row-Level Security (Future Enhancement)

```sql
-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tasks
CREATE POLICY tasks_user_isolation ON tasks
FOR ALL
TO authenticated
USING (user_id = current_user_id());

-- Policy: Users can only modify their own tasks
CREATE POLICY tasks_user_modification ON tasks
FOR UPDATE
TO authenticated
USING (user_id = current_user_id());
```

### Audit Trail (Future Enhancement)

```sql
-- Create audit table
CREATE TABLE task_audit (
    audit_id SERIAL PRIMARY KEY,
    task_id INT,
    user_id UUID,
    action VARCHAR(10),  -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function
CREATE OR REPLACE FUNCTION audit_task_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO task_audit (task_id, user_id, action, new_values)
        VALUES (NEW.id, NEW.user_id, 'INSERT', row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO task_audit (task_id, user_id, action, old_values, new_values)
        VALUES (NEW.id, NEW.user_id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO task_audit (task_id, user_id, action, old_values)
        VALUES (OLD.id, OLD.user_id, 'DELETE', row_to_json(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER task_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION audit_task_changes();
```

---

## Performance Optimization

### Query Performance Targets

| Query Type | Target | Index Used |
|------------|--------|------------|
| List user's tasks | < 50ms | idx_tasks_user_created |
| Create task | < 20ms | None (INSERT) |
| Update task | < 30ms | Primary key |
| Delete task | < 30ms | Primary key |
| User login | < 50ms | idx_users_email |

### Index Usage Analysis

```sql
-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Identify missing indexes
SELECT
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND tablename IN ('users', 'tasks')
ORDER BY n_distinct DESC;
```

---

## Database Configuration

### Connection String (Environment Variable)

```bash
# Development
DATABASE_URL=postgresql://dev:password@localhost:5432/todo_dev

# Neon (Production)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/todo_prod?sslmode=require
```

### Connection Pool Settings

```python
# backend/db.py
from sqlmodel import create_engine

engine = create_engine(
    DATABASE_URL,
    echo=True,  # SQL logging (disable in production)
    pool_size=10,  # Number of connections to maintain
    max_overflow=20,  # Additional connections if pool is full
    pool_timeout=30,  # Seconds to wait for connection
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_pre_ping=True,  # Verify connection before use
)
```

---

## Backup and Recovery

### Neon Automatic Backups
- **Frequency**: Continuous (point-in-time recovery)
- **Retention**: 7 days (free tier), 30 days (paid)
- **Recovery**: Via Neon dashboard or API

### Manual Backup Script

```bash
#!/bin/bash
# backup_database.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

echo "Backup created: ${BACKUP_FILE}.gz"
```

### Restore Script

```bash
#!/bin/bash
# restore_database.sh

BACKUP_FILE=$1

gunzip -c $BACKUP_FILE | psql $DATABASE_URL

echo "Database restored from: $BACKUP_FILE"
```

---

## Database Maintenance

### Regular Tasks

```sql
-- Vacuum tables (reclaim space)
VACUUM ANALYZE users;
VACUUM ANALYZE tasks;

-- Reindex (rebuild indexes)
REINDEX TABLE users;
REINDEX TABLE tasks;

-- Update statistics (query planner)
ANALYZE users;
ANALYZE tasks;
```

### Monitoring Queries

```sql
-- Table sizes
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Long-running queries
SELECT
    pid,
    now() - query_start AS duration,
    query
FROM pg_stat_activity
WHERE state = 'active'
  AND now() - query_start > interval '1 minute'
ORDER BY duration DESC;
```

---

**Status**: ✅ Database Schema Complete  
**Next Step**: API endpoints specification  
**Migration Script**: Ready for implementation  
**Last Updated**: 2025-12-07
