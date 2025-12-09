/**
 * Task creation page
 * Authenticated users can create new tasks
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm, { TaskFormData } from '@/components/tasks/TaskForm';
import { createTask, ApiError } from '@/lib/api';

export default function NewTaskPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage (set during login)
    const storedUserId = localStorage.getItem('user_id');
    if (!storedUserId) {
      // Not authenticated, redirect to login
      router.push('/login');
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  const handleSubmit = async (data: TaskFormData) => {
    if (!userId) {
      setError('Not authenticated');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await createTask(userId, {
        title: data.title,
        description: data.description || null,
      });

      // Success - redirect to tasks list
      router.push('/tasks');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          // Token expired or invalid
          setError('Session expired. Please log in again.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else if (err.status === 403) {
          setError('You do not have permission to create tasks');
        } else if (err.status === 400) {
          setError(err.message);
        } else {
          setError('Failed to create task. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
        console.error('Task creation error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add a new task to your todo list
            </p>
          </div>

          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            error={error}
            loading={loading}
            submitText="Create Task"
          />
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleCancel}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
