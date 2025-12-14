'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Navigation } from '@/components/dashboard/Navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getTask, type Task as ApiTask } from '@/lib/api'
import { authClient } from '@/lib/auth-client'

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const taskId = Number(params.id)

  const [task, setTask] = React.useState<ApiTask | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userName, setUserName] = React.useState('')

  React.useEffect(() => {
    if (!Number.isFinite(taskId)) {
      setError('Invalid task id')
      setLoading(false)
      return
    }

    let isMounted = true

    const init = async () => {
      let token: string | null = null
      let userId: string | null = null
      let name: string | null = null

      try {
        token = localStorage.getItem('auth_token')
        userId = localStorage.getItem('user_id')
        name = localStorage.getItem('user_name')
      } catch {
        // ignore
      }

      if (!token || !userId) {
        try {
          const [{ data: sessionData }, { data: tokenData }] = await Promise.all([
            authClient.getSession(),
            authClient.token(),
          ])

          token = tokenData?.token ?? null
          userId = sessionData?.user?.id ?? null
          name = sessionData?.user?.name ?? sessionData?.user?.email ?? null

          if (token && userId) {
            try {
              localStorage.setItem('auth_token', token)
              localStorage.setItem('user_id', userId)
              if (name) localStorage.setItem('user_name', name)
            } catch {
              // ignore
            }
          }
        } catch {
          // ignore
        }
      }

      if (!token || !userId) {
        if (!isMounted) return
        setLoading(false)
        router.replace('/login')
        return
      }

      if (!isMounted) return
      setUserName(name || 'User')

      try {
        const fetched = await getTask(userId, taskId)
        if (!isMounted) return
        setTask(fetched)
      } catch (e) {
        if (!isMounted) return
        setError(e instanceof Error ? e.message : 'Failed to load task')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [router, taskId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <Navigation userName={userName || 'User'} />
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <Navigation userName={userName || 'User'} />
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 text-white">
            <h1 className="text-xl font-semibold">Task not found</h1>
            <p className="mt-2 text-gray-400">{error || 'Unable to load task.'}</p>
            <div className="mt-6">
              <Button onClick={() => router.push('/tasks')}>Back to tasks</Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <Navigation userName={userName || 'User'} />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{task.title}</h1>
            {task.description ? (
              <p className="mt-3 text-gray-300 whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="mt-3 text-gray-500">No description</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/tasks/${task.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant={task.completed ? 'success' : 'secondary'}>
            {task.completed ? 'Completed' : 'Pending'}
          </Badge>
          <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'low' ? 'secondary' : 'warning'}>
            {task.priority}
          </Badge>
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/tasks" className="text-sm text-gray-400 hover:text-white">
            ← Back to tasks
          </Link>
        </div>
      </main>
    </div>
  )
}