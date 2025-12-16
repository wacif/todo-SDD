'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import {
  Activity,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Command,
  CornerDownRight,
  Flag,
  ListOrdered,
  LogOut,
  Menu,
  Plus,
  Save,
  Sparkles,
  Tag,
  Trash2,
  X,
  AlignLeft,
} from 'lucide-react'

import { authClient, signOut } from '@/lib/auth-client'
import { ApiError, createTask, deleteTask, listTasks, toggleTaskComplete, updateTask, type Task as ApiTask, type Subtask } from '@/lib/api'
import { breakdownTask, generateSchedule, prioritizeTasks, type ScheduleItem } from '@/services/inboxAi'
import { InboxToaster, type InboxToast } from '@/components/dashboard/InboxToaster'

type FilterMode = 'all' | 'active' | 'completed' | 'high' | 'tag'
type SidebarMode = 'inbox' | 'today' | 'upcoming' | 'filters'

// UiTask extends ApiTask with parsed dueDate as Date object
type UiTask = Omit<ApiTask, 'due_date'> & {
  dueDate?: Date
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const priorityConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'High' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Medium' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Low' },
} as const

const formatDate = (date?: Date | string) => {
  if (!date) return 'No Date'
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()

  if (isToday) return 'Today'
  if (isTomorrow) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const tagLabel = (tag: string) => (tag?.length ? tag[0].toUpperCase() + tag.slice(1) : tag)

function buildUiTasks(tasks: ApiTask[]): UiTask[] {
  return tasks.map((t) => {
    const { due_date, ...rest } = t
    const dueDate = due_date ? new Date(due_date) : undefined
    return { ...rest, dueDate }
  })
}

function TasksContent() {
  const router = useRouter()

  const [auth, setAuth] = useState<{ userId: string; token: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [toasts, setToasts] = useState<InboxToast[]>([])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('inbox')
  const [activeFilter, setActiveFilter] = useState<FilterMode>('all')
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const [inputValue, setInputValue] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskTag, setNewTaskTag] = useState<string>('Inbox')
  const [newTaskDate, setNewTaskDate] = useState<Date | undefined>(new Date())
  const [isTagOpen, setIsTagOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [tagSearch, setTagSearch] = useState('')
  const [calendarViewDate, setCalendarViewDate] = useState(new Date())

  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isPrioritizing, setIsPrioritizing] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'schedule'>('list')
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])

  const [editingTask, setEditingTask] = useState<UiTask | null>(null)
  const [savingTask, setSavingTask] = useState(false)
  const [pendingOperations, setPendingOperations] = useState(0)

  const [focusedIndex, setFocusedIndex] = useState(-1)

  const abortRef = useRef<AbortController | null>(null)

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
      setAuth({ userId, token, name: name || 'User' })
    }

    init()

    return () => {
      isMounted = false
    }
  }, [router])

  useEffect(() => {
    if (!auth) return

    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const load = async () => {
      try {
        setLoading(true)
        const res = await listTasks(auth.userId, { limit: 100, offset: 0 })
        setTasks(res.tasks || [])
      } catch (e) {
        // Only bounce to login when the token is actually invalid/expired.
        if (e instanceof ApiError && e.status === 401) {
          router.replace('/login')
        } else {
          addToast('Failed to load tasks. Please refresh and try again.', 'error')
        }
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => controller.abort()
  }, [auth, router])

  const addToast = (message: string, type: InboxToast['type'] = 'success') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const uiTasks = useMemo(() => {
    if (!auth) return [] as UiTask[]
    return buildUiTasks(tasks)
  }, [auth, tasks])

  const availableTags = useMemo(() => {
    const base = new Set<string>(['Inbox', 'Strategy', 'Design', 'Dev', 'Personal', 'Urgent'])
    for (const t of uiTasks) {
      for (const tag of t.tags || []) {
        if (!tag) continue
        // Convert stored lower-case tags into a nicer display label.
        const label = tag.length ? tag[0].toUpperCase() + tag.slice(1) : tag
        base.add(label)
      }
    }
    return Array.from(base)
  }, [uiTasks])

  const completionRate = useMemo(() => {
    if (uiTasks.length === 0) return 0
    return Math.round((uiTasks.filter((t) => t.completed).length / uiTasks.length) * 100)
  }, [uiTasks])

  const filteredTasks = useMemo(() => {
    let result = uiTasks
    const today = new Date()
    switch (activeFilter) {
      case 'active':
        result = uiTasks.filter((t) => !t.completed)
        break
      case 'completed':
        result = uiTasks.filter((t) => t.completed)
        break
      case 'high':
        result = uiTasks.filter((t) => t.priority === 'high')
        break
      case 'tag':
        result =
          tagFilter ? uiTasks.filter((t) => (t.tags || []).includes(tagFilter.toLowerCase())) : uiTasks
        break
      default:
        result = uiTasks
    }
    if (sidebarMode === 'today') {
      result = result.filter((t) => t.dueDate && sameDay(t.dueDate, today))
    } else if (sidebarMode === 'upcoming') {
      result = result.filter((t) => t.dueDate && t.dueDate > today)
    }
    return result
  }, [uiTasks, activeFilter, tagFilter, sidebarMode])

  const filteredTags = useMemo(() => {
    return availableTags.filter((t) => t.toLowerCase().includes(tagSearch.toLowerCase()))
  }, [availableTags, tagSearch])

  const cyclePriority = () => {
    const map: Record<string, 'low' | 'medium' | 'high'> = { low: 'medium', medium: 'high', high: 'low' }
    setNewTaskPriority(map[newTaskPriority])
  }

  const handleSetDate = (date: Date | undefined) => {
    setNewTaskDate(date)
    setIsDateOpen(false)
  }

  const changeMonth = (offset: number) => {
    const newDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + offset, 1)
    setCalendarViewDate(newDate)
  }

  const renderCalendarDays = () => {
    const year = calendarViewDate.getFullYear()
    const month = calendarViewDate.getMonth()
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    const startDay = new Date(year, month, 1).getDay()

    const days: React.ReactNode[] = []
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
    }
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const date = new Date(year, month, d)
      const isSelected = newTaskDate && date.toDateString() === newTaskDate.toDateString()
      const isToday = new Date().toDateString() === date.toDateString()
      days.push(
        <button
          key={d}
          onClick={(e) => {
            e.preventDefault()
            handleSetDate(date)
          }}
          className={[
            'h-8 w-8 rounded-full text-xs flex items-center justify-center transition-all',
            isSelected ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-white/10 text-gray-300',
            isToday && !isSelected ? 'text-indigo-400 font-bold' : '',
          ].join(' ')}
        >
          {d}
        </button>
      )
    }
    return days
  }

  const handleCreateTag = () => {
    if (!tagSearch.trim()) return
    const newTag = tagSearch.trim()
    setNewTaskTag(newTag)
    setTagSearch('')
    setIsTagOpen(false)
  }

  const handleAddTask = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!auth) return
    if (!inputValue.trim()) return

    // Generate a temporary ID for optimistic update
    const tempId = -Date.now()
    const optimisticTask: ApiTask = {
      id: tempId,
      user_id: auth.userId,
      title: inputValue.trim(),
      description: '',
      priority: newTaskPriority,
      tags: [newTaskTag.toLowerCase()],
      due_date: newTaskDate ? newTaskDate.toISOString() : null,
      subtasks: [],
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Optimistically add the task immediately
    setTasks((prev) => [optimisticTask, ...prev])
    
    // Clear input immediately for snappy UX
    const savedInput = inputValue
    const savedPriority = newTaskPriority
    const savedTag = newTaskTag
    const savedDate = newTaskDate
    setInputValue('')
    setNewTaskPriority('medium')
    setNewTaskTag('Inbox')
    setNewTaskDate(new Date())

    setPendingOperations((n) => n + 1)
    try {
      const created = await createTask(auth.userId, {
        title: savedInput.trim(),
        description: '',
        priority: savedPriority,
        tags: [savedTag.toLowerCase()],
        due_date: savedDate ? savedDate.toISOString() : null,
        subtasks: [],
      })

      // Replace optimistic task with real one
      setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)))
      addToast('Task created successfully', 'success')
    } catch {
      // Rollback on failure
      setTasks((prev) => prev.filter((t) => t.id !== tempId))
      // Restore input so user doesn't lose their work
      setInputValue(savedInput)
      setNewTaskPriority(savedPriority)
      setNewTaskTag(savedTag)
      setNewTaskDate(savedDate)
      addToast('Failed to create task', 'error')
    } finally {
      setPendingOperations((n) => Math.max(0, n - 1))
    }
  }

  const toggleTask = async (id: number) => {
    if (!auth) return
    const current = tasks.find((t) => t.id === id)
    if (!current) return

    // Optimistic update immediately
    const newCompleted = !current.completed
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)))
    
    setPendingOperations((n) => n + 1)
    try {
      const updated = await toggleTaskComplete(auth.userId, id)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      addToast(`Task marked as ${updated.completed ? 'complete' : 'incomplete'}`, 'success')
    } catch {
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: current.completed } : t)))
      addToast('Failed to update task', 'error')
    } finally {
      setPendingOperations((n) => Math.max(0, n - 1))
    }
  }

  const openTaskDetail = (task: UiTask) => {
    const draft: UiTask = JSON.parse(JSON.stringify(task))
    if (draft.dueDate) draft.dueDate = new Date(draft.dueDate)
    setEditingTask(draft)
    setCalendarViewDate(task.dueDate ? new Date(task.dueDate) : new Date())
  }

  const updateEditingTask = (updates: Partial<UiTask>) => {
    setEditingTask((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const [isDetailDateOpen, setIsDetailDateOpen] = useState(false)

  const handleSetDetailDate = (date: Date | undefined) => {
    updateEditingTask({ dueDate: date })
    setIsDetailDateOpen(false)
  }

  const renderDetailCalendarDays = (currentDate: Date, onSelect: (d: Date | undefined) => void) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    const startDay = new Date(year, month, 1).getDay()

    const days: React.ReactNode[] = []
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
    }
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const date = new Date(year, month, d)
      const isSelected = editingTask?.dueDate && date.toDateString() === editingTask.dueDate.toDateString()
      const isToday = new Date().toDateString() === date.toDateString()
      days.push(
        <button
          key={d}
          onClick={(e) => {
            e.preventDefault()
            onSelect(date)
          }}
          className={[
            'h-8 w-8 rounded-full text-xs flex items-center justify-center transition-all',
            isSelected ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-white/10 text-gray-300',
            isToday && !isSelected ? 'text-indigo-400 font-bold' : '',
          ].join(' ')}
        >
          {d}
        </button>
      )
    }
    return days
  }

  const handleSaveTask = async () => {
    if (!auth) return
    if (!editingTask) return
    
    // Store original task for potential rollback
    const originalTask = tasks.find((t) => t.id === editingTask.id)
    
    // Optimistically update UI immediately
    const optimisticApiTask: ApiTask = {
      ...editingTask,
      due_date: editingTask.dueDate ? editingTask.dueDate.toISOString() : null,
      updated_at: new Date().toISOString(),
    }
    setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? optimisticApiTask : t)))
    
    // Close panel immediately for snappy UX
    const taskToSave = { ...editingTask }
    setEditingTask(null)
    addToast('Task updated', 'success')
    setSavingTask(true)
    setPendingOperations((n) => n + 1)

    try {
      const next = await updateTask(auth.userId, taskToSave.id, {
        title: taskToSave.title,
        description: taskToSave.description || '',
        priority: taskToSave.priority,
        tags: (taskToSave.tags || []).map((t) => t.toLowerCase()),
        due_date: taskToSave.dueDate ? taskToSave.dueDate.toISOString() : null,
        subtasks: taskToSave.subtasks || [],
      })
      
      // Update with server response
      setTasks((prev) => prev.map((t) => (t.id === next.id ? next : t)))

      // Completion toggles must hit the /complete endpoint.
      if (originalTask && originalTask.completed !== taskToSave.completed) {
        const toggled = await toggleTaskComplete(auth.userId, taskToSave.id)
        setTasks((prev) => prev.map((t) => (t.id === toggled.id ? toggled : t)))
      }
    } catch {
      // Rollback on failure
      if (originalTask) {
        setTasks((prev) => prev.map((t) => (t.id === originalTask.id ? originalTask : t)))
      }
      addToast('Failed to update task - changes reverted', 'error')
    } finally {
      setSavingTask(false)
      setPendingOperations((n) => Math.max(0, n - 1))
    }
  }

  const handleDeleteTask = async (id: number) => {
    if (!auth) return
    
    // Store task for potential rollback
    const deletedTask = tasks.find((t) => t.id === id)
    
    // Optimistically remove immediately
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setEditingTask((prev) => (prev?.id === id ? null : prev))
    addToast('Task deleted', 'info')
    
    setPendingOperations((n) => n + 1)
    try {
      await deleteTask(auth.userId, id)
    } catch {
      // Rollback on failure
      if (deletedTask) {
        setTasks((prev) => [deletedTask, ...prev])
      }
      addToast('Failed to delete task - restored', 'error')
    } finally {
      setPendingOperations((n) => Math.max(0, n - 1))
    }
  }

  const handleAiExpand = async () => {
    if (!auth) return
    if (editingTask) {
      if (!editingTask.title) return
      setIsAiLoading(true)
      addToast('Generating subtasks...', 'info')
      try {
        const brokenDown = await breakdownTask(editingTask.title)
        const newSubtasks: Subtask[] = brokenDown.map((text, idx) => ({
          id: `${Date.now()}-${idx}`,
          text,
          completed: false,
        }))
        const merged = [...(editingTask.subtasks || []), ...newSubtasks]
        updateEditingTask({ subtasks: merged })
        // Subtasks will be saved when user clicks "Update Task"
        addToast('Subtasks generated', 'success')
      } catch {
        addToast('Failed to generate subtasks', 'error')
      } finally {
        setIsAiLoading(false)
      }
    } else {
      if (!inputValue.trim()) return
      setIsAiLoading(true)
      addToast('Breaking down task...', 'info')
      
      // Save and clear input immediately
      const savedInput = inputValue
      const savedPriority = newTaskPriority
      const savedDate = newTaskDate
      setInputValue('')
      
      try {
        const brokenDown = await breakdownTask(savedInput.trim())
        
        // Create optimistic tasks immediately
        const tempTasks: ApiTask[] = brokenDown.map((text, idx) => ({
          id: -(Date.now() + idx),
          user_id: auth.userId,
          title: text,
          description: '',
          priority: savedPriority,
          tags: ['ai generated'],
          due_date: savedDate ? savedDate.toISOString() : null,
          subtasks: [],
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
        
        setTasks((prev) => [...tempTasks, ...prev])
        addToast(`${brokenDown.length} tasks generated`, 'success')
        
        // Create real tasks in background
        for (let i = 0; i < brokenDown.length; i++) {
          const text = brokenDown[i]
          const tempId = tempTasks[i].id
          try {
            const t = await createTask(auth.userId, {
              title: text,
              description: '',
              priority: savedPriority,
              tags: ['ai generated'],
              due_date: savedDate ? savedDate.toISOString() : null,
              subtasks: [],
            })
            setTasks((prev) => prev.map((task) => (task.id === tempId ? t : task)))
          } catch {
            // Remove failed task
            setTasks((prev) => prev.filter((task) => task.id !== tempId))
          }
        }
      } catch {
        // Restore input on total failure
        setInputValue(savedInput)
        addToast('Failed to break down task', 'error')
      } finally {
        setIsAiLoading(false)
      }
    }
  }

  const handleSmartPrioritize = async () => {
    if (uiTasks.length < 2) return
    setIsPrioritizing(true)
    const ids = await prioritizeTasks(uiTasks.map((t) => ({ id: t.id, text: t.title })))
    const map = new Map<number, ApiTask>(tasks.map((t) => [t.id, t]))
    const newOrder: ApiTask[] = []
    ids.forEach((id) => {
      const t = map.get(id)
      if (t) {
        newOrder.push(t)
        map.delete(id)
      }
    })
    map.forEach((t) => newOrder.push(t))
    setTasks(newOrder)
    setIsPrioritizing(false)
    addToast('Tasks prioritized', 'success')
  }

  const handleGenerateSchedule = async () => {
    setIsScheduling(true)
    const active = uiTasks.filter((t) => !t.completed).map((t) => ({ id: t.id, text: t.title }))
    const next = await generateSchedule(active)
    setSchedule(next)
    setViewMode('schedule')
    setIsScheduling(false)
    addToast('Flow schedule created', 'success')
  }

  // Keyboard navigation (j/k/enter/esc), sample parity.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === 'Escape') {
        setEditingTask(null)
        setFocusedIndex(-1)
      } else if (e.key === 'j') {
        setFocusedIndex((prev) => Math.min(prev + 1, filteredTasks.length - 1))
      } else if (e.key === 'k') {
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        if (focusedIndex >= 0 && filteredTasks[focusedIndex]) {
          openTaskDetail(filteredTasks[focusedIndex])
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredTasks, focusedIndex])

  useEffect(() => {
    setFocusedIndex(-1)
  }, [activeFilter, tagFilter, sidebarMode])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {
      // ignore
    } finally {
      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_name')
      } catch {
        // ignore
      }
      router.replace('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-gray-200">
        <div className="text-sm text-gray-400">Loading tasks…</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-gray-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      <InboxToaster toasts={toasts} onDismiss={dismissToast} />
      {/* ---------------- Sidebar ---------------- */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 0 }}
        className="bg-[#0c0c0e] border-r border-white/5 flex-shrink-0 flex flex-col overflow-hidden relative z-20"
      >
        <div className="p-5 flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20">
            <span className="font-bold text-white text-lg">D</span>
          </div>
          <span className="font-bold text-base tracking-tight text-gray-200">DoBot</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <div className="text-xs font-semibold text-gray-600 px-3 py-2 uppercase tracking-wider">Workspace</div>
          {['Inbox', 'Today', 'Upcoming', 'Filters'].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === 'Inbox') {
                  setSidebarMode('inbox')
                  setActiveFilter('all')
                  setTagFilter(null)
                } else if (item === 'Today') {
                  setSidebarMode('today')
                  setTagFilter(null)
                } else if (item === 'Upcoming') {
                  setSidebarMode('upcoming')
                  setTagFilter(null)
                } else if (item === 'Filters') {
                  setSidebarMode('filters')
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group flex items-center gap-3 ${
                (item === 'Inbox' && sidebarMode === 'inbox') ||
                (item === 'Today' && sidebarMode === 'today') ||
                (item === 'Upcoming' && sidebarMode === 'upcoming')
                  ? 'bg-indigo-500/10 text-indigo-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item === 'Inbox' && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
              {item}
            </button>
          ))}

          <div className="mt-8 text-xs font-semibold text-gray-600 px-3 py-2 uppercase tracking-wider">Tags</div>
          {availableTags.slice(0, 6).map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSidebarMode('inbox')
                setActiveFilter('tag')
                setTagFilter(tag)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                activeFilter === 'tag' && tagFilter === tag
                  ? 'bg-indigo-500/10 text-indigo-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag size={14} className="opacity-50" />
              {tag}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-medium text-indigo-300">
                {auth?.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0c0c0e]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-300 truncate group-hover:text-white">
                {auth?.name || 'User'}
              </div>
              <div className="text-xs text-gray-600 truncate">Pro Plan</div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleLogout()
              }}
              className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        {/* Header */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white transition-colors">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Workspace</span>
              <span className="text-gray-700">/</span>
              <span className="text-gray-200 font-medium">
                {sidebarMode === 'today'
                  ? 'Today'
                  : sidebarMode === 'upcoming'
                    ? 'Upcoming'
                    : activeFilter === 'tag' && tagFilter
                      ? `#${tagFilter}`
                      : 'Inbox'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingOperations > 0 && (
              <div className="flex items-center gap-2 text-xs text-indigo-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="hidden sm:inline">Syncing...</span>
              </div>
            )}
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 rounded-md px-2 py-1">
              <Command size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500 font-mono">K</span>
            </div>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <button className="text-gray-400 hover:text-white transition-colors" aria-label="Notifications">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ---------------- Focus HUD ---------------- */}
            {viewMode === 'list' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/10 to-transparent border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity size={100} className="text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Good Afternoon, {auth?.name || 'User'}.</h2>
                  <p className="text-gray-400 text-sm mb-6">You have {uiTasks.filter((t) => !t.completed).length} tasks remaining today.</p>

                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      />
                    </div>
                    <span className="text-xs font-mono text-indigo-300">{completionRate}% Done</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-white/5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-gray-400 text-sm font-medium">High Priority</div>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold text-white mt-4">{uiTasks.filter((t) => t.priority === 'high' && !t.completed).length}</div>
                  <div className="text-xs text-gray-600 mt-1">Requires attention</div>
                </div>
              </motion.div>
            )}

            {/* ---------------- Control Bar ---------------- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 py-2 bg-[#09090b]/95 backdrop-blur-xl -mx-4 px-4 border-b border-white/5">
              <div className="flex items-center p-1 bg-white/5 rounded-lg border border-white/5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={handleGenerateSchedule}
                  disabled={isScheduling}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'schedule' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isScheduling ? <Sparkles size={12} className="animate-spin" /> : 'Flow Plan'}
                </button>
              </div>

              {viewMode === 'list' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  {(['all', 'active', 'completed', 'high'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter)
                        setTagFilter(null)
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${
                        activeFilter === filter
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <button
                    onClick={handleSmartPrioritize}
                    disabled={isPrioritizing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/30 text-indigo-400 text-xs font-medium hover:bg-indigo-500/10 transition-colors disabled:opacity-50"
                  >
                    <ListOrdered size={12} />
                    {isPrioritizing ? 'Sorting...' : 'Smart Sort'}
                  </button>
                </div>
              )}
            </div>

            <LayoutGroup>
              <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                  <motion.div key="list-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    {/* ---------------- Create Task ---------------- */}
                    <div className="group relative z-10">
                      <div className="relative bg-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-transparent flex flex-col p-2">
                        <div className="flex items-center w-full">
                          <div className="pl-3 pr-2 text-gray-500">
                            <Plus size={20} />
                          </div>
                          <form onSubmit={handleAddTask} className="flex-1">
                            <input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder="Create a new task..."
                              className="w-full bg-transparent py-3 text-base text-white placeholder-gray-600 focus:outline-none"
                            />
                          </form>
                          <div className="flex items-center gap-2 pr-2">
                            {inputValue.length > 3 && (
                              <button
                                type="button"
                                onClick={handleAiExpand}
                                disabled={isAiLoading}
                                className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                aria-label="AI expand"
                              >
                                <Sparkles size={18} className={isAiLoading ? 'animate-spin' : ''} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="relative z-20 flex items-center gap-2 pl-10 pt-1 pb-1">
                          <button
                            type="button"
                            onClick={() => {
                              cyclePriority()
                              setIsDateOpen(false)
                              setIsTagOpen(false)
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition-all ${
                              priorityConfig[newTaskPriority].bg
                            } ${priorityConfig[newTaskPriority].color} ${priorityConfig[newTaskPriority].border}`}
                          >
                            <Flag size={12} /> {priorityConfig[newTaskPriority].label}
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setIsDateOpen(!isDateOpen)
                                setIsTagOpen(false)
                              }}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border border-white/10 hover:bg-white/5 transition-all ${
                                newTaskDate ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' : 'text-gray-400'
                              }`}
                            >
                              <Calendar size={12} /> {formatDate(newTaskDate)}
                            </button>
                            {isDateOpen && (
                              <div className="absolute top-full left-0 mt-2 bg-[#18181b] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20 flex flex-col w-64 p-3">
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  <button
                                    onClick={() => handleSetDate(new Date())}
                                    className="px-2 py-1.5 rounded bg-white/5 text-xs text-center text-gray-300 hover:bg-white/10"
                                  >
                                    Today
                                  </button>
                                  <button
                                    onClick={() => {
                                      const d = new Date()
                                      d.setDate(d.getDate() + 1)
                                      handleSetDate(d)
                                    }}
                                    className="px-2 py-1.5 rounded bg-white/5 text-xs text-center text-gray-300 hover:bg-white/10"
                                  >
                                    Tomorrow
                                  </button>
                                </div>
                                <div className="h-px bg-white/5 mb-3 w-full" />
                                <div className="flex items-center justify-between mb-2">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      changeMonth(-1)
                                    }}
                                    className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                                  >
                                    <ChevronLeft size={14} />
                                  </button>
                                  <span className="text-xs font-medium text-gray-200">
                                    {months[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      changeMonth(1)
                                    }}
                                    className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                                  >
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                                    <div key={d} className="text-[10px] text-gray-500 font-medium">
                                      {d}
                                    </div>
                                  ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
                                <div className="h-px bg-white/5 my-2 w-full" />
                                <button onClick={() => handleSetDate(undefined)} className="w-full py-1 text-xs text-red-400 hover:bg-white/5 rounded">
                                  Clear Date
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setIsTagOpen(!isTagOpen)
                                setIsDateOpen(false)
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                              <Tag size={12} /> {newTaskTag}
                            </button>
                            {isTagOpen && (
                              <div className="absolute top-full left-0 mt-2 w-48 bg-[#18181b] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20 flex flex-col p-1">
                                <div className="p-1 mb-1">
                                  <input
                                    type="text"
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    placeholder="Filter or create..."
                                    autoFocus
                                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                                  />
                                </div>
                                <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                  {filteredTags.map((tag) => (
                                    <button
                                      key={tag}
                                      onClick={() => {
                                        setNewTaskTag(tag)
                                        setIsTagOpen(false)
                                      }}
                                      className={`w-full px-2 py-1.5 text-xs text-left hover:bg-white/5 rounded transition-colors flex items-center justify-between ${
                                        tag === newTaskTag ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-300'
                                      }`}
                                    >
                                      {tag} {tag === newTaskTag && <Check size={10} />}
                                    </button>
                                  ))}
                                  {filteredTags.length === 0 && tagSearch.trim() && (
                                    <button
                                      onClick={handleCreateTag}
                                      className="w-full px-2 py-1.5 text-xs text-left hover:bg-white/5 rounded transition-colors text-indigo-400 flex items-center gap-2"
                                    >
                                      <Plus size={10} /> Create "{tagSearch}"
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-1" />
                          <button
                            type="button"
                            onClick={handleAddTask}
                            className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] text-gray-500 font-mono border border-white/5 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <span>⏎</span>
                            <span>Enter</span>
                          </button>
                        </div>

                        {(isDateOpen || isTagOpen) && (
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => {
                              setIsDateOpen(false)
                              setIsTagOpen(false)
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* ---------------- Task List ---------------- */}
                    <div className="space-y-1">
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-12 md:col-span-6">Task</div>
                        <div className="hidden md:block col-span-2">Tags</div>
                        <div className="hidden md:block col-span-2">Due Date</div>
                        <div className="hidden md:block col-span-2 text-right">Priority</div>
                      </div>
                      <div className="space-y-1 min-h-[300px]">
                        <AnimatePresence mode="popLayout">
                          {filteredTasks.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-gray-600">
                              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} className="opacity-20" />
                              </div>
                              <p>No tasks found.</p>
                            </motion.div>
                          ) : (
                            filteredTasks.map((task, index) => (
                              <motion.div
                                layout
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => openTaskDetail(task)}
                                className="group relative cursor-pointer"
                              >
                                <div
                                  className={[
                                    'grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all duration-200',
                                    task.completed
                                      ? 'bg-[#0c0c0e]/50 border-transparent opacity-60'
                                      : 'bg-[#121214] border-white/5 hover:border-white/10 hover:bg-[#151518] hover:shadow-lg hover:shadow-black/20',
                                    editingTask?.id === task.id ? 'border-indigo-500/30 bg-[#151518]' : '',
                                    focusedIndex === index ? 'ring-1 ring-indigo-500/50 bg-[#18181b]' : '',
                                  ].join(' ')}
                                >
                                  <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleTask(task.id)
                                      }}
                                      className={`flex-shrink-0 transition-colors duration-200 ${
                                        task.completed ? 'text-green-500' : 'text-gray-600 group-hover:text-gray-400'
                                      }`}
                                      aria-label="Toggle complete"
                                    >
                                      {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </button>
                                    <span className={`text-sm truncate ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                      {task.title}
                                    </span>
                                  </div>
                                  <div className="hidden md:flex col-span-2 gap-2">
                                    {(task.tags || []).map((tag, i) => (
                                      <span key={`${tag}-${i}`} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-400 border border-white/5">
                                        {tagLabel(tag)}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="hidden md:flex col-span-2 items-center gap-2 text-xs text-gray-500">
                                    {task.dueDate && (
                                      <>
                                        <Calendar size={12} />
                                        <span className={task.dueDate < new Date() && !task.completed ? 'text-red-400' : ''}>{formatDate(task.dueDate)}</span>
                                      </>
                                    )}
                                  </div>
                                  <div className="hidden md:flex col-span-2 justify-end">
                                    <div
                                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide ${
                                        priorityConfig[task.priority].bg
                                      } ${priorityConfig[task.priority].color} ${priorityConfig[task.priority].border}`}
                                    >
                                      {priorityConfig[task.priority].label}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteTask(task.id)
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 transition-all opacity-100 hover:text-red-400 hover:bg-white/5 rounded-md md:opacity-0 md:group-hover:opacity-100"
                                    aria-label="Delete task"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="schedule-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 items-start">
                      <Sparkles className="text-indigo-400 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <h3 className="text-indigo-200 font-medium text-sm">Flow Plan Generated</h3>
                        <p className="text-indigo-300/60 text-xs mt-1">A plan was created to optimize your day.</p>
                      </div>
                    </div>
                    <div className="relative border-l border-white/10 ml-4 space-y-8 py-4">
                      {schedule.map((item, index) => {
                        const task = uiTasks.find((t) => t.id === item.taskId)
                        if (!task) return null
                        return (
                          <motion.div
                            key={`${item.taskId}-${index}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative pl-8 group"
                          >
                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#09090b] border-2 border-indigo-500 group-hover:scale-125 transition-transform" />
                            <div className="text-xs font-mono text-gray-500 mb-1">{item.time}</div>
                            <div className="bg-[#121214] border border-white/5 rounded-xl p-4 hover:border-indigo-500/30 transition-all hover:translate-x-1">
                              <div className="font-medium text-gray-200">{task.title}</div>
                              <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-indigo-500" />
                                {item.reasoning}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        </div>

        {/* ---------------- Detail Slide-Over ---------------- */}
        <AnimatePresence>
          {editingTask && (
            <div className="relative z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingTask(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0c0c0e] border-l border-white/10 shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-white/5 px-2 py-1 rounded border border-white/5 font-mono">{String(editingTask.id).slice(0, 4)}</span>
                    <span className="text-gray-700">/</span>
                    <span>Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteTask(editingTask.id)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                  <div className="flex items-start gap-3 mb-6">
                    <button
                      onClick={() => updateEditingTask({ completed: !editingTask.completed })}
                      className={`mt-1 flex-shrink-0 transition-colors ${
                        editingTask.completed ? 'text-green-500' : 'text-gray-500 hover:text-gray-300'
                      }`}
                      aria-label="Toggle complete"
                    >
                      {editingTask.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => updateEditingTask({ title: e.target.value })}
                      className={`w-full bg-transparent text-xl font-medium focus:outline-none ${
                        editingTask.completed ? 'text-gray-500 line-through' : 'text-white'
                      }`}
                    />
                  </div>

                  <div className="space-y-6">
                    {/* Notes Section (maps to backend description) */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        <AlignLeft size={12} /> Notes & Comments
                      </div>
                      <textarea
                        value={editingTask.description || ''}
                        onChange={(e) => updateEditingTask({ description: e.target.value })}
                        placeholder="Add details, links, or thoughts..."
                        className="w-full bg-[#121214] border border-white/5 rounded-lg p-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/30 min-h-[120px] resize-none"
                      />
                    </div>

                    {/* Subtasks Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <CornerDownRight size={12} /> Subtasks
                        </div>
                        <div className="flex items-center gap-2">
                          {isAiLoading && <Sparkles size={12} className="animate-spin text-indigo-400" />}
                          <span className="text-[10px] text-gray-600">
                            {(editingTask.subtasks || []).filter((s) => s.completed).length}/{(editingTask.subtasks || []).length}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {(editingTask.subtasks || []).map((sub, idx) => (
                          <div key={sub.id} className="flex items-center gap-2 p-2 rounded hover:bg-white/5 group">
                            <button
                              onClick={() => {
                                const newSubs = [...(editingTask.subtasks || [])]
                                newSubs[idx] = { ...sub, completed: !sub.completed }
                                updateEditingTask({ subtasks: newSubs })
                              }}
                              className={`text-gray-500 ${sub.completed ? 'text-green-500' : 'hover:text-white'}`}
                              aria-label="Toggle subtask"
                            >
                              {sub.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                            </button>
                            <span className={`flex-1 text-sm ${sub.completed ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{sub.text}</span>
                            <button
                              onClick={() => {
                                const newSubs = (editingTask.subtasks || []).filter((_, i) => i !== idx)
                                updateEditingTask({ subtasks: newSubs })
                              }}
                              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400"
                              aria-label="Remove subtask"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        <div className="relative mt-2">
                          <div className="absolute left-3 top-2.5 text-gray-600">
                            <Plus size={14} />
                          </div>
                          <input
                            type="text"
                            placeholder="Add subtask or ask AI to break it down..."
                            className="w-full bg-transparent border border-transparent hover:border-white/5 focus:border-indigo-500/30 rounded px-8 py-2 text-sm text-white focus:outline-none focus:bg-[#121214] transition-all"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value
                                if (!val.trim()) return
                                const newSub: Subtask = { id: Date.now().toString(), text: val.trim(), completed: false }
                                const merged = [...(editingTask.subtasks || []), newSub]
                                updateEditingTask({ subtasks: merged })
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }}
                          />
                          <button
                            onClick={handleAiExpand}
                            disabled={isAiLoading}
                            className="absolute right-2 top-2 p-1 text-gray-500 hover:text-indigo-400 transition-colors"
                            aria-label="AI expand subtasks"
                          >
                            <Sparkles size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Properties */}
                <div className="bg-[#09090b] p-6 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1.5">Priority</label>
                      <div className="flex gap-1">
                        {(['low', 'medium', 'high'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => updateEditingTask({ priority: p })}
                            className={`px-3 py-1.5 rounded text-xs capitalize border transition-all ${
                              editingTask.priority === p
                                ? `${priorityConfig[p].bg} ${priorityConfig[p].color} ${priorityConfig[p].border}`
                                : 'border-white/5 text-gray-500 hover:bg-white/5'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1.5">Due Date</label>
                      <div className="relative">
                        <button
                          onClick={() => setIsDetailDateOpen(!isDetailDateOpen)}
                          className="flex items-center gap-2 w-full px-3 py-1.5 rounded bg-white/5 border border-white/5 text-xs text-gray-300 hover:bg-white/10 transition-colors"
                        >
                          <Calendar size={14} />
                          {formatDate(editingTask.dueDate)}
                        </button>
                        {isDetailDateOpen && (
                          <div className="absolute bottom-full left-0 mb-2 bg-[#18181b] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20 flex flex-col w-64 p-3">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <button
                                onClick={() => handleSetDetailDate(new Date())}
                                className="px-2 py-1.5 rounded bg-white/5 text-xs text-center text-gray-300 hover:bg-white/10"
                              >
                                Today
                              </button>
                              <button
                                onClick={() => {
                                  const d = new Date()
                                  d.setDate(d.getDate() + 1)
                                  handleSetDetailDate(d)
                                }}
                                className="px-2 py-1.5 rounded bg-white/5 text-xs text-center text-gray-300 hover:bg-white/10"
                              >
                                Tomorrow
                              </button>
                            </div>
                            <div className="h-px bg-white/5 mb-3 w-full" />
                            <div className="flex items-center justify-between mb-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  changeMonth(-1)
                                }}
                                className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <span className="text-xs font-medium text-gray-200">
                                {months[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  changeMonth(1)
                                }}
                                className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                                <div key={d} className="text-[10px] text-gray-500 font-medium">
                                  {d}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">{renderDetailCalendarDays(calendarViewDate, handleSetDetailDate)}</div>
                            <div className="h-px bg-white/5 my-2 w-full" />
                            <button onClick={() => handleSetDetailDate(undefined)} className="w-full py-1 text-xs text-red-400 hover:bg-white/5 rounded">
                              Clear Date
                            </button>
                          </div>
                        )}
                        {isDetailDateOpen && <div className="fixed inset-0 z-10" onClick={() => setIsDetailDateOpen(false)} />}
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                    onClick={handleSaveTask}
                    disabled={savingTask}
                  >
                    <Save size={16} className="mr-2" />
                    {savingTask ? 'Updating…' : 'Update Task'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function TasksPage() {
  return <TasksContent />
}
