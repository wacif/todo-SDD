# Claude Code Context: DoBot

## Project Overview

**Type**: Full-Stack Multi-User Task Management Application  
**Current Phase**: Phase II (Web Application) - Specification Stage  
**Methodology**: Spec-Driven Development (SDD) + TDD  
**Architecture**: Clean Architecture (4 layers)

## How to Use This Project

### Workflow Order (STRICT)
1. **Specification** (`/sp.specify`) - Write all specs FIRST
2. **Planning** (`/sp.plan`) - Generate task breakdown
3. **Implementation** (`/sp.task`) - Code to pass specs/tests
4. **Validation** - Tests must pass before merging

### Key Specifications

All specifications live in `specs/002-phase-web-app/`:

- **spec.md** - 7 user stories (US-W1 to US-W7)
- **architecture.md** - System design, JWT flow, ADRs
- **database/schema.md** - PostgreSQL schema, migrations
- **api/rest-endpoints.md** - 8 REST endpoints
- **ui/components.md** - 15 React components
- **ui/pages.md** - 7 Next.js pages
- **features/** - Feature-specific details

### Monorepo Structure

```
/frontend/      # Next.js 16 + TypeScript + Tailwind
/backend/       # FastAPI + SQLModel + PostgreSQL
/src/           # Phase I console app (reference)
/specs/         # All specifications (read these FIRST)
```

### Tech Stack (Phase II)

**Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3.4, Better Auth  
**Backend**: FastAPI, Python 3.13, SQLModel, PyJWT  
**Database**: Neon Serverless PostgreSQL 15  
**Auth**: Better Auth + JWT (7-day expiry)

### Development Commands

```bash
# Frontend
cd frontend && npm run dev    # Start Next.js dev server

# Backend
cd backend && uvicorn main:app --reload  # Start FastAPI server

# Tests
pytest tests/                 # Run Python tests
npm test                      # Run React tests
```

### Important Notes

⚠️ **Never implement before specs are complete**  
⚠️ **Always read specifications before coding**  
⚠️ **Follow Clean Architecture layers strictly**  
⚠️ **JWT token required for all /api/{user_id}/* endpoints**

---
For detailed patterns, see `frontend/CLAUDE.md` and `backend/CLAUDE.md`

## Active Technologies
- Neon Serverless PostgreSQL 15+ (cloud-hosted, connection pooling included) (002-phase-web-app)
- TypeScript 5.3+, React 19, Next.js 16 (App Router with Turbopack) + Next.js, React, Tailwind CSS, Zod (validation), better-auth (auth state detection) (003-landing-page)
- N/A (static landing page, no server-side data storage) (003-landing-page)
- TypeScript 5.3+ (frontend), Python 3.13+ (backend - no changes) + Next.js 16.0, React 19.0, Tailwind CSS 3.4, Framer Motion 12.23, Lucide React (003-landing-page)
- N/A (frontend-only changes, existing PostgreSQL backend unchanged) (003-landing-page)

## Recent Changes
- 002-phase-web-app: Added Neon Serverless PostgreSQL 15+ (cloud-hosted, connection pooling included)
