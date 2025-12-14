'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({
  className,
  label = 'Loading…',
  size = 'md',
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      {...props}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-border border-t-primary-600',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
    </div>
  )
}
