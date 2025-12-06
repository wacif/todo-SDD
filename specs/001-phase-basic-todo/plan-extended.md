# Implementation Plan: Phase I - Basic Todo Management (continued)

## Implementation Phases

### Phase 0: Research & Setup ✅ COMPLETE
- [x] Research technology stack decisions
- [x] Document architecture approach
- [x] Define data model and entities
- [x] Create quickstart test scenarios
- [x] Validate constitution compliance

**Deliverables**:
- research.md with 10 technical decisions
- data-model.md with Task entity specification
- quickstart.md with 8 test scenarios
- plan.md (this document)

---

### Phase 1: Project Scaffolding

**Duration**: ~30 minutes  
**Dependencies**: Phase 0 complete

**Tasks**:
1. Initialize UV project structure
2. Create pyproject.toml with dependencies
3. Set up directory structure (src/, tests/)
4. Configure Ruff for linting/formatting
5. Set up pytest configuration
6. Create .gitignore for Python
7. Initialize README.md and CLAUDE.md

**Deliverables**:
- Working Python project with UV
- All dependencies installed
- Development environment ready
- Initial documentation files

**Acceptance Criteria**:
- `uv sync` runs successfully
- `uv run pytest` executes (no tests yet)
- `uv run ruff check .` passes
- Project structure matches plan.md

---

### Phase 2: Domain Layer (TDD Red Phase)

**Duration**: ~1 hour  
**Dependencies**: Phase 1 complete

**Test-First Approach**:
1. Write tests for Task entity
2. Write tests for domain exceptions
3. Verify tests FAIL (red phase)
4. Generate Task entity via Claude Code
5. Generate exception classes via Claude Code
6. Verify tests PASS (green phase)

**Files to Create**:
```
src/domain/entities/task.py
src/domain/exceptions/domain_exceptions.py
tests/unit/domain/test_task_entity.py
tests/unit/domain/test_domain_exceptions.py
```

**Acceptance Criteria**:
- Task entity with all attributes
- Validation methods implemented
- Custom exceptions defined
- All unit tests passing
- Domain coverage ≥ 90%

---

### Phase 3: Infrastructure Layer (Repository)

**Duration**: ~45 minutes  
**Dependencies**: Phase 2 complete

**Test-First Approach**:
1. Write tests for TaskRepository interface
2. Write tests for InMemoryTaskRepository
3. Verify tests FAIL
4. Generate repository interface via Claude Code
5. Generate in-memory implementation via Claude Code
6. Verify tests PASS

**Files to Create**:
```
src/domain/repositories/task_repository.py (abstract)
src/infrastructure/persistence/in_memory_task_repository.py
tests/unit/infrastructure/test_in_memory_repository.py
```

**Acceptance Criteria**:
- Repository interface defined with Protocol
- InMemoryTaskRepository implements all methods
- ID generation working correctly
- CRUD operations tested
- Infrastructure coverage ≥ 85%

---

### Phase 4: Application Layer (Use Cases)

**Duration**: ~1.5 hours  
**Dependencies**: Phase 3 complete

**Test-First Approach**:
1. Write tests for each use case (5 total)
2. Write tests for DTO classes
3. Verify tests FAIL
4. Generate use cases via Claude Code
5. Generate DTOs via Claude Code
6. Verify tests PASS

**Files to Create**:
```
src/application/use_cases/add_task.py
src/application/use_cases/update_task.py
src/application/use_cases/delete_task.py
src/application/use_cases/mark_task_complete.py
src/application/use_cases/list_tasks.py
src/application/dto/task_dto.py
src/application/dto/task_input_dto.py
tests/unit/application/test_*.py (5 test files)
```

**Acceptance Criteria**:
- All 5 use cases implemented
- DTOs for data transfer
- Use cases don't depend on CLI or infrastructure details
- All unit tests passing
- Application coverage ≥ 90%

---

### Phase 5: Interface Layer (CLI)

**Duration**: ~2 hours  
**Dependencies**: Phase 4 complete

**Test-First Approach**:
1. Write integration tests for CLI operations
2. Write tests for validators and formatters
3. Verify tests FAIL
4. Generate CLI components via Claude Code
5. Generate Rich formatters via Claude Code
6. Verify tests PASS

**Files to Create**:
```
src/interface/cli/console_app.py
src/interface/cli/formatters.py
src/interface/cli/validators.py
src/main.py
tests/integration/test_cli_operations.py
tests/integration/test_use_case_integration.py
```

**Acceptance Criteria**:
- Interactive menu system working
- Rich formatting for task display
- Input validation at interface layer
- All integration tests passing
- End-to-end user flows validated

---

### Phase 6: Configuration & Logging

**Duration**: ~30 minutes  
**Dependencies**: Phase 5 complete

**Files to Create**:
```
src/infrastructure/config/settings.py
src/infrastructure/logging/logger.py
```

**Acceptance Criteria**:
- Centralized configuration
- Structured logging setup
- Log levels configurable
- Logs useful for debugging

---

### Phase 7: Final Integration & Documentation

**Duration**: ~1 hour  
**Dependencies**: Phase 6 complete

**Tasks**:
1. Run all quickstart test scenarios manually
2. Verify 80% coverage target met
3. Complete README.md with setup instructions
4. Complete CLAUDE.md with generation instructions
5. Final code quality check (ruff)
6. Performance validation (operations < 100ms)

**Acceptance Criteria**:
- All 8 quickstart scenarios pass
- pytest coverage ≥ 80%
- README has clear setup steps
- CLAUDE.md documents generation process
- All code passes ruff checks
- Performance targets met

---

## Technology Stack Details

### Core Dependencies

```toml
[project]
name = "todo-app"
version = "0.1.0"
description = "Phase I: In-Memory Todo Console Application"
requires-python = ">=3.13"
dependencies = [
    "rich>=13.7.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-cov>=4.1.0",
    "ruff>=0.1.0",
]
```

### Development Tools

**UV Configuration**:
- Project initialization: `uv init`
- Dependency sync: `uv sync`
- Run commands: `uv run <command>`
- Add dependency: `uv add <package>`

**Ruff Configuration** (.ruff.toml):
```toml
line-length = 100
target-version = "py313"

[lint]
select = ["E", "F", "I", "N", "W"]
ignore = []

[format]
quote-style = "double"
indent-style = "space"
```

**Pytest Configuration** (pyproject.toml):
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "--cov=src --cov-report=term-missing --cov-report=html"
```

---

## Dependency Injection Strategy

**Without Framework** (Phase I simple approach):
```python
# main.py
def main():
    # Infrastructure
    repository = InMemoryTaskRepository()
    
    # Application (inject repository)
    add_task = AddTaskUseCase(repository)
    update_task = UpdateTaskUseCase(repository)
    delete_task = DeleteTaskUseCase(repository)
    mark_complete = MarkTaskCompleteUseCase(repository)
    list_tasks = ListTasksUseCase(repository)
    
    # Interface (inject use cases)
    console_app = ConsoleApp(
        add_task=add_task,
        update_task=update_task,
        delete_task=delete_task,
        mark_complete=mark_complete,
        list_tasks=list_tasks
    )
    
    console_app.run()
```

**Phase II Evolution** (can add proper DI framework):
- Add dependency injection container
- Support multiple repository implementations
- Enable easier testing with mocks

---

## Testing Strategy

### Test Pyramid

```
        /\
       /  \
      /E2E \      <- 10% (Integration tests)
     /------\
    /  Intg  \    <- 20% (Use case integration)
   /----------\
  /    Unit    \  <- 70% (Domain, Application, Infrastructure)
 /--------------\
```

### Coverage Targets by Layer

| Layer | Target Coverage | Rationale |
|-------|----------------|-----------|
| Domain | 95%+ | Pure logic, fully testable |
| Application | 90%+ | Use cases, all paths testable |
| Infrastructure | 85%+ | Repository impl, straightforward |
| Interface | 70%+ | CLI has some I/O complexity |
| **Overall** | **80%+** | Constitutional requirement |

### Test Doubles Strategy

**Phase I** (minimal mocking needed):
- Real InMemoryTaskRepository in most tests (fast, no I/O)
- Mock repository only for testing error paths in use cases

**Phase II** (more mocking):
- Mock database repository for unit tests
- Use test database for integration tests
- Mock external APIs

---

## Performance Targets & Validation

### Operation Time Limits

| Operation | Target | Measurement Method |
|-----------|--------|-------------------|
| Application startup | < 1 second | Time from launch to menu display |
| Add task | < 100ms | Time from input to confirmation |
| Update task | < 100ms | Time from input to confirmation |
| Delete task | < 100ms | Time from input to confirmation |
| Mark complete | < 100ms | Time from input to confirmation |
| View tasks (100) | < 2 seconds | Time to render 100 tasks |
| View tasks (1000) | < 5 seconds | Time to render 1000 tasks |

### Performance Testing

```python
# Example performance test
def test_list_tasks_performance():
    repository = InMemoryTaskRepository()
    # Add 100 tasks
    for i in range(100):
        repository.add(Task(title=f"Task {i}", description="Test"))
    
    # Measure list operation
    start = time.time()
    tasks = repository.get_all()
    duration = time.time() - start
    
    assert duration < 0.1  # Must complete in < 100ms
```

---

## Code Generation Guidelines for Claude

### Input to Claude Code

**Specification Reference**:
- User stories with acceptance scenarios
- Functional requirements (FR-001 through FR-026)
- Non-functional requirements (NFR-001 through NFR-010)
- Data model from data-model.md
- Test scenarios from quickstart.md

**Generation Prompts**:
1. "Generate Task entity from data-model.md with validation"
2. "Generate InMemoryTaskRepository implementing TaskRepository interface"
3. "Generate AddTaskUseCase that validates title and delegates to repository"
4. "Generate CLI menu using Rich library with formatted tables"

**Refinement Process**:
- Start with domain layer (fewest dependencies)
- Generate tests before implementation
- Validate generated code against specs
- Refine specs if generation incorrect
- Iterate until tests pass

---

## Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Claude generates incorrect code | Medium | High | TDD catches errors; iterate specs |
| Rich library formatting issues | Low | Medium | Test on multiple terminals |
| Type hint complexity | Low | Low | Use simple types; avoid complex generics |
| Test coverage < 80% | Low | High | Focus on testable code; add missing tests |
| Performance degradation | Low | Medium | Performance tests; optimize if needed |

### Process Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep to Phase II | Medium | High | Strict adherence to Phase I spec |
| Manual coding temptation | Medium | Critical | Code review; enforce Claude generation |
| Insufficient spec detail | Medium | High | Detailed specs with examples |
| Time pressure shortcuts | Medium | High | Prioritize P1 user stories first |

---

## Definition of Done (Phase I)

### Code Complete Checklist

- [ ] All 5 user stories implemented
- [ ] All 26 functional requirements satisfied
- [ ] All 10 non-functional requirements met
- [ ] Test coverage ≥ 80%
- [ ] All acceptance scenarios pass
- [ ] All 8 quickstart test scenarios validated
- [ ] Performance targets achieved
- [ ] No manual code written (Claude generated only)
- [ ] All code passes ruff checks
- [ ] Type hints on all functions
- [ ] README.md complete with setup instructions
- [ ] CLAUDE.md documents generation process
- [ ] Repository pushed to GitHub
- [ ] PHR created for planning session

### Quality Gates

✅ **Must Pass**:
1. All pytest tests passing
2. Coverage report shows ≥ 80%
3. Ruff check passes with zero errors
4. All quickstart scenarios work
5. Manual testing of all 5 features successful

🎯 **Nice to Have**:
1. Coverage ≥ 90%
2. Zero ruff warnings
3. Performance better than targets
4. Documentation with examples
5. Demo video recorded

---

## Next Steps After Phase I

### Immediate Actions
1. Run `/sp.tasks` to generate task breakdown
2. Create quality checklists with `/sp.checklist`
3. Begin implementation with `/sp.implement`
4. Create ADRs for significant decisions

### Phase II Preparation
- Review Phase II requirements (web app)
- Plan data migration strategy
- Design API contracts
- Prepare for FastAPI + Next.js integration

---

**Plan Status**: ✅ COMPLETE - Ready for task generation  
**Last Updated**: 2025-12-06  
**Next Command**: `/sp.tasks` to generate implementation tasks
