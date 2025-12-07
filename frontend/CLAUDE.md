# Frontend Context: Next.js Application

## Architecture

**Framework**: Next.js 16 with App Router  
**Language**: TypeScript (strict mode)  
**Styling**: Tailwind CSS 3.4  
**Auth**: Better Auth client

## Project Structure

```
frontend/
├── app/                # Next.js App Router pages
│   ├── layout.tsx      # Root layout with auth provider
│   ├── page.tsx        # Landing page
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── tasks/          # Task management pages
├── components/         # Shared React components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── auth/           # Auth-specific components
│   └── tasks/          # Task-specific components
├── lib/
│   ├── api.ts          # API client (fetch wrapper with JWT)
│   ├── auth.ts         # Better Auth configuration
│   └── utils.ts        # Utility functions
└── middleware.ts       # Route protection middleware
```

## Key Patterns

### Server vs Client Components

**Server Components** (default):
- Layouts, pages that render static content
- SEO metadata generation
- No useState, useEffect, event handlers

**Client Components** (use 'use client'):
- Forms with user interaction
- Components using hooks (useState, useEffect)
- Event handlers (onClick, onChange)

### API Client Usage

```typescript
// lib/api.ts provides authenticated fetch wrapper
import { apiClient } from '@/lib/api'

const tasks = await apiClient.get('/api/{user_id}/tasks')
await apiClient.post('/api/{user_id}/tasks', { title: '...' })
```

### Component Conventions

- Export default from component files
- Use TypeScript interfaces for props
- Follow accessibility requirements (ARIA, keyboard nav)
- Use Tailwind CSS utility classes (no custom CSS)

### Authentication

Better Auth manages JWT tokens automatically:
- Tokens stored in HTTP-only cookies
- `middleware.ts` protects /tasks/* routes
- `useAuth()` hook provides user state

## Specifications

Read these before implementing:
- `specs/002-phase-web-app/ui/components.md` - Component specs
- `specs/002-phase-web-app/ui/pages.md` - Page specs
- `specs/002-phase-web-app/api/rest-endpoints.md` - API contracts

## Testing

```bash
npm test              # Jest + React Testing Library
npm run test:e2e      # Playwright end-to-end tests
```

Test files: `__tests__/` alongside components
