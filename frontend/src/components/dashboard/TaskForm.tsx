'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TaskFormData {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  tags: string[]
}

interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  tags: string[]
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void> | void
  onCancel: () => void
  initialTask?: Task
}

export function TaskForm({ onSubmit, onCancel, initialTask }: TaskFormProps) {
  const [title, setTitle] = React.useState(initialTask?.title || '')
  const [description, setDescription] = React.useState(initialTask?.description || '')
  const [priority, setPriority] = React.useState<TaskFormData['priority']>(initialTask?.priority || 'medium')
  const [tags, setTags] = React.useState((initialTask?.tags || []).join(', '))
  const [errors, setErrors] = React.useState<{ title?: string }>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isEditMode = !!initialTask

  const validateForm = (): boolean => {
    const newErrors: { title?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
      const uniqueTags = Array.from(new Set(parsedTags))

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        tags: uniqueTags,
      })

      // Reset form only in create mode
      if (!isEditMode) {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setTags('')
        setErrors({})
      }
    } catch (error) {
      // Error is handled by the parent component with toast notification
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          if (errors.title) {
            setErrors((prev) => ({ ...prev, title: undefined }))
          }
        }}
        error={errors.title}
        required
        fullWidth
        disabled={isSubmitting}
        placeholder="Enter task title"
        className="bg-gray-900/50 border-gray-800 focus:border-indigo-500/50 focus:ring-indigo-500/20"
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          placeholder="Add a description (optional)"
          className={cn(
            "w-full rounded-xl border bg-gray-900/50 px-4 py-3 text-sm text-white placeholder:text-gray-500",
            "border-gray-800 focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10",
            "disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none transition-all duration-200"
          )}
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskFormData['priority'])}
          disabled={isSubmitting}
          className={cn(
            'w-full rounded-xl border bg-gray-900/50 px-4 py-3 text-sm text-white',
            'border-gray-800 focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200'
          )}
        >
          <option value="high" className="bg-gray-950 text-white">High</option>
          <option value="medium" className="bg-gray-950 text-white">Medium</option>
          <option value="low" className="bg-gray-950 text-white">Low</option>
        </select>
      </div>

      <Input
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        placeholder="e.g. work, finance"
        helperText="Comma-separated"
        className="bg-gray-900/50 border-gray-800 focus:border-indigo-500/50 focus:ring-indigo-500/20"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          {isEditMode ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
