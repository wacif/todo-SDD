import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EmptyStateAction {
  label: string
  onClick?: () => void
  href?: string
}

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
  variant?: 'default' | 'minimal'
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div
        className={cn(
          'rounded-lg p-8',
          variant === 'default' && 'bg-gray-900/30 border border-gray-800'
        )}
      >
        {Icon && (
          <Icon
            className="mx-auto h-12 w-12 text-gray-500 mb-4"
            aria-hidden="true"
            data-testid="empty-state-icon"
          />
        )}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-400 max-w-sm">{description}</p>
        )}
        {action && (
          <div className="mt-6">
            {action.href ? (
              <Link href={action.href}>
                <Button>{action.label}</Button>
              </Link>
            ) : (
              <Button onClick={action.onClick}>{action.label}</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
