'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TaskFormData {
  title: string
  description: string
}

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void> | void
  onCancel: () => void
  initialTask?: Task
}

export function TaskForm({ onSubmit, onCancel, initialTask }: TaskFormProps) {
  const [title, setTitle] = React.useState(initialTask?.title || '')
  const [description, setDescription] = React.useState(initialTask?.description || '')
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
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
      })

      // Reset form only in create mode
      if (!isEditMode) {
        setTitle('')
        setDescription('')
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          placeholder="Add a description (optional)"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditMode ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
