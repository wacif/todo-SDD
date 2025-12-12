'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/dashboard/Navigation'
import { TaskList } from '@/components/dashboard/TaskList'
import { TaskForm } from '@/components/dashboard/TaskForm'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Plus } from 'lucide-react'

interface Task {
  id: string
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
    const token = localStorage.getItem('auth_token')
    const userId = localStorage.getItem('user_id')
    const name = localStorage.getItem('user_name')

    if (!token || !userId) {
      router.push('/login')
      return
    }

    setUserName(name || 'User')
    loadTasks(userId, token)
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

  const handleToggleComplete = async (taskId: string) => {
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
          method: 'PUT',
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

  const handleDeleteTask = async (taskId: string) => {
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
    <div className="min-h-screen bg-[#030712]">
      <Navigation userName={userName} />

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with filters and actions */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'completed' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Task
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
        <Modal.Content>
          <Modal.Header>Create New Task</Modal.Header>
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
        <Modal.Content>
          <Modal.Header>Edit Task</Modal.Header>
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
