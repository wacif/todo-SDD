# Phase I Research & Technical Decisions

**Created**: 2025-12-06  
**Feature**: 001-phase-basic-todo  
**Purpose**: Document technical research and decision rationale for Phase I implementation

## Decision 1: Dependency Management - UV

**Context**: Need a modern Python dependency manager that's fast and reliable.

**Options Considered**:
1. **UV** (Chosen)
   - Extremely fast Rust-based package manager
   - Drop-in replacement for pip/pip-tools
   - Native support for pyproject.toml
   - Good UV project scaffolding

2. Poetry
   - Mature, widely adopted
   - Slower than UV
   - More complex configuration

3. Pip + pip-tools
   - Standard but slower
   - Manual dependency resolution

**Decision**: Use UV
**Rationale**: UV is explicitly required by hackathon requirements. Provides fastest dependency resolution and best developer experience for Python 3.13+ projects.

## Decision 2: Console UI Framework - Rich

**Context**: Need high-quality console formatting for task lists and user interaction.

**Options Considered**:
1. **Rich** (Chosen)
   - Beautiful tables, colors, and formatting
   - Progress bars and live display
   - Excellent documentation
   - Active maintenance

2. Colorama
   - Basic color support only
   - Less feature-rich

3. Click
   - CLI framework but doesn't handle formatting
   - Would need additional library for visual output

**Decision**: Use Rich library
**Rationale**: Rich provides the best console formatting capabilities with tables, colors, and status indicators (✓/○) needed for task display. Aligns with NFR-008 requirement.

## Decision 3: Testing Framework - Pytest

**Context**: Need comprehensive testing framework supporting TDD workflow.

**Options Considered**:
1. **Pytest** (Chosen)
   - Industry standard for Python testing
   - Excellent fixture system
   - Great plugin ecosystem (pytest-cov)
   - Powerful assertion introspection

2. Unittest
   - Standard library (no dependencies)
   - More verbose syntax
   - Less powerful than pytest

**Decision**: Use Pytest with pytest-cov
**Rationale**: Pytest is explicitly mentioned in technical context. Provides best TDD workflow support, excellent coverage reporting, and clean test syntax. Enables 80% coverage target tracking.

## Decision 4: Code Quality Tools - Ruff

**Context**: Need fast linting and formatting to enforce PEP 8 compliance.

**Options Considered**:
1. **Ruff** (Chosen)
   - Extremely fast (Rust-based)
   - Replaces Flake8, Black, isort, pylint
   - Single tool for linting + formatting
   - 10-100x faster than alternatives

2. Black + Flake8 + isort
   - Mature ecosystem
   - Multiple tools to manage
   - Slower execution

**Decision**: Use Ruff for linting and formatting
**Rationale**: Ruff provides the fastest code quality checks with comprehensive rule coverage. Single tool simplifies configuration and execution. Enforces PEP 8 (NFR-005) and type hint requirements (NFR-004).

## Decision 5: Architecture Pattern - Clean Architecture

**Context**: Need architecture that supports evolution through Phase II-V.

**Options Considered**:
1. **Clean Architecture** (Chosen)
   - Clear layer separation (Domain/Application/Interface/Infrastructure)
   - Dependencies flow inward
   - Domain isolated from external concerns
   - Enables technology swaps

2. MVC Pattern
   - Simpler but less flexible
   - Harder to evolve
   - Couples view and model

3. Simple Script
   - Fastest to build initially
   - Becomes unmaintainable
   - Difficult to test
   - Cannot evolve to Phase II

**Decision**: Implement Clean Architecture
**Rationale**: Constitutional requirement (Principle IV). Clean architecture enables Phase II evolution (adding web interface and database) without rewriting business logic. Domain layer remains stable across all phases.

## Decision 6: In-Memory Storage - Python Dictionary

**Context**: Phase I requires in-memory storage with no persistence.

**Options Considered**:
1. **Dictionary with auto-increment** (Chosen)
   - Fast O(1) lookups by task ID
   - Simple to implement
   - Sufficient for in-memory needs

2. List
   - Sequential storage
   - O(n) lookups
   - Simpler but slower

3. SQLite in-memory mode
   - Overkill for Phase I
   - Adds database dependency
   - Over-engineered

**Decision**: Use dictionary with integer key (task ID) for storage
**Rationale**: Provides O(1) task lookups by ID. Simple to implement and test. Easy to replace with database repository in Phase II (repository pattern abstraction).

## Decision 7: ID Generation Strategy - Auto-Increment Counter

**Context**: Need unique task IDs that don't reuse deleted IDs.

**Options Considered**:
1. **Auto-increment counter** (Chosen)
   - Monotonically increasing
   - Never reuses IDs
   - Simple to implement
   - User-friendly (sequential numbers)

2. UUID
   - Globally unique
   - Long, non-sequential
   - Less user-friendly in console
   - Overkill for single-user app

**Decision**: Auto-incrementing integer IDs starting from 1
**Rationale**: Matches edge case requirement (don't reuse deleted IDs). User-friendly for console display. Simple to implement and test. Sufficient for single-user in-memory application.

## Decision 8: Input Validation Strategy - Early Validation

**Context**: Need to validate user input before processing.

**Options Considered**:
1. **Validate at interface layer** (Chosen)
   - Fast failure
   - Better user experience
   - Clear error messages at input point

2. Validate at domain layer only
   - Cleaner architecture
   - Delayed error feedback
   - Poor UX for console app

**Decision**: Validate at interface layer with helper validators, enforce business rules at domain layer
**Rationale**: Console apps benefit from immediate input validation. Interface layer validates format (empty title, length limits). Domain layer enforces business rules. Clear separation of concerns.

## Decision 9: Error Handling - Custom Exceptions

**Context**: Need clear error handling for invalid operations.

**Options Considered**:
1. **Custom domain exceptions** (Chosen)
   - Clear error types
   - Better error handling
   - Type-safe with type hints

2. Generic exceptions
   - Simpler but less clear
   - Harder to handle specifically
   - Poor error messages

**Decision**: Define custom exception hierarchy in domain layer
**Rationale**: Enables specific error handling (TaskNotFoundError, ValidationError). Provides clear error messages. Supports type-safe exception handling. Aligns with clean architecture principles.

## Decision 10: Console Menu System - Rich Prompt

**Context**: Need interactive menu system for user operations.

**Options Considered**:
1. **Rich Prompt with numbered menu** (Chosen)
   - Clear visual presentation
   - Simple number selection
   - Consistent with Rich theme

2. Command-based (e.g., "add", "list", "delete")
   - More typing required
   - Harder for users to remember commands
   - Better for advanced users

**Decision**: Numbered menu system with Rich formatting
**Rationale**: Most user-friendly for console application. Clear visual hierarchy. Minimal typing required. Works well with Rich library's table and panel components.

## Best Practices & Patterns

### Type Hints
- All functions, methods, and variables must have type hints
- Use `from __future__ import annotations` for forward references
- Use `typing` module for generic types (List, Dict, Optional)

### Testing Patterns
- **Arrange-Act-Assert** pattern for test structure
- Pytest fixtures for common test data
- Parametrized tests for multiple scenarios
- Mock external dependencies (though minimal in Phase I)

### Logging
- Structured logging with Python's logging module
- Log levels: DEBUG, INFO, WARNING, ERROR
- Include context (task_id, operation, user_input)
- Prepare for centralized logging in Phase IV+

### Configuration
- Centralized settings in infrastructure/config
- Environment variable support for future phases
- Sensible defaults for Phase I

## Phase II Migration Path

**What Changes**:
- Add FastAPI in interface layer (alongside CLI)
- Replace in-memory repository with SQLModel + Neon DB repository
- Add API contracts (OpenAPI schema)

**What Stays the Same**:
- Domain layer (Task entity, business rules)
- Application layer (use cases remain identical)
- Test suite (unit tests unchanged)

**Migration Strategy**:
- Keep in-memory repository for testing
- Add database repository as alternative implementation
- Both CLI and Web API use same use cases
- Repository pattern enables swapping storage without use case changes

## References

- [UV Documentation](https://github.com/astral-sh/uv)
- [Rich Documentation](https://rich.readthedocs.io/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Ruff Documentation](https://docs.astral.sh/ruff/)
- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- Evolution of Todo Constitution v1.0.0
