---
id: 0012
title: Update tasks for new plan
stage: tasks
date: 2025-12-14
surface: vscode
model: GPT-5.2 (Preview)
feature: 002-phase-web-app
branch: 002-phase2-alignment
user: wasi
command: /sp.task
labels: [phase-ii, tasks, completion-hardening]
links:
  spec: specs/002-phase-web-app/spec.md
  ticket: N/A
  adr: N/A
  pr: N/A
files:
  - specs/002-phase-web-app/tasks.md
tests:
  - N/A
---

## Prompt

/sp.task please update the tasks according to the new plan. then we are good to go

## Response snapshot

Updated `specs/002-phase-web-app/tasks.md` to align with the new “Phase II completion hardening” plan by correcting stale frontend paths to the current `frontend/src/` layout, adding a new Phase 11 “Completion Hardening” task set (Better Auth Jest stubs, design-token alignment, Footer export fix, TaskCard accessibility/status text, status doc update), and updating summary counts/dependencies accordingly.

## Outcome

- ✅ Impact: Phase II tasks now reflect completion-hardening work and current frontend layout.
- 🧪 Tests: Not run (tasks/documentation update only).
- 📁 Files: Updated `specs/002-phase-web-app/tasks.md`.
- 🔁 Next prompts: Run implementation starting at T086 (Better Auth Jest stubs) and continue through T097 gates.
- 🧠 Reflection: Keeping tasks executable required correcting stale frontend paths.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement T086-T088 to unblock Jest from Better Auth ESM.

