/**
 * Reusable TaskForm component for creating and editing tasks
 * Handles form validation, submission, and error states
 */

'use client';

import { useState, FormEvent } from 'react';

export interface TaskFormData {
  title: string;
  description: string;
}

interface TaskFormProps {
  /** Initial form values (for editing) */
  initialValues?: Partial<TaskFormData>;
  
  /** Form submission handler */
  onSubmit: (data: TaskFormData) => Promise<void>;
  
  /** Optional submit button text */
  submitText?: string;
  
  /** Optional cancel handler */
  onCancel?: () => void;
  
  /** External error message */
  error?: string;
  
  /** Loading state */
  loading?: boolean;
}

export default function TaskForm({
  initialValues = {},
  onSubmit,
  submitText = 'Create Task',
  onCancel,
  error: externalError,
  loading = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Client-side validation
    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    if (title.length > 200) {
      setValidationError('Title must be 200 characters or less');
      return;
    }

    if (description.length > 1000) {
      setValidationError('Description must be 1000 characters or less');
      return;
    }

    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
    } catch (err) {
      // Error handling is done by parent component
    }
  };

  const errorMessage = externalError || validationError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter task title"
          required
        />
        <div className="text-sm text-gray-500 mt-1">
          {title.length}/200 characters
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          maxLength={1000}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter task description (optional)"
        />
        <div className="text-sm text-gray-500 mt-1">
          {description.length}/1000 characters
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : submitText}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
