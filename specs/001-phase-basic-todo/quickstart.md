# Quickstart Guide: Phase I Testing Scenarios

**Created**: 2025-12-06  
**Feature**: 001-phase-basic-todo  
**Purpose**: End-to-end testing scenarios for validating Phase I implementation

## Prerequisites

```bash
# Install UV (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone repository
git clone git@github.com:wacif/todo-SDD.git
cd todo-SDD

# Switch to Phase I branch
git checkout 001-phase-basic-todo

# Install dependencies
uv sync

# Run tests
uv run pytest
```

## Test Scenario 1: Happy Path - Basic Todo Workflow

**Objective**: Verify all 5 core features work in sequence.

**Steps**:
1. Start application: `uv run python src/main.py`
2. Add first task:
   - Select "Add Task" (option 1)
   - Title: "Buy groceries"
   - Description: "Milk, eggs, bread"
   - Expected: Task created with ID 1, status incomplete (○)

3. Add second task:
   - Select "Add Task" (option 1)
   - Title: "Write documentation"
   - Description: "Complete README and setup guide"
   - Expected: Task created with ID 2, status incomplete (○)

4. View all tasks:
   - Select "View Tasks" (option 2)
   - Expected: Display 2 tasks with IDs, titles, descriptions, and ○ symbols

5. Mark task 1 complete:
   - Select "Mark Complete" (option 5)
   - Task ID: 1
   - Expected: Task 1 now shows ✓ symbol

6. Update task 2:
   - Select "Update Task" (option 3)
   - Task ID: 2
   - New title: "Write comprehensive documentation"
   - New description: "Include API docs and examples"
   - Expected: Task 2 updated, ID and status unchanged

7. View tasks again:
   - Expected: Task 1 complete (✓), Task 2 incomplete (○) with updated text

8. Delete task 1:
   - Select "Delete Task" (option 4)
   - Task ID: 1
   - Expected: Task 1 removed from list

9. View tasks final:
   - Expected: Only task 2 visible

10. Exit application:
    - Select "Exit" (option 6)
    - Expected: Warning about losing data, application closes cleanly

**Success Criteria**:
- All operations complete without errors
- Task statuses update correctly
- Deleted tasks don't appear in list
- IDs remain unique and don't reuse deleted IDs

---

## Test Scenario 2: Error Handling - Invalid Inputs

**Objective**: Verify graceful error handling for invalid operations.

**Steps**:
1. Start application
2. Add task with empty title:
   - Select "Add Task"
   - Title: "" (empty)
   - Expected: Error message "Title is required", task not created

3. Add task with title too long (>200 chars):
   - Select "Add Task"
   - Title: "a" * 201
   - Expected: Error message "Title exceeds maximum length", task not created

4. Add valid task (ID will be 1):
   - Title: "Valid task"
   - Description: "Normal task"
   - Expected: Task created successfully

5. Try to update non-existent task:
   - Select "Update Task"
   - Task ID: 999
   - Expected: Error message "Task not found with ID: 999"

6. Try to mark non-existent task complete:
   - Select "Mark Complete"
   - Task ID: 999
   - Expected: Error message "Task not found with ID: 999"

7. Try to delete non-existent task:
   - Select "Delete Task"
   - Task ID: 999
   - Expected: Error message "Task not found with ID: 999"

8. Invalid menu selection:
   - Enter: "99"
   - Expected: Error message "Invalid selection", show menu again

**Success Criteria**:
- All error messages are user-friendly
- Application doesn't crash on any invalid input
- User returns to menu after each error
- Valid task (ID 1) remains unaffected

---

## Test Scenario 3: Edge Cases - Special Characters & Limits

**Objective**: Verify handling of unicode, emojis, and boundary conditions.

**Steps**:
1. Start application
2. Add task with emoji in title:
   - Title: "🛒 Shopping list"
   - Description: "Buy items 🥛🥚🍞"
   - Expected: Task created with emojis displayed correctly

3. Add task with international characters:
   - Title: "学习中文 (Learn Chinese)"
   - Description: "Practice characters: 你好世界"
   - Expected: Task created, unicode characters display correctly

4. Add task with maximum length title (200 chars):
   - Title: "a" * 200
   - Description: "Testing max length"
   - Expected: Task created successfully

5. Add task with maximum length description (1000 chars):
   - Title: "Long description test"
   - Description: "a" * 1000
   - Expected: Task created successfully

6. View all tasks:
   - Expected: All 4 tasks visible with proper formatting

7. Update task with special characters:
   - Task ID: 1
   - New title: "Updated with symbols: @#$%^&*()"
   - Expected: Update successful, symbols displayed correctly

**Success Criteria**:
- Emojis display correctly (or gracefully degrade)
- International characters (UTF-8) supported
- Maximum length fields accepted
- Special characters don't break formatting

---

## Test Scenario 4: ID Management - Non-Reuse After Deletion

**Objective**: Verify IDs are never reused after task deletion.

**Steps**:
1. Start application
2. Add 5 tasks:
   - Task 1: "First"
   - Task 2: "Second"
   - Task 3: "Third"
   - Task 4: "Fourth"
   - Task 5: "Fifth"
   - Expected: IDs 1-5 assigned sequentially

3. Delete tasks 2 and 4:
   - Delete ID 2
   - Delete ID 4
   - Expected: Only tasks 1, 3, 5 remain

4. Add 2 new tasks:
   - Task: "Sixth"
   - Task: "Seventh"
   - Expected: New tasks get IDs 6 and 7 (NOT 2 and 4)

5. View all tasks:
   - Expected: Tasks with IDs [1, 3, 5, 6, 7] visible
   - IDs 2 and 4 are NOT reused

**Success Criteria**:
- Deleted IDs never reused
- ID counter monotonically increases
- Task order by creation time maintained

---

## Test Scenario 5: Toggle Completion Status

**Objective**: Verify completion status toggles correctly.

**Steps**:
1. Start application
2. Add task (ID 1):
   - Title: "Toggleable task"
   - Expected: Status incomplete (○)

3. Mark complete:
   - Task ID: 1
   - Expected: Status changes to complete (✓)

4. View task:
   - Expected: Task 1 shows ✓

5. Mark incomplete (toggle back):
   - Task ID: 1
   - Expected: Status changes to incomplete (○)

6. View task:
   - Expected: Task 1 shows ○

7. Mark complete twice (idempotent):
   - Task ID: 1 (mark complete)
   - Task ID: 1 (mark complete again)
   - Expected: Status remains complete (✓), no error

**Success Criteria**:
- Status toggles between complete/incomplete
- Visual indicators (✓/○) update correctly
- Operation is idempotent (safe to repeat)
- No data corruption from repeated toggles

---

## Test Scenario 6: Empty List Handling

**Objective**: Verify graceful handling of empty task list.

**Steps**:
1. Start application (fresh, no tasks)
2. View tasks:
   - Expected: Message "No tasks found. Add your first task!"

3. Try to update non-existent task:
   - Task ID: 1
   - Expected: Error "Task not found with ID: 1"

4. Try to delete non-existent task:
   - Task ID: 1
   - Expected: Error "Task not found with ID: 1"

5. Add first task:
   - Title: "First task"
   - Expected: Task created with ID 1

6. Delete the only task:
   - Task ID: 1
   - Expected: Task deleted

7. View tasks:
   - Expected: Back to empty list message

**Success Criteria**:
- Empty list displays helpful message
- Operations on empty list don't crash
- Adding first task works correctly
- Deleting last task returns to empty state

---

## Test Scenario 7: Large Task Count Performance

**Objective**: Verify performance with many tasks (up to 1000).

**Steps**:
1. Start application
2. Add 100 tasks via automation:
   - Use script or repeated commands
   - Titles: "Task 1", "Task 2", ..., "Task 100"
   - Expected: All 100 tasks created with sequential IDs

3. View all tasks:
   - Expected: Display completes in < 2 seconds
   - All 100 tasks visible

4. Update task 50:
   - Task ID: 50
   - New title: "Updated Task 50"
   - Expected: Update completes in < 100ms

5. Mark task 75 complete:
   - Task ID: 75
   - Expected: Status update in < 100ms

6. Delete task 25:
   - Task ID: 25
   - Expected: Deletion in < 100ms

7. Add task 101:
   - Expected: New ID is 101, operation < 100ms

**Success Criteria**:
- All operations complete within performance targets
- No degradation with 100+ tasks
- Memory usage remains reasonable (< 50MB)
- Display remains readable and formatted

---

## Test Scenario 8: Input Validation - Whitespace Handling

**Objective**: Verify proper handling of whitespace in inputs.

**Steps**:
1. Start application
2. Add task with whitespace-only title:
   - Title: "   " (spaces only)
   - Expected: Error "Title cannot be empty"

3. Add task with leading/trailing whitespace:
   - Title: "  Valid task  "
   - Description: "  Some description  "
   - Expected: Task created (whitespace may be trimmed or preserved)

4. Add task with empty description:
   - Title: "No description task"
   - Description: "" (empty)
   - Expected: Task created successfully (description optional)

5. View tasks:
   - Expected: Tasks display correctly, whitespace handled appropriately

**Success Criteria**:
- Whitespace-only titles rejected
- Leading/trailing whitespace handled consistently
- Empty descriptions allowed
- Display formatting not broken by whitespace

---

## Automated Test Execution

**Unit Tests**:
```bash
# Run all unit tests
uv run pytest tests/unit/ -v

# Run with coverage
uv run pytest tests/unit/ --cov=src --cov-report=term-missing

# Expected: 80%+ coverage
```

**Integration Tests**:
```bash
# Run integration tests
uv run pytest tests/integration/ -v

# Run all tests
uv run pytest -v
```

**Linting & Formatting**:
```bash
# Check code quality
uv run ruff check src/ tests/

# Format code
uv run ruff format src/ tests/
```

---

## Expected Test Results Summary

| Test Scenario | Pass Criteria | Duration |
|---------------|---------------|----------|
| 1. Happy Path | All 5 features work | < 2 min |
| 2. Error Handling | Graceful errors, no crashes | < 2 min |
| 3. Special Characters | UTF-8/emoji support | < 1 min |
| 4. ID Management | IDs never reused | < 1 min |
| 5. Toggle Status | Complete/incomplete toggles | < 1 min |
| 6. Empty List | Helpful messages | < 1 min |
| 7. Performance | 100+ tasks, < 2s display | < 3 min |
| 8. Whitespace | Proper validation | < 1 min |

**Total Manual Testing Time**: ~12 minutes  
**Automated Test Execution**: < 1 minute

## Success Metrics

✅ **Must Pass**:
- All acceptance scenarios from spec.md validated
- All 8 quickstart test scenarios pass
- Unit test coverage ≥ 80%
- No crashes or unhandled exceptions
- All error messages user-friendly

🎯 **Quality Indicators**:
- Performance targets met (< 100ms operations)
- Clean code (passes ruff checks)
- Type hints on all functions
- Clear console output formatting
- Professional error handling
