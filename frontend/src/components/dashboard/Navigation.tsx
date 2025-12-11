'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavigationProps {
  userName?: string
  onLogout?: () => Promise<void> | void
  className?: string
}

export function Navigation({ userName, onLogout, className }: NavigationProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      if (onLogout) {
        await onLogout()
      }
      // Clear auth and redirect
      localStorage.removeItem('token')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border bg-background',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">TaskFlow</h1>
          </div>

          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm text-muted-foreground">{userName}</span>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
