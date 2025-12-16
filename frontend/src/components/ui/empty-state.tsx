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
    <div className={cn('flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500', className)}>
      <div
        className={cn(
          'rounded-2xl p-10 flex flex-col items-center',
          variant === 'default' && 'bg-muted/30 border border-border backdrop-blur-sm'
        )}
      >
        {Icon && (
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-16 w-16 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-center shadow-inner">
              <Icon
                className="h-8 w-8 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300"
                aria-hidden="true"
                data-testid="empty-state-icon"
              />
            </div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">{title}</h3>
        {description && (
          <p className="text-gray-400 max-w-sm leading-relaxed">{description}</p>
        )}
        {action && (
          <div className="mt-8">
            {action.href ? (
              <Link href={action.href}>
                <Button className="shadow-lg shadow-indigo-500/20">{action.label}</Button>
              </Link>
            ) : (
              <Button onClick={action.onClick} className="shadow-lg shadow-indigo-500/20">{action.label}</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

