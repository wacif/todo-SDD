---
name: "phr-0011-better-auth-jwks-and-tasks-loading.refactor"
description: "stage=refactor | date=2025-12-12 | surface=VS Code | feature=002-phase-web-app | branch=feat/dashboard-redesign | user=wasi | command=/sp.git.commit_pr | labels=auth,backend,frontend,migrations | spec=specs/002-phase-web-app/ | pr=https://github.com/wacif/todo-SDD/pull/5"
model: "GPT-5.2 (Preview)"
---

## Prompt

perfect now the working tree is so messy. please clean it. /sp.git.commit_pr

## Response snapshot

- Removed accidental/unwanted untracked root `package.json`.
- Fixed backend Better Auth compatibility: EdDSA JWT verification via JWKS + consistent string `user_id` + DB migration for `tasks.user_id`.
- Fixed frontend `/tasks` infinite loading by hydrating token/user from Better Auth session when localStorage is empty; aligned task ids and completion method.
- Committed changes, pushed branch, and created PR: https://github.com/wacif/todo-SDD/pull/5

## Outcome

- ✅ Impact: Better Auth sign-in no longer loops on `/tasks`; backend accepts Better Auth tokens and user IDs.
- 🧪 Tests: Frontend `npm run build` PASS; backend `pytest` PASS (108 tests earlier in-session).
- 📁 Files: 35 files changed; added backend migration + Better Auth Next.js handler.
- 🔁 Next prompts: Verify Google OAuth callback and end-to-end task CRUD after social login.
- 🧠 Reflection: Root cause was mismatched JWT alg/key material (EdDSA/JWKS) and UUID-vs-string user IDs, plus a frontend token persistence gap after redirects.

## Evaluation notes (flywheel)

- Failure modes observed: Missing `cryptography` in runtime venv caused backend boot failure until installed.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add a tiny E2E test that signs in and fetches `/api/{userId}/tasks` with the issued token.
