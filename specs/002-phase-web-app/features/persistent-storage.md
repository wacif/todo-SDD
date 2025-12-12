# Feature: Persistent Storage

**Feature ID**: persistent-storage  
**Priority**: P1 (MVP)  
**Phase**: Phase II  
**Created**: 2025-12-07

## Overview

Replace in-memory storage with PostgreSQL database for data persistence across sessions.

## Technical Requirements

**Database**: Neon Serverless PostgreSQL 15+  
**ORM**: SQLModel 0.0.14+  
**Tables**: users (Better Auth), tasks (application)

## Migration Strategy

**Phase I → Phase II**:
- ❌ Remove: InMemoryTaskRepository
- ✅ Add: PostgresTaskRepository with same interface
- ✅ Preserve: TaskRepository Protocol (no changes to use cases)
- ✅ Add: Database migrations (Alembic)

## Repository Interface

```python
class TaskRepository(Protocol):
    def add(self, task: Task) -> Task: ...
    def get_by_id(self, task_id: int, user_id: UUID) -> Task | None: ...
    def list_by_user(self, user_id: UUID) -> list[Task]: ...
    def update(self, task: Task) -> Task: ...
    def delete(self, task_id: int, user_id: UUID) -> None: ...
```

Both InMemoryTaskRepository (Phase I) and PostgresTaskRepository (Phase II) implement this interface.

**Status**: ✅ Specification Complete
