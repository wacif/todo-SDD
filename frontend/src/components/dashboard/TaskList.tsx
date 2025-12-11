'use client'

import * as React from 'react'
import { TaskCard } from './TaskCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Inbox } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (id: string) => void
  filter?: 'all' | 'pending' | 'completed'
  emptyMessage?: string
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  filter = 'all',
  emptyMessage = 'No tasks yet',
}: TaskListProps) {
  const filteredTasks = React.useMemo(() => {
    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed)
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed)
    }
    return tasks
  }, [tasks, filter])

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyMessage}
        description="Create your first task to get started"
        variant="minimal"
      />
    )
  }

  return (
    <ul className="space-y-3">
      {filteredTasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}
