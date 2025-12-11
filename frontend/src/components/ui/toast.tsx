'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background border-border text-foreground',
        success: 'bg-success border-success text-white',
        destructive: 'bg-error border-error text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string
  title: string
  description?: string
  onClose: () => void
}

export function Toast({ id, title, description, variant, onClose }: ToastProps) {
  const isDestructive = variant === 'destructive'

  return (
    <div
      role={isDestructive ? 'alert' : 'status'}
      aria-live={isDestructive ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={cn(toastVariants({ variant }))}
    >
      <div className="grid gap-1">
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Toast Context and Provider
interface ToastContextValue {
  toasts: Array<ToastProps & { duration?: number }>
  toast: (props: Omit<ToastProps, 'id' | 'onClose'> & { duration?: number }) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { duration?: number }>>([])

  const toast = React.useCallback((props: Omit<ToastProps, 'id' | 'onClose'> & { duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = props.duration || 5000

    setToasts((prev) => [...prev, { ...props, id, onClose: () => dismiss(id) }])

    // Auto-dismiss after duration
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div
        className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
