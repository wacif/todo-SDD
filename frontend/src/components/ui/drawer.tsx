'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  position?: 'left' | 'right'
}

export function Drawer({
  open,
  onClose,
  children,
  title,
  position = 'left',
}: DrawerProps) {
  // Prevent body scroll when drawer is open
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        data-testid="drawer-overlay"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        data-position={position}
        className={cn(
          'fixed top-0 bottom-0 bg-background shadow-xl w-full max-w-sm transition-transform duration-300',
          position === 'left' ? 'left-0' : 'right-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full">{children}</div>
      </div>
    </div>
  )
}
