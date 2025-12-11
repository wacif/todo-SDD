'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTaskPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/tasks')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
