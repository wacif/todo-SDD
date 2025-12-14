# Implementation Plan: Phase II — Authenticated Web DoBot App

**Branch**: `001-phase2-web-app` | **Date**: 2025-12-12 | **Spec**: `specs/001-phase2-web-app/spec.md`
**Input**: Feature specification from `specs/001-phase2-web-app/spec.md`

## Summary

Phase II will be delivered by integrating the updated Phase I/II specs into the existing implementation branch (`feat/dashboard-redesign`) and then aligning the already-built Phase II code to match the spec-required intermediate features (priority, categories/tags, search/filter, sort) with tests mapped to acceptance scenarios.

## Technical Context

**Language/Version**: Python (backend), TypeScript (frontend)  
**Primary Dependencies**: Next.js (frontend), FastAPI + SQLModel (backend), Better Auth (auth)  
**Storage**: PostgreSQL (Neon)  
**Testing**: pytest (backend), Jest (frontend)  
**Target Platform**: Linux dev + deployed web app  
**Project Type**: Web application (monorepo: `frontend/` + `backend/`)  

## Constitution Check

- [x] Spec-first: Phase II spec exists and is current
- [x] No manual code: implementation work will be generated from specs/tasks
- [ ] Test mapping: acceptance scenarios mapped to tests (completed in this plan; implemented in alignment branch)
- [x] Clean architecture: changes scoped to API/use-cases/storage/UI
- [x] Phase alignment: includes required Phase II intermediate features
- [x] Security: auth boundary + per-user isolation is explicit
- [ ] Documentation: Context7 used for any new library docs (record gaps if any)
- [x] Repo layout: monorepo boundaries respected

## Project Structure

```text
backend/
  src/
  tests/
frontend/
  app/
  src/
  tests/
specs/001-phase2-web-app/
  spec.md
  plan.md
  checklists/
```

## Merge Strategy (Specs + Existing Code)

**Target integration branch for Phase II code**: `feat/dashboard-redesign` (contains the existing implementation through Phase II).

**Step order**:
1. PR: `001-phase2-web-app` → `feat/dashboard-redesign` (docs-only: adds Phase I + Phase II specs, checklist, this plan).
2. Create an alignment branch off updated `feat/dashboard-redesign` (e.g., `002-phase2-alignment` or via Spec-Kit) for code/test changes.
3. PR: alignment branch → `feat/dashboard-redesign` (tests + implementation updates to meet Phase II spec).

**Why this order**: Specs become the source of truth first; then code is adjusted to match.

## Scope Breakdown (Phase II)

### In-Scope (per Phase II spec)

- Authentication required for tasks + sign-out
- Per-user task isolation (cannot read/write other users’ tasks)
- Persisted tasks (survive refresh and future sessions)
- Task CRUD + completion toggle
- **Intermediate features**:
  - Priority (high/medium/low)
  - Categories/tags
  - Search (keyword)
  - Filter (status/priority/tag)
  - Sort (at least priority and alphabetical)

### Out-of-Scope

- Phase III chat UI, reminders, recurring tasks
- Phase IV Kubernetes work
- Phase V event streaming / distributed runtime

## Acceptance Scenario → Test Mapping

### P1: Sign In And See My Tasks

- Backend integration test: unauthenticated request to tasks returns unauthorized
- Frontend e2e/manual smoke: signed-in redirect works and tasks page renders

### P2: Create, Edit, And Delete Tasks

- Backend integration tests:
  - create task (valid title)
  - update task (title/description)
  - delete task
  - persistence check via DB-backed repository

### P3: Organize, Find, And Sort Tasks

- Backend integration tests:
  - filter by status
  - filter by priority
  - filter by tag
  - keyword search
  - sort by priority
  - sort alphabetical
- Frontend component/integration tests:
  - filter/sort/search controls update visible list

## Phase II Alignment Work Items (Implementation)

1. **Data model alignment**
   - Add fields needed for priority + tags/categories
   - Ensure migrations are in place

2. **API contract alignment**
   - Extend task create/update payloads for priority/tags
   - Add query params for search/filter/sort
   - Ensure responses include the new fields

3. **Authorization and isolation**
   - Verify every task query is scoped to the authenticated user
   - Confirm error responses do not leak task existence across users

4. **Frontend UX alignment (minimal)**
   - Controls for priority/tags entry
   - Search box + filters + sorting
   - Clear empty states and error feedback

5. **Tests-first execution**
   - Add/adjust tests to match acceptance scenarios
   - Confirm tests fail before code changes
   - Implement changes and confirm green

## Risks / Open Questions

- Confirm which intermediate features are already implemented on `feat/dashboard-redesign` (priority/tags/search/filter/sort) vs still missing.
- Decide the minimal supported sort options beyond the required two (priority, alphabetical) without expanding scope.
