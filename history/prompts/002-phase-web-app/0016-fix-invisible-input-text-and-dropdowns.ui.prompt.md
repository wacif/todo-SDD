# Prompt History Record: Fix invisible input text and dropdown readability

**Date**: 2025-12-14
**Feature**: Phase II - Full-Stack Web Application

## User Report
- Clicking "New Task" opens a modal, but typed text is not visible in inputs.
- Dropdown boxes for order/sort/priority look bad / are hard to read.

## Root Cause
- Shared `Input` component used `text-foreground` while Task modal inputs were styled with dark backgrounds, producing low-contrast/invisible typed text.
- Native `<select>` option menus could render with light backgrounds but inherited light text (or vice versa), making options hard to read.

## Changes
- `frontend/src/components/ui/input.tsx`
  - Switched default input styling to dark-theme-friendly base classes (`bg-gray-900/50`, `text-white`, `placeholder:text-gray-500`, `border-gray-800`, indigo focus ring).
- `frontend/src/components/dashboard/TaskForm.tsx`
  - Styled `<option>` entries for the priority dropdown to ensure readable option menu.
- `frontend/app/(dashboard)/tasks/page.tsx`
  - Styled `<option>` entries for Priority / Sort / Order selects for readable option menus.
- `specs/002-phase-web-app/spec.md`
  - Added clarification bullets for input visibility and dropdown readability.

## Validation
- Run frontend Jest and Next.js build after applying changes.
