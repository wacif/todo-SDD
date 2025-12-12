'use client'

import * as React from 'react'
import { TaskCard } from './TaskCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Inbox } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: number) => void
  onEdit?: (task: Task) => void
  onDelete?: (id: number) => void
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <EmptyState
          icon={Inbox}
          title={emptyMessage}
          description="Create your first task to get started"
          variant="minimal"
          className="bg-gray-900/30 border border-gray-800 rounded-xl backdrop-blur-sm"
        />
      </motion.div>
    )
  }

  return (
    <motion.ul 
      className="space-y-3"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
    >
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => (
          <motion.li 
            key={task.id}
            layout
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
