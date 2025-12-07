# UI Pages Specification

**Version**: 2.0  
**Framework**: Next.js 16+ App Router  
**Routing**: File-based routing in `app/` directory  
**Created**: 2025-12-07

## Page Overview

This document defines all pages (routes) in the Next.js application using App Router conventions.

## Routing Structure

```
app/
├── layout.tsx                    # Root layout (all pages)
├── page.tsx                      # Home page (/)
├── (auth)/                       # Auth route group
│   ├── layout.tsx                # Auth-specific layout
│   ├── login/
│   │   └── page.tsx              # Login page (/login)
│   └── signup/
│       └── page.tsx              # Signup page (/signup)
└── (dashboard)/                  # Protected route group
    ├── layout.tsx                # Dashboard layout with navbar
    └── tasks/
        ├── page.tsx              # Task list (/tasks)
        ├── new/
        │   └── page.tsx          # Create task (/tasks/new)
        └── [id]/
            ├── page.tsx          # Task detail (/tasks/[id])
            └── edit/
                └── page.tsx      # Edit task (/tasks/[id]/edit)
```

---

## Root Layout

**File**: `app/layout.tsx`

**Purpose**: Root HTML document with global providers

**Type**: Server Component

**Features**:
- HTML lang attribute
- Meta tags (charset, viewport)
- Global CSS imports
- Font loading
- Auth provider
- Toast notification provider

**Code Structure**:
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Metadata**:
```tsx
export const metadata = {
  title: 'Todo App - Manage Your Tasks',
  description: 'A modern task management application',
}
```

---

## Home Page

**Route**: `/`  
**File**: `app/page.tsx`  
**Purpose**: Landing page for unauthenticated users

**Type**: Server Component

**Content**:
- Hero section with app description
- Feature highlights
- Call-to-action buttons (Login, Sign Up)
- Redirects to /tasks if user is authenticated

**Layout**:
```
┌────────────────────────────────────────┐
│  [Logo]           [Login] [Sign Up]    │
├────────────────────────────────────────┤
│                                        │
│         Manage Your Tasks              │
│         Stay organized and productive  │
│                                        │
│    [Get Started] [Learn More]         │
│                                        │
│  ✨ Simple & Intuitive                 │
│  🔒 Secure & Private                   │
│  📱 Access Anywhere                    │
└────────────────────────────────────────┘
```

**Code Structure**:
```tsx
export default async function HomePage() {
  const user = await getAuthenticatedUser()
  
  if (user) {
    redirect('/tasks')
  }
  
  return (
    <main>
      <Hero />
      <Features />
      <CTA />
    </main>
  )
}
```

---

## Auth Layout

**Route Group**: `(auth)`  
**File**: `app/(auth)/layout.tsx`  
**Purpose**: Layout for authentication pages

**Type**: Server Component

**Features**:
- Centered card layout
- No navbar (minimal design)
- Redirects to /tasks if already authenticated

**Layout**:
```
┌────────────────────────────────────────┐
│                                        │
│     ┌──────────────────────┐          │
│     │                      │          │
│     │   [Auth Form]        │          │
│     │                      │          │
│     └──────────────────────┘          │
│                                        │
└────────────────────────────────────────┘
```

---

## Login Page

**Route**: `/login`  
**File**: `app/(auth)/login/page.tsx`  
**Purpose**: User authentication

**Type**: Client Component (interactive form)

**Features**:
- Email and password inputs
- "Remember me" checkbox
- Submit button
- Error message display
- Link to signup page
- "Forgot password" link (future)

**Metadata**:
```tsx
export const metadata = {
  title: 'Login - Todo App',
  description: 'Sign in to your account',
}
```

**Form Fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | email | Yes | Valid email format |
| password | password | Yes | Min 1 char (no constraint on login) |

**User Flow**:
1. User enters email and password
2. Click "Login" button
3. If successful → Redirect to /tasks
4. If failed → Show error message

**Error Handling**:
- Invalid credentials → "Email or password is incorrect"
- Server error → "An error occurred. Please try again"
- Network error → "Connection failed. Check your internet"

**Code Structure**:
```tsx
'use client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signIn({ email, password })
      router.push('/tasks')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <AuthForm
      mode="login"
      onSubmit={handleSubmit}
      error={error}
    />
  )
}
```

---

## Signup Page

**Route**: `/signup`  
**File**: `app/(auth)/signup/page.tsx`  
**Purpose**: New user registration

**Type**: Client Component (interactive form)

**Features**:
- Name input
- Email input
- Password input with strength indicator
- Terms of service checkbox
- Submit button
- Error message display
- Link to login page

**Metadata**:
```tsx
export const metadata = {
  title: 'Sign Up - Todo App',
  description: 'Create your account',
}
```

**Form Fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | text | Yes | 2-100 chars |
| email | email | Yes | Valid email format, unique |
| password | password | Yes | Min 8 chars, 1 upper, 1 lower, 1 digit |
| terms | checkbox | Yes | Must be checked |

**Password Strength Indicator**:
- Weak (red): < 8 chars
- Medium (yellow): 8+ chars, missing requirements
- Strong (green): Meets all requirements

**User Flow**:
1. User enters name, email, password
2. Password strength indicator updates in real-time
3. Check "I agree to Terms" checkbox
4. Click "Sign Up" button
5. If successful → Redirect to /login with success message
6. If failed → Show error message

**Error Handling**:
- Email already exists → "An account with this email already exists"
- Weak password → "Password must meet all requirements"
- Terms not accepted → "You must accept the terms of service"

**Code Structure**:
```tsx
'use client'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.terms) {
      setError('You must accept the terms of service')
      return
    }
    
    setLoading(true)
    
    try {
      await signUp(formData)
      router.push('/login?registered=true')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSubmit}
      error={error}
    />
  )
}
```

---

## Dashboard Layout

**Route Group**: `(dashboard)`  
**File**: `app/(dashboard)/layout.tsx`  
**Purpose**: Layout for authenticated pages

**Type**: Server Component with auth check

**Features**:
- Navbar with user menu
- Main content area
- Footer
- Redirects to /login if not authenticated

**Layout**:
```
┌────────────────────────────────────────┐
│ [Navbar]                               │
├────────────────────────────────────────┤
│                                        │
│  [Page Content]                        │
│                                        │
├────────────────────────────────────────┤
│ [Footer]                               │
└────────────────────────────────────────┘
```

**Code Structure**:
```tsx
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

---

## Tasks Page (List)

**Route**: `/tasks`  
**File**: `app/(dashboard)/tasks/page.tsx`  
**Purpose**: Display all user's tasks

**Type**: Server Component (fetches data)

**Features**:
- Task list
- Filter by status (All, Pending, Completed)
- Sort by created date, title, updated date
- Create task button (opens modal)
- Empty state when no tasks
- Loading skeleton

**Metadata**:
```tsx
export const metadata = {
  title: 'My Tasks - Todo App',
  description: 'View and manage your tasks',
}
```

**Filter Options**:
- All tasks (default)
- Pending tasks only
- Completed tasks only

**Sort Options**:
- Created date (newest first) - default
- Title (A-Z)
- Updated date (most recent)

**Layout**:
```
┌────────────────────────────────────────┐
│  My Tasks                 [+ New Task] │
├────────────────────────────────────────┤
│  [All] [Pending] [Completed]           │
│  Sort: [Created ▼]                     │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐ │
│  │ [✓] Task 1            [Edit]     │ │
│  │     Description...     [Delete]  │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ [ ] Task 2            [Edit]     │ │
│  │     Description...     [Delete]  │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Code Structure**:
```tsx
export default async function TasksPage({
  searchParams,
}: {
  searchParams: { status?: string; sort?: string }
}) {
  const user = await getAuthenticatedUser()
  const tasks = await fetchTasks(user.id, {
    status: searchParams.status || 'all',
    sort: searchParams.sort || 'created'
  })
  
  return (
    <PageLayout title="My Tasks">
      <TaskListHeader />
      <TaskFilters />
      <TaskList
        tasks={tasks}
        onComplete={handleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageLayout>
  )
}
```

**Interactions**:
- Click "+ New Task" → Open create modal
- Click filter tab → Update URL query params, refetch tasks
- Click sort dropdown → Update URL query params, refetch tasks
- Check/uncheck task → Toggle completion status
- Click "Edit" → Navigate to `/tasks/[id]/edit`
- Click "Delete" → Show confirmation, then delete

---

## Create Task Page

**Route**: `/tasks/new`  
**File**: `app/(dashboard)/tasks/new/page.tsx`  
**Purpose**: Create a new task

**Type**: Client Component (form)

**Features**:
- Task form (title, description)
- Cancel button → Back to /tasks
- Create button
- Validation errors
- Success redirect to /tasks

**Metadata**:
```tsx
export const metadata = {
  title: 'Create Task - Todo App',
  description: 'Create a new task',
}
```

**Code Structure**:
```tsx
'use client'

export default function CreateTaskPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (data: TaskFormData) => {
    setLoading(true)
    
    try {
      await createTask(data)
      router.push('/tasks')
      toast.success('Task created successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <PageLayout title="Create Task">
      <TaskForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/tasks')}
      />
      {error && <ErrorMessage message={error} />}
    </PageLayout>
  )
}
```

---

## Task Detail Page

**Route**: `/tasks/[id]`  
**File**: `app/(dashboard)/tasks/[id]/page.tsx`  
**Purpose**: View single task details

**Type**: Server Component (fetches data)

**Features**:
- Task title
- Task description
- Completion status
- Created date
- Updated date
- Edit button → `/tasks/[id]/edit`
- Delete button
- Back button → `/tasks`

**Metadata**:
```tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  const task = await fetchTask(params.id)
  
  return {
    title: `${task.title} - Todo App`,
    description: task.description,
  }
}
```

**Layout**:
```
┌────────────────────────────────────────┐
│  ← Back to Tasks                       │
├────────────────────────────────────────┤
│  Buy groceries                 [Edit]  │
│  Status: Incomplete            [Delete]│
│                                        │
│  Milk, eggs, bread, cheese,            │
│  cleaning supplies                     │
│                                        │
│  Created: Dec 7, 2025 10:00 AM         │
│  Updated: Dec 7, 2025 4:00 PM          │
└────────────────────────────────────────┘
```

**Code Structure**:
```tsx
export default async function TaskDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const task = await fetchTask(params.id)
  
  if (!task) {
    notFound()
  }
  
  return (
    <PageLayout>
      <TaskDetail
        task={task}
        onEdit={() => router.push(`/tasks/${task.id}/edit`)}
        onDelete={handleDelete}
      />
    </PageLayout>
  )
}
```

---

## Edit Task Page

**Route**: `/tasks/[id]/edit`  
**File**: `app/(dashboard)/tasks/[id]/edit/page.tsx`  
**Purpose**: Edit existing task

**Type**: Client Component (form with data)

**Features**:
- Pre-filled task form
- Cancel button → Back to `/tasks/[id]`
- Update button
- Validation errors
- Success redirect to `/tasks/[id]`

**Metadata**:
```tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  const task = await fetchTask(params.id)
  
  return {
    title: `Edit: ${task.title} - Todo App`,
    description: 'Edit task details',
  }
}
```

**Code Structure**:
```tsx
'use client'

export default function EditTaskPage({
  params,
}: {
  params: { id: string }
}) {
  const { data: task, isLoading } = useTask(params.id)
  const [error, setError] = useState('')
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!task) {
    notFound()
  }
  
  const handleSubmit = async (data: TaskFormData) => {
    try {
      await updateTask(params.id, data)
      router.push(`/tasks/${params.id}`)
      toast.success('Task updated successfully')
    } catch (err) {
      setError(err.message)
    }
  }
  
  return (
    <PageLayout title="Edit Task">
      <TaskForm
        mode="edit"
        task={task}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/tasks/${params.id}`)}
      />
      {error && <ErrorMessage message={error} />}
    </PageLayout>
  )
}
```

---

## Route Protection

### Middleware

**File**: `middleware.ts`

**Purpose**: Protect authenticated routes

```tsx
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const { pathname } = request.nextUrl
  
  // Protect dashboard routes
  if (pathname.startsWith('/tasks')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Redirect authenticated users from auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (token) {
      return NextResponse.redirect(new URL('/tasks', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Loading States

Each page should have a loading.tsx file:

**File**: `app/(dashboard)/tasks/loading.tsx`

```tsx
export default function Loading() {
  return (
    <PageLayout title="My Tasks">
      <TaskListSkeleton />
    </PageLayout>
  )
}
```

---

## Error Handling

Each page should have an error.tsx file:

**File**: `app/(dashboard)/tasks/error.tsx`

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <PageLayout title="Error">
      <ErrorMessage
        message={error.message}
        onRetry={reset}
      />
    </PageLayout>
  )
}
```

---

## Navigation Flow

```
/ (Home)
  └─→ /login ──────→ /tasks (List)
  └─→ /signup ─┘       ├─→ /tasks/new (Create)
                        ├─→ /tasks/[id] (Detail)
                        │     └─→ /tasks/[id]/edit (Edit)
                        └─→ (Delete → back to list)
```

---

## SEO and Meta Tags

Each page includes:
- Title (unique per page)
- Description
- Open Graph tags
- Twitter Card tags
- Canonical URL

**Example**:
```tsx
export const metadata = {
  title: 'My Tasks - Todo App',
  description: 'View and manage your tasks',
  openGraph: {
    title: 'My Tasks',
    description: 'View and manage your tasks',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Tasks',
    description: 'View and manage your tasks',
  },
}
```

---

**Status**: ✅ UI Pages Specification Complete  
**Total Pages**: 7 pages + layouts  
**Last Updated**: 2025-12-07
