# Data Model: Phase I Basic Todo

**Created**: 2025-12-06  
**Feature**: 001-phase-basic-todo  
**Purpose**: Define domain entities and their relationships

## Entity: Task

**Description**: Represents a todo item with title, description, and completion status.

**Attributes**:

| Attribute | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `id` | int | Yes | Positive integer, unique, auto-increment | Unique task identifier |
| `title` | str | Yes | 1-200 characters, non-empty | Task title/summary |
| `description` | str | No | 0-1000 characters | Detailed task description |
| `is_complete` | bool | Yes | Default: False | Completion status flag |
| `created_at` | datetime | Yes | Auto-generated | Creation timestamp |

**Business Rules**:
1. ID must be unique and auto-incrementing (monotonic)
2. ID cannot be reused after task deletion
3. Title cannot be empty (minimum 1 character)
4. Title maximum length: 200 characters
5. Description maximum length: 1000 characters (can be empty)
6. is_complete defaults to False on creation
7. created_at is set automatically on creation (immutable)
8. Tasks are ordered by created_at (oldest first) when listed

**Validation Rules**:
```python
def validate_title(title: str) -> None:
    if not title or not title.strip():
        raise ValidationError("Title cannot be empty")
    if len(title) > 200:
        raise ValidationError("Title exceeds maximum length of 200 characters")

def validate_description(description: str) -> None:
    if len(description) > 1000:
        raise ValidationError("Description exceeds maximum length of 1000 characters")
```

**State Transitions**:
```
[Created] --> is_complete=False (initial state)
[Incomplete] <--> [Complete] (toggle via mark_complete operation)
[Any State] --> [Deleted] (permanent removal)
```

**Example Task**:
```python
Task(
    id=1,
    title="Buy groceries",
    description="Milk, eggs, bread, and coffee",
    is_complete=False,
    created_at=datetime(2025, 12, 6, 10, 30, 0)
)
```

## Repository: TaskRepository (Abstract Interface)

**Description**: Abstract interface for task persistence operations.

**Methods**:

### `add(task: Task) -> Task`
Creates a new task and assigns unique ID.
- **Input**: Task object without ID
- **Output**: Task object with assigned ID
- **Side Effects**: Increments ID counter
- **Errors**: ValidationError if title/description invalid

### `get_by_id(task_id: int) -> Optional[Task]`
Retrieves task by ID.
- **Input**: Task ID (integer)
- **Output**: Task object or None if not found
- **Side Effects**: None
- **Errors**: None (returns None for invalid ID)

### `get_all() -> List[Task]`
Retrieves all tasks ordered by creation time.
- **Input**: None
- **Output**: List of tasks (empty list if no tasks)
- **Side Effects**: None
- **Errors**: None

### `update(task: Task) -> Task`
Updates existing task.
- **Input**: Task object with ID
- **Output**: Updated task object
- **Side Effects**: Modifies stored task
- **Errors**: TaskNotFoundError if ID doesn't exist

### `delete(task_id: int) -> bool`
Removes task by ID.
- **Input**: Task ID (integer)
- **Output**: True if deleted, False if not found
- **Side Effects**: Removes task from storage
- **Errors**: None (returns False for invalid ID)

### `exists(task_id: int) -> bool`
Checks if task exists.
- **Input**: Task ID (integer)
- **Output**: True if exists, False otherwise
- **Side Effects**: None
- **Errors**: None

### `count() -> int`
Returns total number of tasks.
- **Input**: None
- **Output**: Integer count of tasks
- **Side Effects**: None
- **Errors**: None

## Implementation: InMemoryTaskRepository

**Description**: Concrete implementation using Python dictionary for in-memory storage.

**Internal State**:
```python
class InMemoryTaskRepository:
    _tasks: Dict[int, Task]  # Dictionary mapping task_id to Task
    _next_id: int             # Auto-increment counter for IDs
```

**Storage Strategy**:
- Dictionary with task_id as key for O(1) lookup
- Separate counter (_next_id) for ID generation
- IDs never reused (counter only increments)
- Tasks stored by reference (no serialization needed)

**Initialization**:
```python
def __init__(self):
    self._tasks = {}      # Empty dictionary
    self._next_id = 1     # Start IDs at 1
```

## Entity Relationships

Phase I has only one entity (Task), so no relationships exist.

**Future Phase II Additions** (out of scope for Phase I):
- `Tag` entity (many-to-many with Task)
- `Category` entity (one-to-many with Task)
- `Priority` enum (property on Task)

## Data Flow Diagram

```
┌─────────────┐
│   CLI User  │
└──────┬──────┘
       │ Input (title, description)
       ▼
┌──────────────────┐
│  Console App     │ (Interface Layer)
│  - Validates     │
│  - Formats       │
└────────┬─────────┘
         │ TaskInputDTO
         ▼
┌──────────────────┐
│  Use Case        │ (Application Layer)
│  - AddTask       │
│  - UpdateTask    │
│  - etc.          │
└────────┬─────────┘
         │ Task entity
         ▼
┌──────────────────┐
│  Task            │ (Domain Layer)
│  - Validates     │
│  - Business Rules│
└────────┬─────────┘
         │ Valid Task
         ▼
┌──────────────────┐
│  TaskRepository  │ (Infrastructure)
│  - In-memory Dict│
│  - ID generation │
└────────┬─────────┘
         │ Stored Task
         ▼
┌──────────────────┐
│  Display Result  │
│  (Rich format)   │
└──────────────────┘
```

## Storage Constraints

**Phase I (In-Memory)**:
- Maximum tasks: Limited by system RAM (~1000 tasks before warning)
- Persistence: None - data lost on exit
- Concurrency: Single-threaded (no locking needed)
- Backup: Not supported

**Phase II Changes**:
- Replace InMemoryTaskRepository with DatabaseTaskRepository
- Add Neon DB (PostgreSQL) for persistence
- Same TaskRepository interface (no domain/application changes)
- Migrations for schema management

## Type Definitions

```python
from datetime import datetime
from typing import Optional, List, Protocol

class Task:
    id: int
    title: str
    description: str
    is_complete: bool
    created_at: datetime

class TaskRepository(Protocol):
    def add(self, task: Task) -> Task: ...
    def get_by_id(self, task_id: int) -> Optional[Task]: ...
    def get_all(self) -> List[Task]: ...
    def update(self, task: Task) -> Task: ...
    def delete(self, task_id: int) -> bool: ...
    def exists(self, task_id: int) -> bool: ...
    def count(self) -> int: ...
```

## Validation Summary

| Field | Required | Min Length | Max Length | Type | Special Rules |
|-------|----------|------------|------------|------|---------------|
| id | Yes | - | - | int | Positive, unique, auto-increment |
| title | Yes | 1 | 200 | str | Non-empty after strip() |
| description | No | 0 | 1000 | str | Can be empty |
| is_complete | Yes | - | - | bool | Default False |
| created_at | Yes | - | - | datetime | Auto-generated, immutable |

## Edge Cases Handling

1. **Empty title**: Raise ValidationError before creating task
2. **Whitespace-only title**: Treat as empty, raise ValidationError
3. **Title/description exceeds max length**: Raise ValidationError
4. **Non-existent task ID**: Return None or False (not error)
5. **Delete non-existent task**: Return False silently
6. **Update non-existent task**: Raise TaskNotFoundError
7. **Special characters**: Accept all UTF-8 characters (including emojis)
