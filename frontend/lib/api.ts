/**
 * API client for backend communication
 * Handles authentication and task operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Task interface matching backend TaskResponse
 */
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Task input interface for creating/updating tasks
 */
export interface TaskInput {
  title: string;
  description?: string | null;
}

/**
 * Task list response interface
 */
export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

/**
 * Create a new task
 */
export async function createTask(
  userId: string,
  input: TaskInput
): Promise<Task> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      error.detail || 'Failed to create task',
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * List all tasks for a user
 */
export async function listTasks(userId: string): Promise<TaskListResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      error.detail || 'Failed to list tasks',
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * Get a single task by ID
 */
export async function getTask(userId: string, taskId: number): Promise<Task> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      error.detail || 'Failed to get task',
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * Update a task
 */
export async function updateTask(
  userId: string,
  taskId: number,
  input: TaskInput
): Promise<Task> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      error.detail || 'Failed to update task',
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * Delete a task
 */
export async function deleteTask(userId: string, taskId: number): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      error.detail || 'Failed to delete task',
      response.status,
      error
    );
  }
}

/**
 * Toggle task completion status
 */
export async function toggleTaskComplete(
  userId: string,
  taskId: number
): Promise<Task> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/${userId}/tasks/${taskId}/complete`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      error.detail || 'Failed to toggle task completion',
      response.status,
      error
    );
  }

  return response.json();
}
