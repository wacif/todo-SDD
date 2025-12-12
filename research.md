# Design System Research: Next.js 16 + React 19 + Tailwind CSS 3.4

**Created**: 2025-12-11  
**Stack**: Next.js 16.0.3, React 19, Tailwind CSS 3.4, Framer Motion  
**Target**: Lighthouse 90+ score, WCAG AA compliance

---

## 1. Design Token Architecture

### Decision: CSS Variables + Tailwind Theme Extension
**Rationale**: Combines Tailwind's utility-first approach with runtime theme flexibility through CSS variables, enabling dynamic theming without rebuilding CSS.

### Color System

**Primary Color Palette**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // Brand colors
      'primary': {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',  // Base
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      // Semantic colors
      'success': '#13ce66',
      'warning': '#ffc82c',
      'error': '#e3342f',
      'info': '#1fb6ff',
      // Neutral palette
      'gray': {
        50: '#f9fafc',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
    },
  },
}
```

**Alternative**: CSS-in-JS with styled-components
- **Rejected**: Adds runtime overhead, conflicts with Next.js 16 server components optimization
- **Trade-off**: Lost dynamic style generation, gained better performance and Next.js compatibility

**Key Pattern - CSS Variables for Runtime Themes**:
```css
/* globals.css */
:root {
  --color-primary: theme('colors.primary.500');
  --color-surface: theme('colors.white');
  --color-text: theme('colors.gray.900');
}

[data-theme="dark"] {
  --color-primary: theme('colors.primary.400');
  --color-surface: theme('colors.gray.900');
  --color-text: theme('colors.gray.100');
}
```

### Typography System

**Decision**: Fluid Typography with clamp()
**Rationale**: Responsive text that scales smoothly across viewport sizes without media queries, improving readability and reducing CSS complexity.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        // Mobile-first with fluid scaling
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        // Fluid scales (viewport-based)
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.4vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)',
        'fluid-2xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
}
```

**Typography CSS Utilities**:
```css
/* Custom typography utilities */
.prose-custom {
  color: var(--color-text);
  line-height: 1.6;
  letter-spacing: -0.01em;
}

.heading {
  font-weight: theme('fontWeight.bold');
  line-height: 1.2;
  letter-spacing: -0.02em;
}
```

**Alternative**: Fixed size scale with breakpoint media queries
- **Rejected**: More CSS, less smooth transitions between breakpoints
- **Trade-off**: Reduced control over specific breakpoint sizes, gained fluid responsiveness

### Spacing System

**Decision**: 8px Base Unit with Composite Scale
**Rationale**: Aligns with design systems best practices, provides consistent rhythm, and works well across different screen densities.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      // Base scale (4px increments)
      px: '1px',
      0: '0',
      0.5: '0.125rem',  // 2px
      1: '0.25rem',     // 4px
      1.5: '0.375rem',  // 6px
      2: '0.5rem',      // 8px  ← Base unit
      2.5: '0.625rem',  // 10px
      3: '0.75rem',     // 12px
      3.5: '0.875rem',  // 14px
      4: '1rem',        // 16px
      5: '1.25rem',     // 20px
      6: '1.5rem',      // 24px
      7: '1.75rem',     // 28px
      8: '2rem',        // 32px
      9: '2.25rem',     // 36px
      10: '2.5rem',     // 40px
      11: '2.75rem',    // 44px
      12: '3rem',       // 48px
      14: '3.5rem',     // 56px
      16: '4rem',       // 64px
      20: '5rem',       // 80px
      24: '6rem',       // 96px
      28: '7rem',       // 112px
      32: '8rem',       // 128px
      36: '9rem',       // 144px
      40: '10rem',      // 160px
      44: '11rem',      // 176px
      48: '12rem',      // 192px
      52: '13rem',      // 208px
      56: '14rem',      // 224px
      60: '15rem',      // 240px
      64: '16rem',      // 256px
      72: '18rem',      // 288px
      80: '20rem',      // 320px
      96: '24rem',      // 384px
    },
  },
}
```

**Container Spacing Pattern**:
```javascript
// Component spacing convention
const containerPadding = {
  mobile: 'px-4',    // 16px
  tablet: 'md:px-6', // 24px
  desktop: 'lg:px-8', // 32px
}

const sectionSpacing = {
  small: 'py-8',     // 32px
  medium: 'py-12',   // 48px
  large: 'py-16',    // 64px
  xlarge: 'py-24',   // 96px
}
```

**Alternative**: Percentage-based spacing
- **Rejected**: Unpredictable results across different container sizes, harder to maintain consistency
- **Trade-off**: Lost flexibility for ultra-wide layouts, gained predictable spacing

### Elevation & Shadows

**Decision**: Layered Shadow System (Material Design Inspired)
**Rationale**: Creates clear visual hierarchy, guides user attention, and provides depth perception in flat design.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        // Elevation levels
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        // Interaction states
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.5)',
        'error': '0 0 0 3px rgba(239, 68, 68, 0.5)',
        'success': '0 0 0 3px rgba(34, 197, 94, 0.5)',
      },
      dropShadow: {
        // For filter-based shadows (better performance)
        'sm': '0 1px 1px rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 2px rgb(0 0 0 / 0.1)',
        'md': '0 4px 3px rgb(0 0 0 / 0.07)',
        'lg': '0 10px 8px rgb(0 0 0 / 0.04)',
        'xl': '0 20px 13px rgb(0 0 0 / 0.03)',
        '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
      },
    },
  },
}
```

**Performance Pattern - Prefer drop-shadow for animations**:
```tsx
// ❌ Animating boxShadow (triggers paint)
<div className="transition-shadow hover:shadow-lg">

// ✅ Animating filter (hardware accelerated)
<div className="transition-all hover:drop-shadow-lg">
```

**Alternative**: Flat design with no shadows
- **Rejected**: Lacks visual hierarchy, harder to distinguish interactive elements
- **Trade-off**: Added visual complexity, gained better UX affordance

---

## 2. Component Patterns with TypeScript

### Button Component Variants

**Decision**: Compound Variant Pattern with TypeScript Discriminated Unions
**Rationale**: Type-safe variant handling, excellent IntelliSense support, prevents invalid prop combinations, and scales well with design system growth.

```typescript
// components/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

// Define variant styles using CVA (Class Variance Authority)
const buttonVariants = cva(
  // Base styles applied to all variants
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500',
        ghost: 'text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500',
        danger: 'bg-error text-white hover:bg-red-700 focus-visible:ring-red-500',
        link: 'text-primary-500 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
        xl: 'h-12 px-8 text-xl',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

// TypeScript interface with proper typing
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Loading state shows spinner and disables button */
  isLoading?: boolean
  /** Icon to display before button text */
  leftIcon?: React.ReactNode
  /** Icon to display after button text */
  rightIcon?: React.ReactNode
}

// Component implementation with forwardRef for ref forwarding
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

**Usage Examples**:
```tsx
// Type-safe usage with autocomplete
<Button variant="primary" size="lg">
  Save Changes
</Button>

<Button variant="outline" size="sm" leftIcon={<PlusIcon />}>
  Add Item
</Button>

<Button variant="danger" isLoading>
  Deleting...
</Button>

<Button variant="ghost" fullWidth>
  Cancel
</Button>
```

**Alternative Approaches**:
1. **Inline className strings**: 
   - Rejected: No type safety, hard to maintain, prone to inconsistencies
   - Trade-off: Simpler initial setup, lost scalability

2. **Styled Components**:
   - Rejected: Runtime overhead, conflicts with Server Components
   - Trade-off: Better DX for CSS-in-JS fans, lost Next.js optimization

3. **Tailwind @apply in CSS**:
   - Rejected: Loses Tailwind's utility-first benefits, harder to customize
   - Trade-off: Cleaner JSX, lost composition flexibility

**Key Pattern - Compound Variants**:
```typescript
// Handle complex variant combinations
const buttonVariants = cva('base-styles', {
  variants: { /* ... */ },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'sm',
      className: 'font-semibold', // Extra styling for specific combination
    },
  ],
})
```

### Input Component with Validation States

**Decision**: Controlled Component with Validation Feedback
**Rationale**: React 19 form actions work well with controlled inputs, immediate validation improves UX, and TypeScript ensures type safety for validation logic.

```typescript
// components/Input.tsx
import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'w-full rounded-lg border px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
        error: 'border-error focus:border-error focus:ring-red-500',
        success: 'border-success focus:border-success focus:ring-green-500',
        warning: 'border-warning focus:border-warning focus:ring-yellow-500',
      },
      size: {
        sm: 'h-9 text-sm',
        md: 'h-10 text-base',
        lg: 'h-11 text-lg',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Label text displayed above input */
  label?: string
  /** Error message to display */
  error?: string
  /** Success message to display */
  success?: string
  /** Hint text displayed below input */
  hint?: string
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      state,
      size,
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    // Auto-generate ID for accessibility
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    // Derive state from props
    const derivedState = error ? 'error' : success ? 'success' : state

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputVariants({
              state: derivedState,
              size,
              className: leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : className,
            })}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Validation Messages */}
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        
        {success && !error && (
          <p className="mt-2 text-sm text-success">
            {success}
          </p>
        )}
        
        {hint && !error && !success && (
          <p id={`${inputId}-hint`} className="mt-2 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

**Usage with React 19 Form Actions**:
```tsx
'use client'

import { useActionState } from 'react'
import { Input } from '@/components/Input'

async function submitForm(prevState: any, formData: FormData) {
  // Server Action
  const email = formData.get('email') as string
  
  if (!email.includes('@')) {
    return { error: 'Invalid email address' }
  }
  
  return { success: true }
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitForm, {})

  return (
    <form action={formAction}>
      <Input
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={state?.error}
        leftIcon={<MailIcon />}
        required
      />
      
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

**Alternative Approaches**:
1. **Uncontrolled inputs with refs**:
   - Rejected: Less React-like, harder to validate in real-time
   - Trade-off: Simpler code, lost immediate validation feedback

2. **Third-party form libraries (React Hook Form)**:
   - Consider for complex forms: Better performance, built-in validation
   - Trade-off: Added dependency, more abstraction

### Polymorphic Component Pattern

**Decision**: "as" Prop Pattern with TypeScript Generics
**Rationale**: Maximum flexibility for semantic HTML while maintaining type safety, enables proper accessibility semantics.

```typescript
// components/Text.tsx
import { ElementType, ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-fluid-2xl font-bold tracking-tight',
      h2: 'text-fluid-xl font-bold tracking-tight',
      h3: 'text-fluid-lg font-semibold',
      h4: 'text-lg font-semibold',
      body: 'text-base',
      small: 'text-sm',
      caption: 'text-xs text-gray-600',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
    align: 'left',
  },
})

type TextOwnProps<E extends ElementType = ElementType> = {
  /** The HTML element to render */
  as?: E
} & VariantProps<typeof textVariants>

type TextProps<E extends ElementType> = TextOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps>

const defaultElement = 'p'

export function Text<E extends ElementType = typeof defaultElement>({
  as,
  variant,
  align,
  className,
  ...props
}: TextProps<E>) {
  const Component = as || defaultElement

  return (
    <Component
      className={textVariants({ variant, align, className })}
      {...props}
    />
  )
}
```

**Usage Examples**:
```tsx
// Renders <p> with body text styling
<Text>This is body text</Text>

// Renders <h1> with h1 styling - proper semantics
<Text as="h1" variant="h1">Page Title</Text>

// Renders <span> with h2 styling - when semantics differ from appearance
<Text as="span" variant="h2">Visual Heading</Text>

// Fully typed - TypeScript knows this is an anchor
<Text as="a" variant="body" href="/about" target="_blank">
  Link Text
</Text>
```

**Alternative Approaches**:
1. **Separate components for each variant**:
   - Rejected: Code duplication, harder to maintain consistency
   - Trade-off: Simpler to understand, lost flexibility

2. **CSS-only approach with semantic HTML**:
   - Consider for simple cases: Better performance, no JS needed
   - Trade-off: Less control over markup, harder to customize

---

## 3. Accessibility Basics (WCAG AA)

### WCAG AA Requirements Summary

**Principle 1: Perceivable**
- ✅ 1.1.1 Non-text Content (Level A): All images have alt text
- ✅ 1.4.3 Contrast Minimum (Level AA): 4.5:1 for normal text, 3:1 for large text
- ✅ 1.4.10 Reflow (Level AA): Content works at 320px width (200% zoom)
- ✅ 1.4.11 Non-text Contrast (Level AA): 3:1 for UI components and graphics

**Principle 2: Operable**
- ✅ 2.1.1 Keyboard (Level A): All functionality via keyboard
- ✅ 2.1.2 No Keyboard Trap (Level A): Can navigate away from all components
- ✅ 2.4.3 Focus Order (Level A): Logical tab order
- ✅ 2.4.7 Focus Visible (Level AA): Visible focus indicators

**Principle 3: Understandable**
- ✅ 3.1.1 Language of Page (Level A): `<html lang="en">`
- ✅ 3.2.3 Consistent Navigation (Level AA): Same navigation order
- ✅ 3.3.1 Error Identification (Level A): Errors clearly described
- ✅ 3.3.2 Labels or Instructions (Level A): Form fields have labels

**Principle 4: Robust**
- ✅ 4.1.2 Name, Role, Value (Level A): ARIA attributes for custom components
- ✅ 4.1.3 Status Messages (Level AA): Status updates announced to screen readers

### Color Contrast Implementation

**Decision**: Design Tokens with WCAG AA Compliant Palette
**Rationale**: Build accessibility into the design system at the token level, preventing accidental violations.

```javascript
// tailwind.config.js - WCAG AA Compliant Palette
module.exports = {
  theme: {
    extend: {
      colors: {
        // Text on white background (4.5:1 minimum for normal text)
        text: {
          primary: '#111827',   // gray-900 - 16.5:1 ✅
          secondary: '#4b5563', // gray-600 - 7.5:1 ✅
          tertiary: '#6b7280',  // gray-500 - 5.7:1 ✅
          disabled: '#9ca3af',  // gray-400 - 3.7:1 ⚠️ (Large text only)
        },
        // Interactive elements (3:1 minimum for UI components)
        interactive: {
          primary: '#2563eb',   // blue-600 - 5.1:1 ✅
          hover: '#1d4ed8',     // blue-700 - 6.7:1 ✅
          focus: '#1e40af',     // blue-800 - 8.5:1 ✅
        },
      },
    },
  },
}
```

**Contrast Checking Pattern**:
```typescript
// utils/accessibility.ts

/**
 * Calculate relative luminance per WCAG formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Parse hex colors to RGB
  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)
  
  const l1 = getLuminance(r1, g1, b1)
  const l2 = getLuminance(r2, g2, b2)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color combination meets WCAG AA
 */
export function meetsWCAG_AA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}
```

### Keyboard Navigation

**Decision**: Native HTML Elements + Focus Management
**Rationale**: Leverage browser's built-in keyboard support, add custom behavior only when necessary, ensures broad compatibility.

**Focus Management Pattern**:
```typescript
// components/Dialog.tsx
'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export function Dialog({ isOpen, onClose, children, title }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store element that had focus before dialog opened
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus first focusable element in dialog
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    } else {
      // Restore focus when dialog closes
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  // Keyboard event handling
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Tab trapping
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body
  )
}
```

**Skip Links Pattern**:
```tsx
// components/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
    >
      Skip to main content
    </a>
  )
}

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <nav>...</nav>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}
```

**Focus Visible Styles**:
```css
/* globals.css */

/* Remove default outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Custom focus indicator for keyboard users */
:focus-visible {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
  border-radius: theme('borderRadius.sm');
}

/* High contrast focus for interactive elements */
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  box-shadow: 0 0 0 3px theme('colors.primary.500 / 0.3');
}
```

### ARIA Attributes

**Decision**: Progressive Enhancement with ARIA
**Rationale**: Use semantic HTML first, add ARIA only when needed to enhance meaning or announce dynamic changes.

**Common ARIA Patterns**:

```typescript
// 1. Loading State
<button
  disabled={isLoading}
  aria-busy={isLoading}
  aria-live="polite"
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>

// 2. Form Validation
<input
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : 'email-hint'}
/>
{error && (
  <p id="email-error" role="alert">
    {error}
  </p>
)}

// 3. Tabs Component
interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id)

  return (
    <div>
      <div role="tablist" aria-label="Content sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}

// 4. Live Regions for Dynamic Content
<div aria-live="polite" aria-atomic="true">
  {successMessage}
</div>

<div aria-live="assertive" role="alert">
  {errorMessage}
</div>

// 5. Disclosure Widget (Accordion)
<button
  aria-expanded={isOpen}
  aria-controls="panel-1"
  onClick={() => setIsOpen(!isOpen)}
>
  Section Title
</button>
<div id="panel-1" hidden={!isOpen}>
  Panel content
</div>
```

**ARIA Best Practices**:
1. **No ARIA is better than bad ARIA**: Only add when semantic HTML insufficient
2. **First Rule of ARIA**: Don't use ARIA if native HTML element exists
3. **Role, Name, State**: Every interactive element needs all three
4. **Keyboard Support**: ARIA doesn't add keyboard functionality automatically
5. **Testing**: Use screen reader to validate ARIA implementation

---

## 4. Performance Tips

### Framer Motion Optimization

**Decision**: Selective Animation with Exit Animations
**Rationale**: Motion adds polish but can hurt performance if overused. Animate transforms and opacity only, use will-change judiciously.

**Performance-Optimized Motion Pattern**:
```typescript
// components/AnimatedCard.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
}

export function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  // Respect user's motion preferences
  const shouldReduceMotion = useReducedMotion()

  // Disable animations for users who prefer reduced motion
  if (shouldReduceMotion) {
    return <div>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing
      }}
      // Only hint will-change during animation
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
```

**Hardware-Accelerated Properties**:
```typescript
// ✅ GOOD - Hardware accelerated
<motion.div
  animate={{
    x: 100,        // transform: translateX
    y: 50,         // transform: translateY
    scale: 1.2,    // transform: scale
    rotate: 45,    // transform: rotate
    opacity: 0.5,  // opacity
  }}
/>

// ❌ BAD - Triggers layout/paint
<motion.div
  animate={{
    width: 200,      // Forces reflow
    height: 100,     // Forces reflow
    backgroundColor: '#fff', // Triggers paint
    borderRadius: '50%',    // Triggers paint
  }}
/>

// ✅ ALTERNATIVE - Use clipPath for rounded corners
<motion.div
  animate={{
    clipPath: 'inset(0 round 50px)', // Compositor-friendly
  }}
/>
```

**Layout Animations with layoutId**:
```typescript
// Shared layout animation between components
import { motion, AnimatePresence } from 'framer-motion'

export function ImageGallery() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id} // Links animations between states
            onClick={() => setSelectedId(item.id)}
            className="cursor-pointer"
          >
            <img src={item.thumbnail} alt={item.title} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            layoutId={selectedId}
            className="fixed inset-0 z-50"
            onClick={() => setSelectedId(null)}
          >
            <motion.img
              src={items.find((i) => i.id === selectedId)?.fullSize}
              alt=""
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

**Scroll-Triggered Animations**:
```typescript
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null)
  
  // Track scroll progress of this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // When to start/end tracking
  })

  // Transform scroll progress into other values
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <div ref={ref} className="relative h-screen">
      <motion.div
        style={{ y, opacity }}
        className="sticky top-0"
      >
        Parallax Content
      </motion.div>
    </div>
  )
}
```

**Animation Performance Best Practices**:
1. **Respect prefers-reduced-motion**: Use `useReducedMotion()` hook
2. **Limit simultaneous animations**: Max 3-5 elements animating at once
3. **Use layoutDependency**: Prevents unnecessary layout measurements
4. **Disable animations on low-end devices**: Check `navigator.deviceMemory`
5. **Profile with React DevTools**: Identify expensive animations

**Alternative Approaches**:
1. **CSS animations only**:
   - Consider for simple cases: Better performance, no JavaScript
   - Trade-off: Less control, harder to coordinate complex sequences

2. **GSAP (GreenSock)**:
   - Consider for complex timelines: More features, better timeline control
   - Trade-off: Larger bundle, different API

### Lazy Loading Strategies

**Decision**: Dynamic Imports with next/dynamic
**Rationale**: Next.js 16's built-in code splitting is optimized for React Server Components, provides best balance of DX and performance.

**Component Lazy Loading**:
```typescript
// app/dashboard/page.tsx
import dynamic from 'next/dynamic'

// Load component only when needed
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-200" />,
  ssr: false, // Don't render on server (if not needed)
})

const UserProfile = dynamic(
  () => import('@/components/UserProfile').then((mod) => mod.UserProfile),
  { loading: () => <ProfileSkeleton /> }
)

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <UserProfile />
      <HeavyChart />
    </div>
  )
}
```

**Conditional Loading Pattern**:
```typescript
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Load component only when user interacts
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <VideoPlayerSkeleton />,
})

export function VideoSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div>
      {!showVideo && (
        <button onClick={() => setShowVideo(true)}>
          Load Video
        </button>
      )}
      {showVideo && <VideoPlayer />}
    </div>
  )
}
```

**Image Optimization**:
```typescript
// Use Next.js Image component for automatic optimization
import Image from 'next/image'

export function ProductCard({ product }) {
  return (
    <div>
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        loading="lazy" // Native lazy loading
        placeholder="blur" // Show blur while loading
        blurDataURL={product.blurDataURL} // Low-res placeholder
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

**Third-Party Script Loading**:
```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Load analytics after page interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        
        {/* Load chat widget lazily */}
        <Script
          src="https://cdn.example.com/chat-widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
```

### Lighthouse 90+ Optimization Checklist

**Core Web Vitals Targets**:
- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID (First Input Delay)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅

**1. Performance Optimizations**:
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress images automatically
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimize package imports
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react',
      'recharts',
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Strict mode for better error detection
  reactStrictMode: true,
  
  // Remove unused code
  swcMinify: true,
}

module.exports = nextConfig
```

**2. Font Optimization**:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

// Subset and preload fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent layout shift
  preload: true,
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
```

**3. Critical CSS Pattern**:
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Inline critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body { margin: 0; font-family: system-ui, sans-serif; }
              .hero { min-height: 100vh; display: flex; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**4. Reduce JavaScript Bundle**:
```typescript
// Use React Server Components (no JavaScript sent to client)
export default async function BlogPost({ params }) {
  const post = await fetchPost(params.id) // Runs on server
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

// Only add 'use client' when needed
'use client'
export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**5. Resource Hints**:
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/hero-image.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**6. Prevent Layout Shift**:
```typescript
// Always specify image dimensions
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Load immediately for above-fold images
/>

// Reserve space for dynamic content
<div className="min-h-[400px]">
  {isLoading ? <Skeleton /> : <Content />}
</div>

// Use aspect-ratio for responsive containers
<div className="aspect-video w-full">
  <iframe src="..." className="w-full h-full" />
</div>
```

**Performance Monitoring**:
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights /> {/* Real User Monitoring */}
        <Analytics /> {/* Analytics without performance impact */}
      </body>
    </html>
  )
}
```

---

## Summary & Decision Matrix

| Category | Decision | Rationale | Alternatives Considered |
|----------|----------|-----------|------------------------|
| **Color Tokens** | Tailwind extended theme with CSS variables | Runtime theming + Tailwind utilities | Styled-components (rejected: performance) |
| **Typography** | Fluid scale with clamp() | Smooth responsive text | Media query breakpoints (rejected: less fluid) |
| **Spacing** | 8px base unit (0.5rem increments) | Design system consistency | 4px base (rejected: too granular) |
| **Button Variants** | CVA with TypeScript discriminated unions | Type safety + composability | @apply in CSS (rejected: less flexible) |
| **Input States** | Controlled components with validation props | React 19 Server Actions compatibility | Uncontrolled (rejected: harder validation) |
| **Accessibility** | Semantic HTML + progressive ARIA | Broad compatibility | ARIA-first (rejected: overcomplicates) |
| **Animations** | Framer Motion with hardware-accelerated props | Balance polish and performance | GSAP (consider for complex timelines) |
| **Code Splitting** | next/dynamic with loading states | Next.js 16 optimization | Manual React.lazy (rejected: less integrated) |
| **Images** | Next.js Image with blur placeholder | Automatic optimization | Manual picture element (rejected: more work) |

**Performance Budget**:
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1
- Speed Index: < 3.4s

**Lighthouse Target**: 95+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO

---

## References

1. **Next.js 16 Documentation**: https://github.com/vercel/next.js/tree/v16.0.3/docs
2. **Tailwind CSS v3.4**: https://v3.tailwindcss.com/
3. **Motion (Framer Motion)**: https://motion.dev/docs
4. **React 19 Documentation**: https://react.dev/
5. **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
6. **Web.dev Performance**: https://web.dev/performance/
7. **Class Variance Authority**: https://cva.style/docs

**Implementation Priority**:
1. ✅ Design tokens (colors, typography, spacing) - Foundation
2. ✅ Core components (Button, Input) - Reusable building blocks
3. ✅ Accessibility infrastructure (focus management, ARIA) - Non-negotiable
4. ⚠️ Animation system (Motion) - Polish layer
5. ⚠️ Performance optimization (lazy loading, image optimization) - Continuous improvement
