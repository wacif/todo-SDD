# Data Model: Design System Components

**Feature**: Professional Frontend UI Design (Complete Application)  
**Date**: 2025-12-11  
**Context**: UI component definitions, not backend data models

> **Note**: This feature is frontend-only. The "data model" describes UI component entities, their props, states, and composition patterns, not database entities.

## Component Entities

### 1. Button Component

**Purpose**: Primary interactive element for user actions  
**Location**: `frontend/src/components/ui/button.tsx`

**Props**:
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  children: ReactNode
  className?: string
}
```

**States**:
- Default (idle)
- Hover (mouse over)
- Active (pressed)
- Focus (keyboard navigation)
- Disabled (not interactive)
- Loading (processing action)

**Validation Rules**:
- Must have accessible label (children or aria-label)
- Disabled state prevents click events
- Loading state shows spinner, blocks interaction

**Relationships**:
- Used in: Forms, modals, navigation, cards
- Depends on: Design tokens (colors, spacing)

---

### 2. Input Component

**Purpose**: Text input for forms with validation states  
**Location**: `frontend/src/components/ui/input.tsx`

**Props**:
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  state?: 'default' | 'error' | 'success'
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  required?: boolean
  disabled?: boolean
  className?: string
}
```

**States**:
- Default (idle)
- Focus (active editing)
- Filled (has value)
- Error (validation failed)
- Success (validation passed)
- Disabled (read-only)

**Validation Rules**:
- Email type validates email format
- Required prop enforces non-empty value
- Error message must have associated id for aria-describedby
- Label must be provided or aria-label required

**Relationships**:
- Used in: Forms (auth, task creation/editing)
- Composed with: Label, ErrorMessage, HelperText
- Depends on: Design tokens, validation utilities

---

### 3. Card Component

**Purpose**: Container for grouped content with consistent styling  
**Location**: `frontend/src/components/ui/card.tsx`

**Props**:
```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}
```

**States**:
- Default (static)
- Hover (optional interactive variant)
- Selected (optional active state)

**Validation Rules**:
- Should contain semantic content (not just div)
- Header should use appropriate heading level

**Relationships**:
- Used in: Dashboard (task cards), landing page (feature cards)
- Composed of: Card, CardHeader, CardContent, CardFooter
- Contains: Any content (buttons, text, images)

---

### 4. Modal/Dialog Component

**Purpose**: Overlay for focused interactions requiring user attention  
**Location**: `frontend/src/components/ui/modal.tsx`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  className?: string
}
```

**States**:
- Closed (not rendered)
- Opening (animation in)
- Open (visible, interactive)
- Closing (animation out)

**Validation Rules**:
- Must trap focus within modal when open
- Must return focus to trigger element on close
- Must have accessible title (title prop or aria-label)
- ESC key must close modal
- Overlay click should close (if enabled)

**Relationships**:
- Used in: Task creation, confirmations, auth flows
- Contains: Form elements, buttons, content
- Depends on: Focus trap utility, portal rendering

---

### 5. Toast/Notification Component

**Purpose**: Temporary feedback messages for user actions  
**Location**: `frontend/src/components/ui/toast.tsx`

**Props**:
```typescript
interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number  // milliseconds, 0 = permanent
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}
```

**States**:
- Entering (animation in)
- Visible (displayed)
- Exiting (animation out)
- Dismissed (removed)

**Validation Rules**:
- Must have accessible message (aria-live="polite" for info, "assertive" for errors)
- Auto-dismiss after duration (except errors may persist)
- Must be dismissible by user

**State Transitions**:
1. Created → Entering (0ms)
2. Entering → Visible (300ms animation)
3. Visible → Exiting (after duration or user dismiss)
4. Exiting → Dismissed (300ms animation)

**Relationships**:
- Used globally via ToastProvider context
- Triggered by: Form submissions, API responses, user actions

---

### 6. Navigation Component

**Purpose**: Primary site navigation with responsive behavior  
**Location**: `frontend/src/components/ui/navigation.tsx`

**Props**:
```typescript
interface NavigationProps {
  items: NavigationItem[]
  logo?: ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
  className?: string
}

interface NavigationItem {
  label: string
  href: string
  icon?: ReactNode
  isActive?: boolean
  badge?: string | number
}
```

**States**:
- Desktop (full horizontal menu)
- Mobile (hamburger menu collapsed)
- Mobile Open (menu expanded)

**Validation Rules**:
- Active item must be visually distinct
- Mobile menu must be keyboard accessible
- Must have skip-to-content link for accessibility

**Relationships**:
- Used in: Root layout (all pages)
- Contains: Logo, nav items, user menu
- Depends on: Button, Dropdown components

---

### 7. Loading/Skeleton Component

**Purpose**: Placeholder for content being loaded  
**Location**: `frontend/src/components/ui/skeleton.tsx`

**Props**:
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}
```

**States**:
- Animating (pulsing/shimmer effect)

**Validation Rules**:
- Must use aria-label="Loading" or aria-busy="true"
- Should match approximate size of final content

**Relationships**:
- Used in: Lazy-loaded components, data fetching states
- Replaces: Actual content during loading

---

### 8. EmptyState Component

**Purpose**: Informational display when lists/sections have no content  
**Location**: `frontend/src/components/ui/empty-state.tsx`

**Props**:
```typescript
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}
```

**States**:
- Static (informational)

**Validation Rules**:
- Should provide helpful guidance for next action
- Icon should be decorative (aria-hidden="true")

**Relationships**:
- Used in: Task list (no tasks), search results (no matches)
- Contains: Icon, text, optional CTA button

---

## Design Token Entities

### Color Palette

**Structure**:
```typescript
interface ColorPalette {
  primary: ColorScale      // Brand colors
  neutral: ColorScale      // Grays
  success: ColorScale      // Green
  error: ColorScale        // Red
  warning: ColorScale      // Yellow/Orange
  info: ColorScale         // Blue
}

interface ColorScale {
  50: string   // Lightest
  100: string
  200: string
  300: string
  400: string
  500: string  // Base color
  600: string
  700: string
  800: string
  900: string  // Darkest
}
```

**Validation Rules**:
- All text/background combinations must meet WCAG AA contrast (4.5:1)
- Primary color must have accessible variants for text and backgrounds

---

### Typography Scale

**Structure**:
```typescript
interface TypographyScale {
  fontFamily: {
    sans: string[]
    mono: string[]
  }
  fontSize: {
    xs: string    // 0.75rem
    sm: string    // 0.875rem
    base: string  // 1rem
    lg: string    // 1.125rem
    xl: string    // 1.25rem
    '2xl': string // 1.5rem
    '3xl': string // 1.875rem
    '4xl': string // 2.25rem
  }
  fontWeight: {
    normal: number   // 400
    medium: number   // 500
    semibold: number // 600
    bold: number     // 700
  }
  lineHeight: {
    tight: number    // 1.25
    normal: number   // 1.5
    relaxed: number  // 1.75
  }
}
```

**Validation Rules**:
- Base font size 16px minimum for accessibility
- Line height 1.5+ for body text
- Font weight 400+ for body, 600+ for headings

---

### Spacing Scale

**Structure**:
```typescript
interface SpacingScale {
  0: '0'
  1: '0.25rem'  // 4px
  2: '0.5rem'   // 8px (base unit)
  3: '0.75rem'  // 12px
  4: '1rem'     // 16px
  6: '1.5rem'   // 24px
  8: '2rem'     // 32px
  12: '3rem'    // 48px
  16: '4rem'    // 64px
  24: '6rem'    // 96px
}
```

**Validation Rules**:
- Use multiples of 4px for consistency
- Minimum touch target size 44x44px (iOS), 48x48px (Android)

---

## Component Composition Patterns

### Form Pattern

```typescript
<form onSubmit={handleSubmit}>
  <Input
    label="Email"
    type="email"
    error={errors.email}
    required
  />
  <Input
    label="Password"
    type="password"
    error={errors.password}
    required
  />
  <Button type="submit" isLoading={isSubmitting}>
    Sign In
  </Button>
</form>
```

### Modal with Form Pattern

```typescript
<Modal isOpen={isOpen} onClose={onClose} title="Create Task">
  <form onSubmit={handleCreateTask}>
    <Input label="Task Title" required />
    <Input label="Description" />
    <Button type="submit">Create</Button>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
  </form>
</Modal>
```

### Task Card Pattern

```typescript
<Card>
  <CardHeader>
    <h3>{task.title}</h3>
    <Badge variant={task.priority}>{task.priority}</Badge>
  </CardHeader>
  <CardContent>
    <p>{task.description}</p>
  </CardContent>
  <CardFooter>
    <Button size="sm" onClick={onEdit}>Edit</Button>
    <Button size="sm" variant="ghost" onClick={onDelete}>Delete</Button>
  </CardFooter>
</Card>
```

---

## Testing Requirements

Each component must have:

1. **Unit Tests**:
   - Render without errors
   - Accept all documented props
   - Handle state transitions correctly
   - Emit events properly

2. **Accessibility Tests**:
   - Pass axe-core automated checks
   - Have proper ARIA attributes
   - Support keyboard navigation
   - Meet focus management requirements

3. **Visual Regression Tests** (optional):
   - Snapshot tests for visual consistency
   - Test all variants and states

4. **Integration Tests**:
   - Work correctly when composed
   - Form submission flows
   - Modal open/close cycles

---

## Migration Strategy

### Existing Components

**Landing Page Components** (keep as-is, apply tokens):
- `Hero.tsx` → Update colors, spacing to use design tokens
- `Features.tsx` → Wrap FeatureCard with new Card component
- `SocialProof.tsx` → Update styling consistency
- `Footer.tsx` → Apply navigation patterns

**Dashboard Components** (enhance):
- Task list → Use new Card component
- Forms → Replace with new Input/Button components
- Modals → Replace with new Modal component

**Authentication Components** (rebuild):
- Sign in form → Use new form components
- Sign up form → Use new form components
- Error states → Use new Toast component

---

## Implementation Order

1. **Foundation** (Phase 1):
   - Design tokens (colors, typography, spacing)
   - Tailwind config extension
   - CSS custom properties

2. **Core Components** (Phase 2):
   - Button
   - Input
   - Card

3. **Layout Components** (Phase 3):
   - Navigation
   - Modal
   - Toast

4. **Specialized Components** (Phase 4):
   - Skeleton
   - EmptyState
   - Badge, Tooltip, Dropdown (as needed)

5. **Page Implementation** (Phase 5):
   - Apply to auth pages
   - Apply to dashboard
   - Enhance landing page

---

## Documentation Requirements

Each component must include:
- TypeScript interface with JSDoc comments
- Usage examples in Storybook or component file
- Accessibility notes (ARIA, keyboard support)
- Visual states documentation (screenshots or Figma)
