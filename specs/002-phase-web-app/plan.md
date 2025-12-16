# Implementation Plan: Phase II Completion Hardening

**Branch**: `002-phase2-alignment` | **Date**: 2025-12-14 | **Spec**: `specs/002-phase-web-app/spec.md`
**Input**: Feature specification from `specs/002-phase-web-app/spec.md`

## Summary

Phase II is implemented across `backend/` + `frontend/`, but it is not “strict-complete” because the frontend unit suite is red and Phase II status docs are stale. This plan focuses on (1) unblocking Jest from Better Auth ESM imports, (2) aligning UI components to the repo’s Tailwind design tokens (so unit tests/spec expectations match), (3) fixing a few component export/semantics mismatches (e.g., `Footer`, `TaskCard` accessibility), and (4) updating Phase II status/docs to reflect reality.

## Technical Context

**Language/Version**: Python 3.13+ (backend + Phase I reference), TypeScript (frontend)  
**Primary Dependencies**: FastAPI, SQLModel, Alembic, Next.js (App Router), React, Tailwind, Jest/RTL, Better Auth  
**Storage**: PostgreSQL (Neon)  
**Testing**: pytest (root + backend), Jest + React Testing Library (frontend)  
**Target Platform**: Linux (local dev + CI)  
**Project Type**: Monorepo full-stack web app (`frontend/` + `backend/`)  
**Performance Goals**: Keep current targets in `specs/002-phase-web-app/architecture.md`  
**Constraints**: Clean Architecture boundaries; user isolation; secure auth boundaries  
**Scale/Scope**: Hackathon scope per Constitution “Phase II - REQUIRED”

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-first: spec exists and is current (not Deprecated)
- [ ] No manual code: repo already contains implementation; this work is stabilization/alignment
- [x] Test mapping: failures map to UI spec + acceptance expectations (rendering, variants, accessibility)
- [x] Clean architecture: changes confined to `frontend/` UI/test harness and docs (no domain leakage)
- [x] Phase alignment: limited to Phase II required features + verification
- [x] Security: auth boundaries preserved; tests avoid weakening production auth
- [x] Documentation: Context7 used for Jest config patterns (module mapping / transforms)
- [x] Repo layout: monorepo boundaries respected (`frontend/`, `backend/`, `specs/`)

## Project Structure

### Documentation (this feature)

```text
specs/002-phase-web-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
├── tasks.md
└── STATUS.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
└── tests/

frontend/
├── app/
├── src/
│   ├── components/
│   ├── lib/
│   └── styles/
└── tests/

src/      # Phase I console app reference
tests/    # Phase I tests
```

**Structure Decision**: Web application monorepo (`frontend/` + `backend/`). Phase II stabilization work stays in the frontend test harness + UI components + Phase II spec/status docs.

## Phase 0: Research (Delta)

### R0.1 — Jest + ESM dependency strategy

**Problem**: Frontend tests fail to run when importing Better Auth’s `.mjs` ESM modules (e.g., `better-auth/dist/client/react/index.mjs`).

**Decision**: Prefer Jest `moduleNameMapper` + local stubs for Better Auth modules used by unit tests.

**Rationale**:
- Keeps Jest config simple and stable across Better Auth internal build changes.
- Unit tests should not depend on a live auth client; they should validate rendering and component behavior.

**Alternative**: `transformIgnorePatterns` allow-listing `better-auth` for Babel transform. This is a fallback if stubbing proves insufficient.

## Phase 1: Design (Stabilization Targets)

### D1.1 — Better Auth stubs (test harness)

**Goal**: Make all component tests importable without parsing Better Auth’s ESM.

**Design**:
- Add local stubs (CommonJS-compatible) for:
  - `better-auth/react`
  - `better-auth/client/plugins`
- Update `frontend/jest.config.js` `moduleNameMapper` to map those modules to the stubs.
- Keep the stubs minimal: return stable functions used by `frontend/src/lib/auth-client.ts` and components (`signIn`, `signOut`, `useSession`, `createAuthClient`, `jwtClient`).

### D1.2 — Align UI components with Tailwind design tokens

**Problem**: Several UI tests assert token classes (e.g., `bg-primary-600`, `bg-background`, `bg-muted/30`, `border-error`), but components currently hard-code non-token classes (e.g., `bg-indigo-600`, `bg-gray-900/50`, `border-red-500`).

**Design**:
- Refactor shared UI components to use existing Tailwind tokens defined in `frontend/tailwind.config.js`.
- Keep semantics stable (variants/sizes/props), only adjust class composition.

**Targets** (minimum):
- `frontend/src/components/ui/button.tsx`
- `frontend/src/components/ui/card.tsx`
- `frontend/src/components/ui/input.tsx`
- `frontend/src/components/ui/badge.tsx` (if applicable)
- `frontend/src/components/ui/empty-state.tsx`

### D1.3 — Fix landing component export mismatch

**Problem**: `frontend/tests/components/landing/Footer.test.tsx` imports default `Footer`, but `frontend/src/components/landing/Footer.tsx` does not default-export a component.

**Design**:
- Make `Footer` available as both named export and default export, to match test + typical import patterns.

### D1.4 — TaskCard accessibility + status label

**Problems** (from `frontend/tests/components/dashboard/TaskCard.test.tsx`):
- Tests query a `checkbox` role; current toggle is a `button` without `role="checkbox"`.
- Badge container renders without visible “Pending” text.

**Design**:
- Keep current toggle styling, but add `role="checkbox"` and `aria-checked` to the existing toggle element.
- Ensure status badge text is rendered (“Pending” / “Completed”).

## Phase 2: Implementation Steps

### I2.1 — Fix Better Auth ESM in Jest

- Update `frontend/jest.config.js`
  - Add `moduleNameMapper` entries mapping `^better-auth/react$` and `^better-auth/client/plugins$` to local stubs under `frontend/__mocks__/`.
- Add stub modules under `frontend/__mocks__/better-auth/` (or similar path referenced by mapper).
- Gate: `cd frontend && npm test --silent` runs without “unexpected token” / ESM parse failures.

### I2.2 — UI token alignment (make tests/spec expectations true)

- Update shared UI components to use Tailwind tokens:
  - Button primary: `bg-primary-600` (and hover/active) instead of hard-coded indigo.
  - Card: `bg-background border-border text-foreground`.
  - Input: error uses `border-error` (and focus ring), label/asterisk uses token colors.
  - EmptyState: default uses `bg-muted/30`.
  - Badge: ensure variants map to token palette as expected by tests.
- Gate: `frontend/tests/components/ui/*.test.tsx` all green.

### I2.3 — Landing Footer export fix

- Update `frontend/src/components/landing/Footer.tsx` to add a `default` export that matches test import.
- Gate: `frontend/tests/components/landing/Footer.test.tsx` green.

### I2.4 — TaskCard semantics + label visibility

- Update `frontend/src/components/dashboard/TaskCard.tsx`:
  - Toggle element exposes `role="checkbox"` and `aria-checked`.
  - Render visible status badge text (“Pending” when not complete).
- Gate: `frontend/tests/components/dashboard/TaskCard.test.tsx` green.

### I2.5 — Update Phase II status/docs to reflect reality

- Update `specs/002-phase-web-app/STATUS.md`:
  - Replace outdated “US-W1 only / 33/85 tasks” progress with current implementation/test status.
  - Track remaining work as “Frontend stabilization: Better Auth Jest + design token alignment”.
- Optional: if Phase II acceptance is fully met after tests are green, mark phase as complete.

## Validation Gates (Definition of Done)

- Frontend: `cd frontend && npm test --silent` (all green)
- Backend: `cd backend && pytest` (all green)
- Root Phase I: `pytest` (all green)
- Docs: `specs/002-phase-web-app/STATUS.md` reflects current reality and remaining gaps (if any)

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| “No manual code” | Existing repo already has implementation; current work is stabilization/alignment to make specs/tests truthful. | Re-generating the entire Phase II implementation from scratch would be higher risk and out of scope for “completion hardening”. |
