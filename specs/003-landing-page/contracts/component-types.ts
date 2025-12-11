/**
 * Core UI Component Contracts
 * 
 * TypeScript interfaces for the design system components.
 * These contracts define the public API for all reusable UI components.
 */

import { ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { VariantProps } from 'class-variance-authority'

// ============================================================================
// Button Component
// ============================================================================

export const buttonVariants = {
  variants: {
    variant: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-muted text-foreground hover:bg-muted/80',
      ghost: 'hover:bg-muted/50',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-11 px-6 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary' as const,
    size: 'md' as const,
  },
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether the button is in a loading state (shows spinner, disables interaction) */
  isLoading?: boolean
  /** Additional CSS classes */
  className?: string
  /** Button content */
  children: ReactNode
}

// ============================================================================
// Input Component
// ============================================================================

export const inputVariants = {
  variants: {
    state: {
      default: 'border-border focus-visible:ring-primary-500',
      error: 'border-red-500 focus-visible:ring-red-500',
      success: 'border-green-500 focus-visible:ring-green-500',
    },
  },
  defaultVariants: {
    state: 'default' as const,
  },
}

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  /** Label text for the input */
  label?: string
  /** Error message to display (sets state to error) */
  error?: string
  /** Helper text displayed below input */
  helperText?: string
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Card Component
// ============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Body content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Footer content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Modal Component
// ============================================================================

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Modal title (for accessibility) */
  title?: string
  /** Modal description (for accessibility) */
  description?: string
  /** Modal content */
  children: ReactNode
  /** Modal size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick?: boolean
  /** Whether to show close button */
  showCloseButton?: boolean
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Toast Component
// ============================================================================

export interface ToastProps {
  /** Unique identifier for the toast */
  id: string
  /** Toast type determines styling and icon */
  type: 'success' | 'error' | 'warning' | 'info'
  /** Optional title */
  title?: string
  /** Toast message */
  message: string
  /** Duration in milliseconds (0 = no auto-dismiss) */
  duration?: number
  /** Callback when toast is closed */
  onClose?: () => void
  /** Optional action button */
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastContextValue {
  /** Show a success toast */
  success: (message: string, options?: Partial<ToastProps>) => void
  /** Show an error toast */
  error: (message: string, options?: Partial<ToastProps>) => void
  /** Show a warning toast */
  warning: (message: string, options?: Partial<ToastProps>) => void
  /** Show an info toast */
  info: (message: string, options?: Partial<ToastProps>) => void
  /** Dismiss a specific toast */
  dismiss: (id: string) => void
}

// ============================================================================
// Navigation Component
// ============================================================================

export interface NavigationItem {
  /** Display label */
  label: string
  /** Link href */
  href: string
  /** Optional icon */
  icon?: ReactNode
  /** Whether this item is currently active */
  isActive?: boolean
  /** Optional badge (e.g., notification count) */
  badge?: string | number
}

export interface NavigationProps {
  /** Navigation items */
  items: NavigationItem[]
  /** Logo component */
  logo?: ReactNode
  /** Current user info (for user menu) */
  user?: {
    name: string
    email: string
    avatar?: string
  }
  /** Callback when user logs out */
  onLogout?: () => void
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Loading/Skeleton Component
// ============================================================================

export interface SkeletonProps {
  /** Skeleton shape variant */
  variant?: 'text' | 'circular' | 'rectangular'
  /** Width (CSS value) */
  width?: string | number
  /** Height (CSS value) */
  height?: string | number
  /** Number of skeleton elements to render */
  count?: number
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// EmptyState Component
// ============================================================================

export interface EmptyStateProps {
  /** Icon to display */
  icon?: ReactNode
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Optional call-to-action */
  action?: {
    label: string
    onClick: () => void
  }
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Badge Component
// ============================================================================

export const badgeVariants = {
  variants: {
    variant: {
      default: 'bg-primary-100 text-primary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
    },
  },
  defaultVariants: {
    variant: 'default' as const,
    size: 'md' as const,
  },
}

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Badge content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Dropdown Component
// ============================================================================

export interface DropdownItem {
  /** Display label */
  label: string
  /** Optional icon */
  icon?: ReactNode
  /** Click handler */
  onClick: () => void
  /** Whether item is disabled */
  disabled?: boolean
  /** Whether item is destructive (red text) */
  destructive?: boolean
}

export interface DropdownProps {
  /** Trigger button content */
  trigger: ReactNode
  /** Dropdown menu items */
  items: DropdownItem[]
  /** Dropdown alignment */
  align?: 'start' | 'end'
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Tooltip Component
// ============================================================================

export interface TooltipProps {
  /** Content to show in tooltip */
  content: string
  /** Element that triggers tooltip */
  children: ReactNode
  /** Tooltip position */
  position?: 'top' | 'right' | 'bottom' | 'left'
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Form Components
// ============================================================================

export interface TextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  /** Label text */
  label?: string
  /** Error message */
  error?: string
  /** Helper text */
  helperText?: string
  /** Number of visible rows */
  rows?: number
  /** Additional CSS classes */
  className?: string
}

export interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label: string
  /** Helper text */
  helperText?: string
  /** Additional CSS classes */
  className?: string
}

export interface RadioGroupProps {
  /** Group name (for form data) */
  name: string
  /** Group label */
  label?: string
  /** Radio options */
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>
  /** Current selected value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Additional CSS classes */
  className?: string
}

export interface SelectProps
  extends InputHTMLAttributes<HTMLSelectElement> {
  /** Label text */
  label?: string
  /** Error message */
  error?: string
  /** Select options */
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>
  /** Placeholder option */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
}
