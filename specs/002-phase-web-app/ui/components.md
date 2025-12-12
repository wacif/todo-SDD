# UI Components Specification

**Version**: 2.0  
**Framework**: Next.js 16+ with React 19  
**Styling**: Tailwind CSS 3.4+  
**Created**: 2025-12-07

## Component Overview

This document defines all reusable React components for the Todo web application. Components follow:
- Server Components by default (performance)
- Client Components only when needed (interactivity, state)
- Composition pattern for reusability
- Tailwind CSS for styling
- TypeScript for type safety

---

## Component Hierarchy

```
App Layout
├── Navbar (client)
│   ├── Logo
│   ├── Navigation Links
│   └── User Menu (client)
├── Page Content
│   ├── AuthForm (client)
│   │   ├── Input (client)
│   │   ├── Button (client)
│   │   └── ErrorMessage
│   ├── TaskList (server)
│   │   ├── TaskCard (client)
│   │   │   ├── TaskTitle
│   │   │   ├── TaskDescription
│   │   │   ├── TaskStatus
│   │   │   └── TaskActions (client)
│   │   └── EmptyState
│   ├── TaskForm (client)
│   │   ├── Input (client)
│   │   ├── Textarea (client)
│   │   └── Button (client)
│   └── Modal (client)
└── Footer (server)
```

---

## Base Components

### Button

**Purpose**: Reusable button component with variants

**Type**: Client Component (interactive)

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}
```

**Variants**:
- **primary**: Blue background, white text (main actions)
- **secondary**: Gray background, dark text (secondary actions)
- **danger**: Red background, white text (destructive actions)
- **ghost**: Transparent background, colored text (subtle actions)

**States**:
- Default: Normal appearance
- Hover: Slightly darker background
- Active: Even darker background
- Disabled: Grayed out, cursor not-allowed
- Loading: Shows spinner, disabled

**Example Usage**:
```tsx
<Button variant="primary" onClick={handleSave}>
  Save Task
</Button>

<Button variant="danger" loading={isDeleting} onClick={handleDelete}>
  Delete
</Button>
```

**Accessibility**:
- Keyboard accessible (Tab, Enter, Space)
- ARIA labels for loading state
- Focus visible indicator

---

### Input

**Purpose**: Text input field with label and error support

**Type**: Client Component (form control)

**Props**:
```typescript
interface InputProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  autoFocus?: boolean
  className?: string
}
```

**States**:
- Default: Normal border
- Focus: Blue border, shadow
- Error: Red border, error message below
- Disabled: Grayed out, cursor not-allowed

**Example Usage**:
```tsx
<Input
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="you@example.com"
  error={emailError}
  required
/>
```

**Validation**:
- Shows error message when `error` prop provided
- Required indicator (*) when `required` is true
- Character count when `maxLength` provided

---

### Textarea

**Purpose**: Multi-line text input for descriptions

**Type**: Client Component (form control)

**Props**:
```typescript
interface TextareaProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  maxLength?: number
  className?: string
}
```

**Features**:
- Auto-resizing (optional)
- Character counter
- Same styling as Input component

**Example Usage**:
```tsx
<Textarea
  label="Description"
  name="description"
  value={description}
  onChange={setDescription}
  placeholder="Add details about your task..."
  rows={4}
  maxLength={1000}
/>
```

---

### Modal

**Purpose**: Overlay dialog for forms and confirmations

**Type**: Client Component (interactive overlay)

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}
```

**Features**:
- Backdrop overlay (semi-transparent black)
- Click outside to close
- ESC key to close
- Focus trap (keyboard navigation stays in modal)
- Scroll lock on body when open

**Example Usage**:
```tsx
<Modal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  title="Create New Task"
  size="md"
>
  <TaskForm onSubmit={handleCreate} />
</Modal>
```

**Accessibility**:
- ARIA role="dialog"
- ARIA-labelledby for title
- Focus returns to trigger element on close

---

## Authentication Components

### AuthForm

**Purpose**: Unified form for login and signup

**Type**: Client Component (form with state)

**Props**:
```typescript
interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: AuthData) => Promise<void>
  error?: string
}

interface AuthData {
  email: string
  password: string
  name?: string  // Only for signup
}
```

**Features**:
- Email and password inputs
- Name input (signup only)
- Submit button with loading state
- Error message display
- Link to switch between login/signup

**Validation**:
- Email format validation
- Password strength indicator (signup)
- Required field validation
- Client-side validation before submit

**Example Usage**:
```tsx
<AuthForm
  mode="signup"
  onSubmit={handleSignup}
  error={signupError}
/>
```

**Layout**:
```
┌─────────────────────────────────┐
│  Create Account (or Login)      │
├─────────────────────────────────┤
│  [Name] (signup only)            │
│  [Email]                         │
│  [Password]                      │
│  (Error message if any)          │
│  [Submit Button]                 │
│                                  │
│  Already have account? Login    │
└─────────────────────────────────┘
```

---

## Task Components

### TaskCard

**Purpose**: Display single task with actions

**Type**: Client Component (interactive actions)

**Props**:
```typescript
interface TaskCardProps {
  task: Task
  onComplete: (taskId: number) => Promise<void>
  onEdit: (taskId: number) => void
  onDelete: (taskId: number) => Promise<void>
}

interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}
```

**Features**:
- Task title (bold, truncated if too long)
- Task description (muted, truncated)
- Completion checkbox
- Edit button
- Delete button (with confirmation)
- Completion status indicator
- Created date

**States**:
- Default: White background
- Completed: Strikethrough text, muted colors
- Hover: Slight shadow
- Loading: Disabled actions, spinner

**Example Usage**:
```tsx
<TaskCard
  task={task}
  onComplete={handleComplete}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Layout**:
```
┌────────────────────────────────────────┐
│ [✓] Buy groceries              [Edit] │
│     Milk, eggs, bread          [Del]  │
│     Created: 2h ago                    │
└────────────────────────────────────────┘
```

**Interactions**:
- Click checkbox → Toggle completion
- Click "Edit" → Open edit modal
- Click "Delete" → Show confirmation, then delete

---

### TaskList

**Purpose**: Container for displaying multiple tasks

**Type**: Server Component (data fetching)

**Props**:
```typescript
interface TaskListProps {
  tasks: Task[]
  onComplete: (taskId: number) => Promise<void>
  onEdit: (taskId: number) => void
  onDelete: (taskId: number) => Promise<void>
  loading?: boolean
}
```

**Features**:
- Grid/list layout
- Empty state when no tasks
- Loading skeleton
- Task grouping by status (optional)
- Sort and filter controls

**Example Usage**:
```tsx
<TaskList
  tasks={tasks}
  onComplete={handleComplete}
  onEdit={handleEdit}
  onDelete={handleDelete}
  loading={isLoading}
/>
```

**Empty State**:
```
┌────────────────────────────────┐
│         📝                      │
│   No tasks yet                 │
│   Create your first task!      │
│   [Create Task Button]         │
└────────────────────────────────┘
```

---

### TaskForm

**Purpose**: Form for creating/editing tasks

**Type**: Client Component (form with state)

**Props**:
```typescript
interface TaskFormProps {
  mode: 'create' | 'edit'
  task?: Task  // Provided when mode is 'edit'
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
}

interface TaskFormData {
  title: string
  description: string
}
```

**Features**:
- Title input (required, max 200 chars)
- Description textarea (optional, max 1000 chars)
- Character counters
- Submit button
- Cancel button
- Loading state during submit

**Validation**:
- Title required (show error if empty)
- Title max 200 characters
- Description max 1000 characters
- Disable submit if invalid

**Example Usage**:
```tsx
<TaskForm
  mode="create"
  onSubmit={handleCreate}
  onCancel={handleCancel}
/>

<TaskForm
  mode="edit"
  task={selectedTask}
  onSubmit={handleUpdate}
  onCancel={handleCancel}
/>
```

**Layout**:
```
┌─────────────────────────────────┐
│  Title *                         │
│  [_________________________]    │
│  200/200 characters             │
│                                 │
│  Description                    │
│  [_________________________]    │
│  [_________________________]    │
│  [_________________________]    │
│  0/1000 characters              │
│                                 │
│  [Cancel]  [Save Task]          │
└─────────────────────────────────┘
```

---

## Layout Components

### Navbar

**Purpose**: Top navigation bar with user menu

**Type**: Client Component (interactive menu)

**Props**:
```typescript
interface NavbarProps {
  user: User | null
  onLogout: () => void
}

interface User {
  id: string
  name: string
  email: string
}
```

**Features**:
- Logo (links to home)
- Navigation links (Tasks, About, etc.)
- User menu dropdown
  - User name and email
  - Settings link
  - Logout button
- Responsive (hamburger menu on mobile)

**Example Usage**:
```tsx
<Navbar user={currentUser} onLogout={handleLogout} />
```

**Layout (Desktop)**:
```
┌─────────────────────────────────────────────┐
│ [Logo] Tasks | About        [User Menu ▼]   │
└─────────────────────────────────────────────┘
```

**User Menu Dropdown**:
```
┌─────────────────────┐
│ Sarah Johnson        │
│ sarah@example.com   │
├─────────────────────┤
│ ⚙ Settings          │
│ 🚪 Logout            │
└─────────────────────┘
```

---

### PageLayout

**Purpose**: Consistent page wrapper with padding and max-width

**Type**: Server Component (static layout)

**Props**:
```typescript
interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}
```

**Features**:
- Responsive padding
- Max-width container
- Optional page title
- Optional page description

**Example Usage**:
```tsx
<PageLayout title="My Tasks" maxWidth="lg">
  <TaskList tasks={tasks} {...handlers} />
</PageLayout>
```

---

## Utility Components

### EmptyState

**Purpose**: Display when no data available

**Type**: Server Component (static)

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

**Example Usage**:
```tsx
<EmptyState
  icon={<TaskIcon />}
  title="No tasks yet"
  description="Create your first task to get started"
  action={{
    label: "Create Task",
    onClick: handleCreate
  }}
/>
```

---

### LoadingSpinner

**Purpose**: Loading indicator

**Type**: Server Component (static SVG)

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
}
```

**Example Usage**:
```tsx
<LoadingSpinner size="md" color="primary" />
```

---

### ErrorMessage

**Purpose**: Display error messages

**Type**: Server Component (static)

**Props**:
```typescript
interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}
```

**Example Usage**:
```tsx
<ErrorMessage
  message="Failed to load tasks"
  onRetry={handleRetry}
/>
```

---

## Component File Structure

```
frontend/components/
├── ui/                          # Base components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Modal.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── auth/                        # Authentication components
│   └── AuthForm.tsx
├── tasks/                       # Task components
│   ├── TaskCard.tsx
│   ├── TaskList.tsx
│   └── TaskForm.tsx
├── layout/                      # Layout components
│   ├── Navbar.tsx
│   ├── PageLayout.tsx
│   ├── Footer.tsx
│   └── EmptyState.tsx
└── index.ts                     # Component exports
```

---

## Styling Guidelines

### Tailwind CSS Classes

**Colors**:
- Primary: `bg-blue-600`, `text-blue-600`
- Secondary: `bg-gray-200`, `text-gray-700`
- Danger: `bg-red-600`, `text-red-600`
- Success: `bg-green-600`, `text-green-600`

**Spacing**:
- Small: `p-2`, `m-2`
- Medium: `p-4`, `m-4`
- Large: `p-6`, `m-6`

**Typography**:
- Heading: `text-2xl font-bold`
- Subheading: `text-lg font-semibold`
- Body: `text-base`
- Small: `text-sm text-gray-600`

**Responsive**:
- Mobile-first: Base styles for mobile
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`

---

## Component Testing

Each component should have:
- **Unit tests**: Props, rendering, states
- **Interaction tests**: Click, input, keyboard
- **Accessibility tests**: ARIA, keyboard navigation

**Test File Structure**:
```
frontend/components/
├── ui/
│   ├── Button.tsx
│   └── Button.test.tsx
```

**Example Test**:
```tsx
describe('Button', () => {
  it('renders with correct variant', () => {
    const { getByRole } = render(
      <Button variant="primary">Click me</Button>
    )
    const button = getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('shows loading spinner when loading', () => {
    const { getByTestId } = render(
      <Button loading>Save</Button>
    )
    expect(getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
```

---

## Accessibility Requirements

All components must:
- ✅ Be keyboard accessible
- ✅ Have proper ARIA labels
- ✅ Support screen readers
- ✅ Have visible focus indicators
- ✅ Meet WCAG 2.1 Level AA contrast ratios

---

**Status**: ✅ UI Components Specification Complete  
**Component Count**: 15 components  
**Last Updated**: 2025-12-07
