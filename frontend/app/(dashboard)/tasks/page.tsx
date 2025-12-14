'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/dashboard/Navigation'
import { TaskList } from '@/components/dashboard/TaskList'
import { TaskForm } from '@/components/dashboard/TaskForm'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
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
  priority: 'high' | 'medium' | 'low'
  tags: string[]
  created_at: string
  updated_at: string
}

type TaskListQuery = {
  status?: 'completed' | 'pending'
  priority?: 'high' | 'medium' | 'low'
  tag?: string
  q?: string
  sort?: 'title' | 'priority'
  order?: 'asc' | 'desc'
}

type TaskFormPayload = {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  tags: string[]
}

function TasksContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [tagFilter, setTagFilter] = useState('')
  const [sort, setSort] = useState<'created_at' | 'title' | 'priority'>('created_at')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [auth, setAuth] = useState<{ userId: string; token: string } | null>(null)

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
      setAuth({ userId, token })
      await loadTasks(userId, token, {})
    }

    init()

    return () => {
      isMounted = false
    }
  }, [router])

  useEffect(() => {
    if (!auth) return

    const query: TaskListQuery = {
      status: filter === 'all' ? undefined : filter,
      priority: priorityFilter === 'all' ? undefined : priorityFilter,
      tag: tagFilter.trim() ? tagFilter.trim() : undefined,
      q: search.trim() ? search.trim() : undefined,
      sort: sort === 'created_at' ? undefined : sort,
      order,
    }

    const handle = setTimeout(() => {
      loadTasks(auth.userId, auth.token, query)
    }, 250)

    return () => clearTimeout(handle)
  }, [auth, filter, priorityFilter, tagFilter, search, sort, order])

  const loadTasks = async (userId: string, token: string, query: TaskListQuery) => {
    try {
      const params = new URLSearchParams()
      if (query.status) params.set('status', query.status)
      if (query.priority) params.set('priority', query.priority)
      if (query.tag) params.set('tag', query.tag)
      if (query.q) params.set('q', query.q)
      if (query.sort) params.set('sort', query.sort)
      if (query.order) params.set('order', query.order)

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${userId}/tasks`
      )
      if ([...params.keys()].length > 0) {
        url.search = params.toString()
      }

      const response = await fetch(
        url.toString(),
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

  const handleCreateTask = async (data: TaskFormPayload) => {
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

  const handleEditTask = async (data: TaskFormPayload) => {
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

  const handleRequestDelete = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId) || null
    setDeletingTask(task)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingTask) return

    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('auth_token')
    if (!userId || !token) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${userId}/tasks/${deletingTask.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to delete task')

      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id))
      setIsDeleteModalOpen(false)
      setDeletingTask(null)

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
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <LoadingSpinner label="Loading tasks..." />
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
              aria-pressed={filter === 'all'}
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
              aria-pressed={filter === 'pending'}
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
              aria-pressed={filter === 'completed'}
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

        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title/description"
            fullWidth
            className="bg-gray-900/50 border-gray-800 focus:border-indigo-500/50 focus:ring-indigo-500/20"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white" htmlFor="priority-filter">
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className={cn(
                'flex h-10 w-full rounded-md border bg-gray-900/50 px-3 py-2 text-sm text-white',
                'border-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-gray-950'
              )}
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <Input
            label="Tag"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="e.g. work"
            fullWidth
            className="bg-gray-900/50 border-gray-800 focus:border-indigo-500/50 focus:ring-indigo-500/20"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white" htmlFor="sort-by">
              Sort
            </label>
            <select
              id="sort-by"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className={cn(
                'flex h-10 w-full rounded-md border bg-gray-900/50 px-3 py-2 text-sm text-white',
                'border-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-gray-950'
              )}
            >
              <option value="created_at">Created</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white" htmlFor="sort-order">
              Order
            </label>
            <select
              id="sort-order"
              value={order}
              onChange={(e) => setOrder(e.target.value as any)}
              className={cn(
                'flex h-10 w-full rounded-md border bg-gray-900/50 px-3 py-2 text-sm text-white',
                'border-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-gray-950'
              )}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          filter={filter}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleRequestDelete}
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          if (isDeleting) return
          setIsDeleteModalOpen(false)
          setDeletingTask(null)
        }}
        size="sm"
      >
        <Modal.Content className="bg-[#0a0f1e] border-gray-800">
          <Modal.Header className="text-white border-gray-800">Delete task?</Modal.Header>
          <Modal.Body>
            <p className="text-gray-300">
              This action can’t be undone.
              {deletingTask?.title ? (
                <span className="block mt-2 text-white">{deletingTask.title}</span>
              ) : null}
            </p>
          </Modal.Body>
          <Modal.Footer className="border-gray-800">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setDeletingTask(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              aria-label="Confirm delete task"
            >
              Delete
            </Button>
          </Modal.Footer>
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
