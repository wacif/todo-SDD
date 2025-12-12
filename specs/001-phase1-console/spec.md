# Feature Specification: Phase I — In-Memory Console Todo

**Feature Branch**: `001-phase1-console`  
**Created**: 2025-12-12  
**Status**: Draft  
**Phase**: Phase I  
**Input**: User description: "Phase I: In-memory Python console todo app (spec rewrite to match Hackathon II requirements and current implementation)"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 — Manage Tasks From The Terminal (Priority: P1)

As a user, I can add, list, update, delete, and complete tasks using a console interface so I can manage my todo list without a web browser.

**Why this priority**: This is the required MVP for Phase I and is the foundation for all later phases.

**Independent Test**: In a fresh run, I can perform create/list/update/delete/complete actions and observe correct results.

**Acceptance Scenarios**:

1. **Given** the app is running with an empty in-memory task list, **When** I add a task with a title and optional description, **Then** the task is created with a unique ID and is initially incomplete.
2. **Given** at least one task exists, **When** I list tasks, **Then** I see all tasks with their ID, title, and completion status.
3. **Given** a task exists, **When** I update the task title and/or description, **Then** the updated values are shown when I view the task list.
4. **Given** a task exists, **When** I delete the task by its ID, **Then** it no longer appears in the task list.
5. **Given** a task exists, **When** I toggle completion status by task ID, **Then** the status changes and is visible when listing tasks.

---

### User Story 2 — Get Clear Feedback For Invalid Input (Priority: P2)

As a user, I get clear messages when I provide invalid input (e.g., empty title, unknown task ID) so I can fix mistakes quickly.

**Why this priority**: Improves usability and ensures the app is demo-ready.

**Independent Test**: I can intentionally provide invalid inputs and see the app reject the action without crashing.

**Acceptance Scenarios**:

1. **Given** the app is running, **When** I try to add a task with an empty title, **Then** the task is not created and I see a message explaining what is required.
2. **Given** no task exists with ID X, **When** I try to update/delete/toggle completion for task ID X, **Then** the action is rejected and I see a message indicating the task was not found.

---

### User Story 3 — Provide Reviewer-Ready Deliverables (Priority: P3)

As a hackathon participant, I can show a clean structure, documentation, and tests so reviewers can validate Phase I quickly.

**Why this priority**: The hackathon explicitly evaluates spec-driven, test-driven delivery.

**Independent Test**: A reviewer can follow the documented setup to run the app and run tests successfully.

**Acceptance Scenarios**:

1. **Given** the repository is cloned, **When** a reviewer follows the documented setup steps, **Then** they can run the console app and perform the P1 workflow.
2. **Given** the Phase I spec exists, **When** a reviewer runs the test suite, **Then** the core acceptance scenarios for the P1 workflow are covered by tests.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- Attempt to add a task with whitespace-only title
- Attempt to delete a task twice
- Attempt to toggle completion for a non-existent ID
- List tasks when there are no tasks
- Update a task but provide no changes (no-op)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST allow users to create a new task with a required title and optional description.
- **FR-002**: System MUST assign each created task a unique ID within the current app run.
- **FR-003**: System MUST store tasks only in memory for the duration of the running process.
- **FR-004**: System MUST allow users to list all tasks and see each task’s ID, title, and completion status.
- **FR-005**: System MUST allow users to update a task’s title and/or description by specifying its ID.
- **FR-006**: System MUST allow users to delete a task by specifying its ID.
- **FR-007**: System MUST allow users to toggle a task’s completion status by specifying its ID.
- **FR-008**: System MUST reject invalid inputs (e.g., empty title, unknown ID) and provide user-friendly feedback without terminating unexpectedly.

### Key Entities *(include if feature involves data)*

- **Task**: A todo item a user wants to track, including an ID, title, optional description, and completion status.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: A user can complete the P1 workflow (add → list → update → toggle complete → delete) in a single run.
- **SC-002**: Invalid input (empty title, unknown ID) is handled with clear feedback and without crashing.
- **SC-003**: A reviewer can verify all P1 acceptance scenarios using either manual steps or tests.
- **SC-004**: The Phase I deliverable is demo-ready: basic operations are discoverable and consistently reported.
