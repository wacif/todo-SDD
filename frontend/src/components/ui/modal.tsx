'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalContextValue {
  onClose: () => void
}

const ModalContext = React.createContext<ModalContextValue | undefined>(undefined)

function useModalContext() {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('Modal compound components must be used within Modal')
  }
  return context
}

interface ModalProps {
  open: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export function Modal({ open, onClose, size = 'md', children }: ModalProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Handle Escape key
  React.useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Focus trap
  React.useEffect(() => {
    if (!open || !contentRef.current) return

    const content = contentRef.current
    const focusableElements = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    firstElement?.focus()

    return () => document.removeEventListener('keydown', handleTab)
  }, [open])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          data-testid="modal-overlay"
          aria-hidden="true"
        />
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

function ModalContent({ children, className }: ModalContentProps) {
  return <div className={cn('relative', className)}>{children}</div>
}

interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

function ModalHeader({ children, className }: ModalHeaderProps) {
  const { onClose } = useModalContext()
  const headerId = React.useId()

  React.useEffect(() => {
    const dialog = document.querySelector('[role="dialog"]')
    if (dialog) {
      dialog.setAttribute('aria-labelledby', headerId)
    }
  }, [headerId])

  return (
    <div className={cn('flex items-center justify-between p-6 border-b border-gray-800', className)}>
      <h2 id={headerId} className="text-xl font-semibold text-white">
        {children}
      </h2>
      <button
        onClick={onClose}
        className="rounded-md p-1 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Close modal"
      >
        <X className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  )
}

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 border-t border-gray-800', className)}>
      {children}
    </div>
  )
}

Modal.Content = ModalContent
Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter
