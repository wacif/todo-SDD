# Phase II: Full-Stack Web Application - Overview

**Phase Branch**: `002-phase-web-app`  
**Created**: 2025-12-07  
**Status**: In Progress  
**Previous Phase**: Phase I - Basic Todo Management (Console App)

## Objective

Transform the console application into a modern multi-user web application with persistent storage, RESTful API, and user authentication.

## Current Phase Status

**Phase II: Full-Stack Web Application** - Transform console app to web app

### What We're Building

A complete full-stack web application that:
- ✅ Implements all 5 Basic Level features from Phase I as a web application
- ✅ Provides RESTful API endpoints for task management
- ✅ Stores data persistently in Neon Serverless PostgreSQL
- ✅ Supports multiple users with authentication (Better Auth)
- ✅ Uses JWT tokens to secure API access
- ✅ Provides responsive web interface built with Next.js

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 16+ (App Router) | React-based web framework |
| UI Styling | Tailwind CSS | Utility-first CSS framework |
| Backend | Python FastAPI | High-performance API framework |
| ORM | SQLModel | Type-safe database operations |
| Database | Neon Serverless PostgreSQL | Cloud-native PostgreSQL |
| Authentication | Better Auth | Modern auth library for Next.js |
| Token Format | JWT | Stateless authentication |
| Development | Claude Code + Spec-Kit Plus | AI-powered spec-driven development |

## Architecture Evolution

### Phase I (Console App)
```
┌─────────────────────────────────────┐
│     Console Interface (CLI)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Application Layer              │
│  (Use Cases: Add, List, Update...)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Domain Layer                 │
│    (Task Entity, Repositories)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer              │
│  (In-Memory Task Repository)        │
└─────────────────────────────────────┘
```

### Phase II (Full-Stack Web App)
```
┌────────────────────────────────────────────────────────┐
│               Frontend (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Auth Pages   │  │ Task Pages   │  │  Components  │ │
│  │ (Login/      │  │ (List/Edit/  │  │ (TaskCard,   │ │
│  │  Signup)     │  │  Create)     │  │  TaskForm)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │         Better Auth (Session + JWT)             │  │
│  └─────────────────────────────────────────────────┘  │
└────────────────────┬───────────────────────────────────┘
                     │ HTTP + JWT Token
                     │
┌────────────────────▼───────────────────────────────────┐
│              Backend (FastAPI)                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │      JWT Middleware (Token Verification)        │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ API Routes   │  │  Use Cases   │  │   Models     │ │
│  │ (/api/tasks) │→ │ (Add, List)  │→ │ (Task, User) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │           SQLModel ORM Layer                    │  │
│  └─────────────────────────────────────────────────┘  │
└────────────────────┬───────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────┐
│         Neon Serverless PostgreSQL                      │
│  ┌──────────────┐          ┌──────────────┐           │
│  │ users table  │          │ tasks table  │           │
│  │ (Better Auth)│          │ (App Data)   │           │
│  └──────────────┘          └──────────────┘           │
└─────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Multi-User Support
- Each user has their own isolated task list
- User authentication required for all operations
- Tasks are filtered by authenticated user ID

### 2. Persistent Storage
- All data stored in Neon PostgreSQL database
- Survives application restarts
- ACID-compliant transactions

### 3. RESTful API
- Standard HTTP methods (GET, POST, PUT, DELETE, PATCH)
- JSON request/response format
- JWT token authentication on all endpoints

### 4. Modern Web Interface
- Responsive design (mobile, tablet, desktop)
- Server-side rendering with Next.js
- Real-time updates after operations

### 5. Secure Authentication
- Better Auth for user signup/signin
- JWT tokens for stateless authentication
- Token expiry and refresh handling
- Password hashing and validation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login user (get JWT) |
| GET | `/api/{user_id}/tasks` | List all user's tasks |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

## Security Model

### JWT Token Flow

1. **User Login** → Better Auth creates session + issues JWT token
2. **Frontend Request** → Includes `Authorization: Bearer <token>` header
3. **Backend Verification** → FastAPI middleware verifies JWT signature
4. **User Extraction** → Decodes token to get user ID
5. **Authorization** → Matches user ID in token with user ID in URL
6. **Data Filtering** → Returns only authenticated user's tasks

### Shared Secret

Both frontend and backend use same secret key (`BETTER_AUTH_SECRET`) for:
- Frontend: JWT signing when issuing tokens
- Backend: JWT verification when validating requests

## Data Models

### User (Better Auth Managed)
```typescript
{
  id: string (UUID)
  email: string (unique)
  name: string
  passwordHash: string
  createdAt: timestamp
}
```

### Task (Application Managed)
```typescript
{
  id: integer (auto-increment)
  userId: string (foreign key → users.id)
  title: string (1-200 chars)
  description: string? (0-1000 chars)
  completed: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Development Workflow

1. **Read Spec** → `@specs/002-phase-web-app/features/[feature].md`
2. **Implement Backend** → FastAPI routes, SQLModel models, database
3. **Implement Frontend** → Next.js pages, components, API client
4. **Test** → Unit tests (backend), integration tests (API), E2E tests (UI)
5. **Iterate** → Update spec if requirements change

## Success Criteria

| Criterion | Target | Phase I | Phase II |
|-----------|--------|---------|----------|
| User Stories | 5 | ✅ Console | 🎯 Web UI |
| Storage | - | ✅ In-Memory | 🎯 PostgreSQL |
| Authentication | - | ❌ None | 🎯 Better Auth |
| API | - | ❌ None | 🎯 REST API |
| Multi-User | - | ❌ Single | 🎯 Multi-User |
| Test Coverage | ≥80% | ✅ 100% | 🎯 ≥80% |

## Project Structure (Monorepo)

```
todo-app/
├── .spec-kit/              # Spec-Kit configuration
│   └── config.yaml
├── specs/                  # All specifications
│   ├── 001-phase-basic-todo/    # Phase I specs
│   └── 002-phase-web-app/       # Phase II specs (current)
│       ├── overview.md          # This file
│       ├── architecture.md      # System design
│       ├── features/            # Feature specifications
│       ├── api/                 # API specifications
│       ├── database/            # Database schema
│       └── ui/                  # UI specifications
├── src/                    # Phase I console app (preserved)
├── frontend/               # Next.js application
│   ├── CLAUDE.md
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/                # FastAPI application
│   ├── CLAUDE.md
│   ├── main.py
│   ├── models/
│   ├── routes/
│   └── db.py
├── docker-compose.yml      # Container orchestration
├── CLAUDE.md               # Root context for Claude Code
└── README.md               # Project documentation
```

## Constitutional Alignment

| Principle | Phase I | Phase II |
|-----------|---------|----------|
| I. Spec-Driven Development | ✅ Complete specs | 🎯 Organized specs with Spec-Kit |
| II. Progressive Evolution | ✅ Foundation | 🎯 Building on Phase I |
| III. Test-First TDD | ✅ 108 tests | 🎯 Maintain ≥80% coverage |
| IV. Clean Architecture | ✅ 4 layers | 🎯 Extended to frontend/backend |
| V. Feature Completeness | ✅ 5 features | 🎯 Same 5 features as web app |
| VI. AI Integration | ✅ Claude Code | 🎯 Claude Code + Spec-Kit Plus |
| VII. Cloud-Native | ⏳ Planned | 🎯 Neon PostgreSQL, Docker |

## Next Steps

1. ✅ Create monorepo structure
2. ✅ Write Phase II specifications
3. 🎯 Design system architecture
4. 🎯 Define database schema
5. 🎯 Document API endpoints
6. 🎯 Plan UI components
7. 🎯 Create implementation tasks

## References

- Phase I Implementation: `specs/001-phase-basic-todo/`
- Phase I Branch: `001-phase-basic-todo`
- Phase II Branch: `002-phase-web-app` (to be created)
- Tech Stack Documentation: Links in respective CLAUDE.md files
