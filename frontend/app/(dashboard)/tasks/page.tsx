'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/dashboard/Navigation'
import { TaskList } from '@/components/dashboard/TaskList'
import { TaskForm } from '@/components/dashboard/TaskForm'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Plus, ListFilter, CheckCircle2, Circle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'

interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

function TasksContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
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
        // Ignore localStorage errors (private mode / blocked storage)
      }

      // If localStorage is empty (e.g., social login redirect), hydrate from Better Auth
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
              // Ignore storage errors
            }
          }
        } catch {
          // If Better Auth calls fail, we'll redirect below
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
      await loadTasks(userId, token)
    }

    init()

    return () => {
      isMounted = false
    }
  }, [router])

  const loadTasks = async (userId: string, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${userId}/tasks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401) {
        localStorage.clear()
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to load tasks')
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (taskId: number) => {
    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('auth_token')
    if (!userId || !token) return

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    )

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${userId}/tasks/${taskId}/complete`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) throw new Error('Failed to update task')

      toast({
        title: 'Success',
        description: `Task marked as ${!task.completed ? 'complete' : 'incomplete'}`,
        variant: 'success',
      })
    } catch (err) {
      // Revert on error
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      )
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      })
    }
  }

  const handleCreateTask = async (data: { title: string; description: string }) => {
    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('auth_token')
    if (!userId || !token) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${userId}/tasks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) throw new Error('Failed to create task')

      const newTask = await response.json()
      setTasks((prev) => [newTask, ...prev])
      setIsCreateModalOpen(false)
      
      toast({
        title: 'Success',
        description: 'Task created successfully',
        variant: 'success',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      })
    }
  }

  const handleEditTask = async (data: { title: string; description: string }) => {
    if (!editingTask) return

    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('auth_token')
    if (!userId || !token) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${userId}/tasks/${editingTask.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) throw new Error('Failed to update task')

      const updatedTask = await response.json()
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      )
      setIsEditModalOpen(false)
      setEditingTask(null)
      
      toast({
        title: 'Success',
        description: 'Task updated successfully',
        variant: 'success',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('auth_token')
    if (!userId || !token) return

    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${userId}/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to delete task')

      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        variant: 'success',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-gray-400">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <Navigation userName={userName} />

      <main id="main-content" className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        {/* Header with filters and actions */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Tasks</h1>
            <p className="text-gray-400">Manage your daily goals and track progress.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-900/50 p-1.5 rounded-xl border border-gray-800 backdrop-blur-sm">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                filter === 'all' 
                  ? "bg-indigo-500/20 text-indigo-300 shadow-sm" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              )}
            >
              <ListFilter className="w-4 h-4" />
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                filter === 'pending' 
                  ? "bg-amber-500/20 text-amber-300 shadow-sm" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              )}
            >
              <Circle className="w-4 h-4" />
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                filter === 'completed' 
                  ? "bg-emerald-500/20 text-emerald-300 shadow-sm" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </button>
          </div>

          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Task
          </Button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          filter={filter}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDeleteTask}
        />
      </main>

      {/* Create Task Modal */}
      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <Modal.Content className="bg-[#0a0f1e] border-gray-800">
          <Modal.Header className="text-white border-gray-800">Create New Task</Modal.Header>
          <Modal.Body>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Content className="bg-[#0a0f1e] border-gray-800">
          <Modal.Header className="text-white border-gray-800">Edit Task</Modal.Header>
          <Modal.Body>
            <TaskForm
              initialTask={editingTask || undefined}
              onSubmit={handleEditTask}
              onCancel={() => {
                setIsEditModalOpen(false)
                setEditingTask(null)
              }}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default function TasksPage() {
  return (
    <ToastProvider>
      <TasksContent />
    </ToastProvider>
  )
}
