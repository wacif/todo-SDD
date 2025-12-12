'use client'

import * as React from 'react'
import { Pencil, Trash2, Check, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (id: string) => void
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const formattedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
        task.completed 
          ? "bg-gray-900/30 border-gray-800/50" 
          : "bg-gray-900/60 border-gray-800 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
      )}
    >
      {/* Gradient glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleComplete(task.id)
          }}
          className={cn(
            "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950",
            task.completed
              ? "bg-indigo-500 border-indigo-500 text-white"
              : "border-gray-600 bg-transparent hover:border-indigo-400"
          )}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        >
          {task.completed && <Check className="h-3.5 w-3.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              className={cn(
                'font-semibold text-lg transition-colors duration-200',
                task.completed ? 'text-gray-500 line-through' : 'text-white group-hover:text-indigo-200'
              )}
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(task)
                  }}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(task.id)
                  }}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {task.description && (
            <p
              className={cn(
                'text-sm mb-3 line-clamp-2',
                task.completed ? 'text-gray-600' : 'text-gray-400'
              )}
            >
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            {task.completed && (
              <Badge variant="success" size="sm" className="bg-green-500/10 text-green-400 border-green-500/20">
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
