# Tasks: Phase I - Basic Todo Management

**Input**: Design documents from `/specs/001-phase-basic-todo/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: TDD workflow enforced - write tests FIRST, verify they FAIL, then implement via Claude Code generation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Include exact file paths in descriptions

## Path Conventions

**Single project structure** (as defined in plan.md):
- Source code: `src/`
- Tests: `tests/`
- Entry point: `src/main.py`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Duration**: ~30 minutes

- [ ] T001 Initialize UV project with Python 3.13+ in repository root
- [ ] T002 Create pyproject.toml with dependencies (rich>=13.7.0, pytest>=8.0.0, pytest-cov>=4.1.0, ruff>=0.1.0)
- [ ] T003 [P] Create complete directory structure per plan.md (src/domain, src/application, src/interface, src/infrastructure, tests/)
- [ ] T004 [P] Create all __init__.py files in src/ subdirectories
- [ ] T005 [P] Create .gitignore for Python (venv, __pycache__, .pytest_cache, .coverage, htmlcov/, *.pyc)
- [ ] T006 [P] Configure Ruff in pyproject.toml (line-length=100, target-version="py313")
- [ ] T007 [P] Configure Pytest in pyproject.toml (testpaths, coverage settings)
- [ ] T008 [P] Create tests/conftest.py with pytest fixtures for test data
- [ ] T009 Verify setup: run `uv sync` and `uv run pytest` (should pass with no tests)

**Checkpoint**: ✅ Development environment ready, dependencies installed, directory structure complete

---

## Phase 2: Foundational (Domain & Infrastructure)

**Purpose**: Core entities and repository that ALL user stories depend on

**Duration**: ~2 hours

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Domain Layer (TDD - Write Tests First)

- [ ] T010 [P] Write test for Task entity creation in tests/unit/domain/test_task_entity.py
- [ ] T011 [P] Write test for Task entity validation (empty title, max lengths) in tests/unit/domain/test_task_entity.py
- [ ] T012 [P] Write test for domain exceptions in tests/unit/domain/test_domain_exceptions.py
- [ ] T013 Verify tests FAIL (red phase) - run pytest, expect failures
- [ ] T014 Generate Task entity with validation in src/domain/entities/task.py via Claude Code
- [ ] T015 [P] Generate domain exceptions in src/domain/exceptions/domain_exceptions.py via Claude Code
- [ ] T016 [P] Generate TaskRepository protocol interface in src/domain/repositories/task_repository.py via Claude Code
- [ ] T017 Verify tests PASS (green phase) - run pytest, expect all passing
- [ ] T018 Verify domain coverage ≥ 90% - run pytest --cov=src/domain

### Infrastructure Layer (TDD - Write Tests First)

- [ ] T019 Write test for InMemoryTaskRepository in tests/unit/infrastructure/test_in_memory_repository.py
- [ ] T020 Write test for ID auto-increment and non-reuse after deletion in tests/unit/infrastructure/test_in_memory_repository.py
- [ ] T021 Verify tests FAIL (red phase)
- [ ] T022 Generate InMemoryTaskRepository in src/infrastructure/persistence/in_memory_task_repository.py via Claude Code
- [ ] T023 [P] Generate settings configuration in src/infrastructure/config/settings.py via Claude Code
- [ ] T024 [P] Generate structured logging in src/infrastructure/logging/logger.py via Claude Code
- [ ] T025 Verify tests PASS (green phase)
- [ ] T026 Verify infrastructure coverage ≥ 85%

**Checkpoint**: ✅ Foundation complete - Task entity, repository, and infrastructure ready for use cases

---

## Phase 3: User Story 1 - Add Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new todo tasks with title and description

**Independent Test**: Can add a task and see it in the repository with unique ID and incomplete status

**Duration**: ~45 minutes

### Tests for User Story 1 (Write FIRST)

- [ ] T027 [P] [US1] Write test for AddTask use case success scenario in tests/unit/application/test_add_task.py
- [ ] T028 [P] [US1] Write test for AddTask use case with empty title (should raise ValidationError) in tests/unit/application/test_add_task.py
- [ ] T029 [P] [US1] Write test for AddTask use case with title too long in tests/unit/application/test_add_task.py
- [ ] T030 [US1] Verify tests FAIL (red phase)

### Implementation for User Story 1

- [ ] T031 [P] [US1] Generate TaskInputDTO in src/application/dto/task_input_dto.py via Claude Code
- [ ] T032 [P] [US1] Generate TaskDTO in src/application/dto/task_dto.py via Claude Code
- [ ] T033 [US1] Generate AddTaskUseCase in src/application/use_cases/add_task.py via Claude Code
- [ ] T034 [US1] Verify tests PASS (green phase)
- [ ] T035 [US1] Verify US1 coverage ≥ 90%

**Checkpoint**: ✅ At this point, User Story 1 is fully functional - can add tasks programmatically

---

## Phase 4: User Story 2 - View Task List (Priority: P2)

**Goal**: Enable users to see all their tasks with details and status

**Independent Test**: Can retrieve and display all tasks in creation order with proper formatting

**Duration**: ~45 minutes

### Tests for User Story 2 (Write FIRST)

- [ ] T036 [P] [US2] Write test for ListTasks use case with multiple tasks in tests/unit/application/test_list_tasks.py
- [ ] T037 [P] [US2] Write test for ListTasks use case with empty list in tests/unit/application/test_list_tasks.py
- [ ] T038 [P] [US2] Write test for ListTasks use case ordering (oldest first) in tests/unit/application/test_list_tasks.py
- [ ] T039 [US2] Verify tests FAIL (red phase)

### Implementation for User Story 2

- [ ] T040 [US2] Generate ListTasksUseCase in src/application/use_cases/list_tasks.py via Claude Code
- [ ] T041 [US2] Verify tests PASS (green phase)
- [ ] T042 [US2] Verify US2 coverage ≥ 90%

**Checkpoint**: ✅ User Story 2 complete - can list all tasks

---

## Phase 5: User Story 3 - Mark Task as Complete (Priority: P3)

**Goal**: Enable users to toggle task completion status

**Independent Test**: Can mark a task complete (✓) and incomplete (○), status persists

**Duration**: ~45 minutes

### Tests for User Story 3 (Write FIRST)

- [ ] T043 [P] [US3] Write test for MarkTaskComplete use case toggle complete in tests/unit/application/test_mark_complete.py
- [ ] T044 [P] [US3] Write test for MarkTaskComplete use case toggle incomplete in tests/unit/application/test_mark_complete.py
- [ ] T045 [P] [US3] Write test for MarkTaskComplete with non-existent ID (should raise TaskNotFoundError) in tests/unit/application/test_mark_complete.py
- [ ] T046 [P] [US3] Write test for idempotent marking (mark complete twice) in tests/unit/application/test_mark_complete.py
- [ ] T047 [US3] Verify tests FAIL (red phase)

### Implementation for User Story 3

- [ ] T048 [US3] Generate MarkTaskCompleteUseCase in src/application/use_cases/mark_task_complete.py via Claude Code
- [ ] T049 [US3] Verify tests PASS (green phase)
- [ ] T050 [US3] Verify US3 coverage ≥ 90%

**Checkpoint**: ✅ User Story 3 complete - can toggle completion status

---

## Phase 6: User Story 4 - Update Task (Priority: P4)

**Goal**: Enable users to modify task title and/or description

**Independent Test**: Can update task details, ID and status remain unchanged

**Duration**: ~45 minutes

### Tests for User Story 4 (Write FIRST)

- [ ] T051 [P] [US4] Write test for UpdateTask use case with both title and description in tests/unit/application/test_update_task.py
- [ ] T052 [P] [US4] Write test for UpdateTask use case with only title in tests/unit/application/test_update_task.py
- [ ] T053 [P] [US4] Write test for UpdateTask use case with only description in tests/unit/application/test_update_task.py
- [ ] T054 [P] [US4] Write test for UpdateTask with non-existent ID (should raise TaskNotFoundError) in tests/unit/application/test_update_task.py
- [ ] T055 [P] [US4] Write test for UpdateTask with empty title (should raise ValidationError) in tests/unit/application/test_update_task.py
- [ ] T056 [US4] Verify tests FAIL (red phase)

### Implementation for User Story 4

- [ ] T057 [US4] Generate UpdateTaskUseCase in src/application/use_cases/update_task.py via Claude Code
- [ ] T058 [US4] Verify tests PASS (green phase)
- [ ] T059 [US4] Verify US4 coverage ≥ 90%

**Checkpoint**: ✅ User Story 4 complete - can update tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P5)

**Goal**: Enable users to remove tasks from the list

**Independent Test**: Can delete a task by ID, task no longer appears in list, ID not reused

**Duration**: ~45 minutes

### Tests for User Story 5 (Write FIRST)

- [ ] T060 [P] [US5] Write test for DeleteTask use case with existing task in tests/unit/application/test_delete_task.py
- [ ] T061 [P] [US5] Write test for DeleteTask use case with non-existent ID (returns False silently) in tests/unit/application/test_delete_task.py
- [ ] T062 [P] [US5] Write test for DeleteTask verifying ID not reused after deletion in tests/unit/application/test_delete_task.py
- [ ] T063 [US5] Verify tests FAIL (red phase)

### Implementation for User Story 5

- [ ] T064 [US5] Generate DeleteTaskUseCase in src/application/use_cases/delete_task.py via Claude Code
- [ ] T065 [US5] Verify tests PASS (green phase)
- [ ] T066 [US5] Verify US5 coverage ≥ 90%

**Checkpoint**: ✅ User Story 5 complete - can delete tasks. All core use cases implemented!

---

## Phase 8: Interface Layer (CLI with Rich)

**Purpose**: Build console interface connecting all use cases

**Duration**: ~2 hours

### CLI Foundation (TDD)

- [ ] T067 [P] Write test for input validators in tests/unit/interface/test_validators.py
- [ ] T068 [P] Write test for Rich formatters (table display, status symbols) in tests/unit/interface/test_formatters.py
- [ ] T069 Verify tests FAIL (red phase)
- [ ] T070 [P] Generate input validators in src/interface/cli/validators.py via Claude Code
- [ ] T071 [P] Generate Rich formatters in src/interface/cli/formatters.py via Claude Code
- [ ] T072 Verify tests PASS (green phase)

### CLI Integration Tests (Write FIRST)

- [ ] T073 [P] Write integration test for complete "add task" flow in tests/integration/test_cli_operations.py
- [ ] T074 [P] Write integration test for complete "view tasks" flow in tests/integration/test_cli_operations.py
- [ ] T075 [P] Write integration test for complete "update task" flow in tests/integration/test_cli_operations.py
- [ ] T076 [P] Write integration test for complete "delete task" flow in tests/integration/test_cli_operations.py
- [ ] T077 [P] Write integration test for complete "mark complete" flow in tests/integration/test_cli_operations.py
- [ ] T078 [P] Write integration test for error handling (invalid IDs, empty inputs) in tests/integration/test_cli_operations.py
- [ ] T079 Verify tests FAIL (red phase)

### CLI Implementation

- [ ] T080 Generate ConsoleApp with interactive menu in src/interface/cli/console_app.py via Claude Code
- [ ] T081 Generate main.py entry point with dependency injection in src/main.py via Claude Code
- [ ] T082 Verify integration tests PASS (green phase)
- [ ] T083 Verify interface coverage ≥ 70%

**Checkpoint**: ✅ CLI complete - interactive console app fully functional

---

## Phase 9: Documentation & Final Validation

**Purpose**: Complete documentation and run all validation checks

**Duration**: ~1 hour

### Documentation

- [ ] T084 [P] Create README.md with project overview, setup instructions (UV install, uv sync, uv run), and usage guide
- [ ] T085 [P] Create CLAUDE.md documenting Claude Code generation workflow and specs used
- [ ] T086 [P] Add examples to README showing sample CLI interactions
- [ ] T087 [P] Document project structure in README matching plan.md

### Final Validation

- [ ] T088 Run all unit tests: `uv run pytest tests/unit/ -v` (expect all passing)
- [ ] T089 Run all integration tests: `uv run pytest tests/integration/ -v` (expect all passing)
- [ ] T090 Run full test suite with coverage: `uv run pytest --cov=src --cov-report=term-missing --cov-report=html`
- [ ] T091 Verify overall coverage ≥ 80% (constitutional requirement)
- [ ] T092 Run code quality check: `uv run ruff check src/ tests/` (expect zero errors)
- [ ] T093 Run code formatting: `uv run ruff format src/ tests/` (apply formatting)
- [ ] T094 Manually execute Quickstart Test Scenario 1 (Happy Path - all 5 features)
- [ ] T095 Manually execute Quickstart Test Scenario 2 (Error Handling)
- [ ] T096 Manually execute Quickstart Test Scenario 3 (Special Characters)
- [ ] T097 Manually execute Quickstart Test Scenario 4 (ID Management - non-reuse)
- [ ] T098 Manually execute Quickstart Test Scenario 5 (Toggle Completion)
- [ ] T099 Manually execute Quickstart Test Scenario 6 (Empty List)
- [ ] T100 Manually execute Quickstart Test Scenario 7 (Performance - 100+ tasks)
- [ ] T101 Manually execute Quickstart Test Scenario 8 (Whitespace Handling)
- [ ] T102 Verify all acceptance scenarios from spec.md pass
- [ ] T103 Verify all 26 functional requirements (FR-001 to FR-026) satisfied
- [ ] T104 Verify all 10 non-functional requirements (NFR-001 to NFR-010) satisfied
- [ ] T105 Verify performance targets met (operations < 100ms, view < 2s)

**Checkpoint**: ✅ Phase I complete and validated!

---

## Dependencies & Execution Strategy

### Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation: Domain + Infrastructure)
    ↓
    ├─→ Phase 3 (US1: Add Task) ──┐
    ├─→ Phase 4 (US2: View List) ─┤
    ├─→ Phase 5 (US3: Mark Complete) ─┤
    ├─→ Phase 6 (US4: Update Task) ────┤
    └─→ Phase 7 (US5: Delete Task) ────┤
                                        ↓
                            Phase 8 (CLI Interface)
                                        ↓
                            Phase 9 (Documentation & Validation)
```

### Parallel Execution Opportunities

**Phase 2 (Foundational)**:
- After T013 (tests fail): T014, T015, T016 can run in parallel (different files)
- After T021 (tests fail): T022, T023, T024 can run in parallel (different files)

**Phase 3-7 (User Stories)**:
- All 5 user stories (US1-US5) can be developed in parallel AFTER Phase 2 completes
- Within each user story: Test writing tasks can run in parallel

**Phase 8 (CLI)**:
- T067, T068 (test writing) can run in parallel
- T070, T071 (implementation) can run in parallel
- T073-T078 (integration test writing) can run in parallel

**Phase 9 (Documentation)**:
- T084-T087 (documentation) can run in parallel
- T094-T101 (manual testing) can run sequentially or in parallel with multiple testers

### Recommended Execution Order

**For Single Developer (Sequential MVP)**:
1. Complete Phase 1-2 (foundation) - **REQUIRED FIRST**
2. Implement User Story 1 (Add Task - P1) - **MVP**
3. Implement User Story 2 (View List - P2) - **Makes MVP usable**
4. Build CLI for US1 + US2 only - **Quick validation**
5. Add remaining user stories (US3-US5)
6. Complete CLI integration
7. Documentation and validation

**For Team/Parallel Development**:
1. Complete Phase 1-2 (foundation) - **ALL DEVELOPERS WAIT**
2. Split user stories:
   - Dev 1: US1 (Add Task)
   - Dev 2: US2 (View List)
   - Dev 3: US3 (Mark Complete)
   - Dev 4: US4 (Update Task)
   - Dev 5: US5 (Delete Task)
3. One developer builds CLI integration
4. Team conducts validation together

---

## Task Summary

| Phase | Task Count | Duration | Dependencies |
|-------|-----------|----------|--------------|
| Phase 1: Setup | 9 tasks | 30 min | None |
| Phase 2: Foundation | 17 tasks | 2 hrs | Phase 1 |
| Phase 3: US1 (Add) | 9 tasks | 45 min | Phase 2 |
| Phase 4: US2 (View) | 7 tasks | 45 min | Phase 2 |
| Phase 5: US3 (Mark) | 8 tasks | 45 min | Phase 2 |
| Phase 6: US4 (Update) | 9 tasks | 45 min | Phase 2 |
| Phase 7: US5 (Delete) | 7 tasks | 45 min | Phase 2 |
| Phase 8: CLI | 17 tasks | 2 hrs | Phases 3-7 |
| Phase 9: Validation | 22 tasks | 1 hr | Phase 8 |
| **TOTAL** | **105 tasks** | **~9 hrs** | |

**Parallel Opportunities**: 42 tasks marked with [P] can run in parallel (40% of tasks)

---

## Success Criteria

✅ **Phase I Completion Checklist**:
- [ ] All 105 tasks completed and checked off
- [ ] All 5 user stories (US1-US5) fully implemented
- [ ] All 26 functional requirements satisfied
- [ ] All 10 non-functional requirements satisfied
- [ ] Test coverage ≥ 80% overall
- [ ] All acceptance scenarios pass
- [ ] All 8 quickstart test scenarios validated
- [ ] Performance targets met
- [ ] Code passes ruff checks (zero errors)
- [ ] README.md and CLAUDE.md complete
- [ ] No manual code written (all Claude Code generated)
- [ ] Repository pushed to GitHub

🎯 **Quality Metrics**:
- Domain coverage ≥ 90%
- Application coverage ≥ 90%
- Infrastructure coverage ≥ 85%
- Interface coverage ≥ 70%
- Overall coverage ≥ 80%
- Zero ruff errors or warnings
- All performance targets met or exceeded

---

**Tasks Generated**: 2025-12-06  
**Ready for**: `/sp.implement` to begin TDD implementation workflow  
**Next**: Create quality checklists with `/sp.checklist` (optional) or start implementation
