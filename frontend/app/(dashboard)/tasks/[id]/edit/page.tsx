'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Navigation } from '@/components/dashboard/Navigation'
import { TaskForm } from '@/components/dashboard/TaskForm'
import { Skeleton } from '@/components/ui/skeleton'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { getTask, updateTask, type Task as ApiTask, type TaskInput } from '@/lib/api'
import { authClient } from '@/lib/auth-client'

function EditTaskContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const taskId = Number(params.id)

  const [task, setTask] = React.useState<ApiTask | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [userName, setUserName] = React.useState('')
  const [auth, setAuth] = React.useState<{ userId: string; token: string } | null>(null)

  React.useEffect(() => {
    if (!Number.isFinite(taskId)) {
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
      setAuth({ userId, token })

      try {
        const fetched = await getTask(userId, taskId)
        if (!isMounted) return
        setTask(fetched)
      } catch (e) {
        if (!isMounted) return
        toast({
          title: 'Error',
          description: e instanceof Error ? e.message : 'Failed to load task',
          variant: 'destructive',
        })
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [router, taskId, toast])

  const handleSubmit = async (data: { title: string; description: string; priority: 'high' | 'medium' | 'low'; tags: string[] }) => {
    if (!auth) return

    const input: TaskInput = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      tags: data.tags,
    }

    const updated = await updateTask(auth.userId, taskId, input)
    setTask(updated)
    toast({
      title: 'Success',
      description: 'Task updated successfully',
      variant: 'success',
    })
    router.push(`/tasks/${taskId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <Navigation userName={userName || 'User'} />
        <main className="container mx-auto px-4 py-12 max-w-3xl space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </main>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <Navigation userName={userName || 'User'} />
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-white">Task not found.</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <Navigation userName={userName || 'User'} />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Task</h1>
        <TaskForm
          initialTask={{
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            priority: task.priority,
            tags: task.tags,
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/tasks/${taskId}`)}
        />
      </main>
    </div>
  )
}

export default function EditTaskPage({ params }: { params: { id: string } }) {
  return (
    <ToastProvider>
      <EditTaskContent params={params} />
    </ToastProvider>
  )
}