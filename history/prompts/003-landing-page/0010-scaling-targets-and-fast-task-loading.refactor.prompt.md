---
id: 0010
title: scaling targets and fast task loading
stage: refactor
date: 2025-12-14
surface: vscode
model: GPT-5.2 (Preview)
feature: 003-landing-page
branch: 002-phase2-alignment
user: wasi
command: /sp.clarify (continued)
labels: [perf, ux, scaling]
links:
  spec: specs/002-phase-web-app/spec.md
  ticket:
  adr:
  pr: https://github.com/wacif/todo-SDD/pull/9
files:
  - specs/002-phase-web-app/spec.md
  - frontend/app/(dashboard)/tasks/page.tsx
tests:
  - frontend: npm test
  - frontend: npm run build
---

## Prompt

User requested a scaling plan and provided concrete scale targets:
- 5,000 concurrent users
- 10,000 tasks per user
- Login → tasks usable: ≤ 1.5s p95
- Filter/sort: UI updates ≤ 250ms; data refresh ≤ 500ms p95 when networked

User also noted Redis is available and shared sample code including an Upstash URL/token.
Credential note: the Upstash token is treated as a secret and is not stored in repo files.

## Response snapshot

- Recorded scaling targets in `specs/002-phase-web-app/spec.md` clarifications and noted Redis availability via env vars.
- Implemented first performance wins on Tasks page:
  - Removed duplicate initial load and fetch immediately on first query.
  - Added request cancellation (AbortController) for rapid filter changes.
  - Added simple in-memory cache keyed by query string to make filter toggles feel instant.
- Validated: frontend Jest + Next.js build green.

## Outcome

- ✅ Impact: Faster login-to-tasks and snappier filters; fewer redundant requests.
- 🧪 Tests: `frontend` Jest pass; `frontend` build pass.
- 📁 Files: Updated spec clarifications; improved Tasks page fetch behavior.
- 🔁 Next prompts: Add backend pagination + DB indexes; optional Redis caching with safe invalidation; load testing.
- 🧠 Reflection: Prevented accidental secret leakage by not persisting Redis credentials.

## Evaluation notes (flywheel)

- Failure modes observed: Risk of committing user-provided credentials.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add backend-side pagination defaults and indexes; measure p95 list latency with a seed dataset.
