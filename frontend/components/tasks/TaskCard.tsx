'use client'

import Link from 'next/link'

interface TaskCardProps {
  id: number
  title: string
  description: string | null
  completed: boolean
  created_at: string
  onToggleComplete?: (id: number) => void
  onDelete?: (id: number) => void
}

export default function TaskCard({
  id,
  title,
  description,
  completed,
  created_at,
  onToggleComplete,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggleComplete?.(id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <div className="ml-4 flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                completed
                  ? 'text-gray-400 line-through'
                  : 'text-gray-900'
              }`}
            >
              {title}
            </p>
            {description && (
              <p className="text-sm text-gray-500 mt-1">
                {description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Created {new Date(created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex space-x-2">
          <Link
            href={`/tasks/${id}`}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            View
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
