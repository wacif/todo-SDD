# Frontend Components Documentation

## Table of Contents
- [UI Components](#ui-components)
- [Landing Page Components](#landing-page-components)
- [Dashboard Components](#dashboard-components)
- [Utility Components](#utility-components)

---

## UI Components

### Button
Primary interactive element for user actions.

**Import:**
```tsx
import { Button } from '@/components/ui/button'
```

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

**Usage:**
```tsx
<Button variant="primary" size="md">
  Click me
</Button>

<Button variant="outline" loading>
  Loading...
</Button>
```

---

### Card
Container component for grouping related content.

**Import:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
```

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

---

### Input
Text input field with validation support.

**Import:**
```tsx
import { Input } from '@/components/ui/input'
```

**Props:**
```typescript
interface InputProps {
  label?: string
  error?: string
  type?: 'text' | 'email' | 'password' | 'number'
  required?: boolean
  disabled?: boolean
}
```

**Usage:**
```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  required
/>
```

---

### Modal
Dialog component for focused user interactions.

**Import:**
```tsx
import { Modal } from '@/components/ui/modal'
```

**Props:**
```typescript
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}
```

**Usage:**
```tsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <Button onClick={handleConfirm}>Confirm</Button>
  }
>
  Are you sure?
</Modal>
```

**Features:**
- Focus trap (keyboard navigation contained)
- Escape key to close
- Click outside to close
- Prevents body scroll
- Accessible ARIA attributes

---

### Toast
Notification component for user feedback.

**Import:**
```tsx
import { ToastProvider, useToast } from '@/components/ui/toast'
```

**Usage:**
```tsx
// 1. Wrap app with ToastProvider
<ToastProvider>
  <App />
</ToastProvider>

// 2. Use in components
function MyComponent() {
  const { toast } = useToast()
  
  const handleAction = () => {
    toast({
      title: 'Success',
      description: 'Action completed',
      variant: 'success'
    })
  }
}
```

**Variants:**
- `success`: Green checkmark
- `error` / `destructive`: Red X
- `warning`: Yellow exclamation
- `info`: Blue info icon

---

### Badge
Small label for statuses or categories.

**Import:**
```tsx
import { Badge } from '@/components/ui/badge'
```

**Props:**
```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}
```

**Usage:**
```tsx
<Badge variant="success">Completed</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

---

### EmptyState
Placeholder for empty data states.

**Import:**
```tsx
import { EmptyState } from '@/components/ui/empty-state'
```

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}
```

**Usage:**
```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No tasks yet"
  description="Create your first task to get started"
  action={
    <Button onClick={handleCreate}>
      Create Task
    </Button>
  }
/>
```

---

### Drawer
Side panel for mobile navigation.

**Import:**
```tsx
import { Drawer } from '@/components/ui/drawer'
```

**Props:**
```typescript
interface DrawerProps {
  open: boolean
  onClose: () => void
  position?: 'left' | 'right'
  title?: string
  children: React.ReactNode
}
```

**Usage:**
```tsx
<Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  position="left"
  title="Menu"
>
  <nav>...</nav>
</Drawer>
```

---

### Skeleton
Loading placeholder with pulse animation.

**Import:**
```tsx
import { Skeleton } from '@/components/ui/skeleton'
```

**Usage:**
```tsx
<Skeleton className="h-20 w-full" />
<Skeleton className="h-4 w-3/4" />
```

---

## Landing Page Components

### Hero
Main hero section with CTA buttons.

**Import:**
```tsx
import { Hero } from '@/components/landing/Hero'
```

**Features:**
- Gradient background
- Animated CTAs with framer-motion
- Responsive design
- Hero illustration

---

### FeaturesSection
Grid of feature cards.

**Import:**
```tsx
import { FeaturesSection } from '@/components/landing/FeaturesSection'
```

**Features:**
- Responsive grid (1-3 columns)
- Icon + title + description
- Hover effects

---

### HowItWorks
Step-by-step workflow section.

**Import:**
```tsx
import { HowItWorks } from '@/components/landing/HowItWorks'
```

---

### SocialProof
Testimonials from users.

**Import:**
```tsx
import { SocialProof } from '@/components/landing/SocialProof'
```

**Features:**
- Avatar images
- Quote styling
- Responsive grid

---

### Footer
Site footer with links and social media.

**Import:**
```tsx
import { Footer } from '@/components/landing/Footer'
```

---

### LandingNav
Navigation bar with auth buttons.

**Import:**
```tsx
import { LandingNav } from '@/components/landing/LandingNav'
```

**Features:**
- Mobile hamburger menu
- Smooth scroll to sections
- Login/Signup CTAs

---

## Dashboard Components

### TaskCard
Individual task display and actions.

**Import:**
```tsx
import { TaskCard } from '@/components/dashboard/TaskCard'
```

**Props:**
```typescript
interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    completed: boolean
  }
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}
```

**Features:**
- Checkbox for completion
- Edit/Delete buttons
- Badge for status
- Responsive layout

---

### TaskList
List of TaskCards with filtering.

**Import:**
```tsx
import { TaskList } from '@/components/dashboard/TaskList'
```

**Props:**
```typescript
interface TaskListProps {
  tasks: Task[]
  filter: 'all' | 'pending' | 'completed'
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}
```

**Features:**
- Automatic filtering
- Empty state
- Grid layout

---

### TaskForm
Create/Edit task form.

**Import:**
```tsx
import { TaskForm } from '@/components/dashboard/TaskForm'
```

**Props:**
```typescript
interface TaskFormProps {
  task?: Task // For edit mode
  onSubmit: (data: TaskData) => Promise<void>
  onCancel: () => void
}
```

**Features:**
- Client-side validation
- Loading states
- Error handling
- Create/Edit modes

---

### Navigation
Dashboard navigation bar.

**Import:**
```tsx
import { Navigation } from '@/components/dashboard/Navigation'
```

**Features:**
- User info display
- Logout button
- Responsive design

---

## Utility Components

### ErrorBoundary
Catches and handles React errors.

**Import:**
```tsx
import { ErrorBoundary } from '@/components/error-boundary'
```

**Usage:**
```tsx
<ErrorBoundary fallback={<CustomError />}>
  <App />
</ErrorBoundary>
```

**Features:**
- Graceful error handling
- Custom fallback UI
- Error logging (production)
- Development error details

---

## Best Practices

### 1. Import Organization
```tsx
// External dependencies
import { useState } from 'react'

// Internal components (use barrel exports)
import { Button, Card, Input } from '@/components/ui'

// Types
import type { Task } from '@/types'

// Utilities
import { cn } from '@/lib/utils'
```

### 2. Component Structure
```tsx
interface Props {
  // Props with clear types
}

export function Component({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. Derived state
  const computed = useMemo(() => ...)
  
  // 3. Effects
  useEffect(() => ...)
  
  // 4. Event handlers
  const handleClick = () => ...
  
  // 5. Render
  return <div>...</div>
}
```

### 3. Error Handling
```tsx
try {
  await apiCall()
  toast({ title: 'Success', variant: 'success' })
} catch (error) {
  toast({ 
    title: 'Error',
    description: error.message,
    variant: 'error'
  })
}
```

### 4. Accessibility
- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Provide focus indicators
- Use proper heading hierarchy

### 5. Testing
```tsx
import { render, screen, userEvent } from '@testing-library/react'
import { Button } from './button'

test('renders and handles click', async () => {
  const onClick = jest.fn()
  render(<Button onClick={onClick}>Click</Button>)
  
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalled()
})
```
