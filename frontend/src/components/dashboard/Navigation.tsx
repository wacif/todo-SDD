'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogOut, User, Sparkles } from 'lucide-react'

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
      // Silently handle logout errors - user will be redirected to login anyway
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 w-full border-b border-gray-800/50 bg-[#030712]/80 backdrop-blur-xl',
        className
      )}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 group-hover:text-indigo-300 transition-all duration-300">
              <Sparkles className="h-5 w-5" />
              <div className="absolute inset-0 rounded-lg bg-indigo-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">TaskFlow</span>
          </div>

          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/50 border border-gray-800">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-gray-300">{userName}</span>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              disabled={isLoggingOut}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Sign Out'}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
