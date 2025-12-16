# Prompt History Record: Fix white buttons and tags

**Date**: 2025-12-14
**Feature**: Phase II - Full-Stack Web Application
**Context**: UX polish request

## User Request
- Some buttons on the landing page appear totally white.
- Some tags on the tasks page appear totally white.
- Make styling professional and aligned with existing color scheme.

## What I Changed
- Updated `specs/002-phase-web-app/spec.md` to record the clarification for fixing white/low-contrast landing buttons and task tags.
- Fixed outline variants to avoid white backgrounds on dark surfaces:
  - `frontend/src/components/ui/button.tsx`: changed `outline` variant from `bg-background` to `bg-transparent`.
  - `frontend/src/components/ui/badge.tsx`: changed `outline` variant from `bg-background` to `bg-transparent`.

## Why
- `bg-background` can resolve to white in the current theme, causing outline buttons/badges to render as white pills on dark pages (and sometimes low-contrast text).
- Using `bg-transparent` preserves the intended “outline” style while staying aligned with existing Tailwind/theme tokens.

## Validation
- Frontend Jest: `npm test` (all tests passed).
- Frontend build: `npm run build` (succeeded).

## Notes
- No UX behavior changes; only styling of outline variants.
