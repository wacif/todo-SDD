/**
 * Local per-task metadata for the Inbox clone UI.
 *
 * Backend Phase II currently persists: title/description/completed/priority/tags.
 * The Inbox UI additionally needs: dueDate, subtasks.
 *
 * We persist those extras in localStorage, scoped per user, keyed by task id.
 */

export type SubtaskMeta = {
  id: string
  text: string
  completed: boolean
}

export type TaskMeta = {
  dueDate?: string // ISO string
  subtasks?: SubtaskMeta[]
}

type MetaStore = Record<string, TaskMeta>

function storageKey(userId: string) {
  return `task_meta_v1:${userId}`
}

function safeParse(json: string | null): MetaStore {
  if (!json) return {}
  try {
    const parsed = JSON.parse(json) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as MetaStore
  } catch {
    return {}
  }
}

export function loadTaskMetaStore(userId: string): MetaStore {
  if (typeof window === 'undefined') return {}
  try {
    return safeParse(localStorage.getItem(storageKey(userId)))
  } catch {
    return {}
  }
}

export function saveTaskMetaStore(userId: string, store: MetaStore) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(store))
  } catch {
    // Ignore storage failures (private mode, blocked storage, quota).
  }
}

export function getTaskMeta(userId: string, taskId: number): TaskMeta {
  const store = loadTaskMetaStore(userId)
  return store[String(taskId)] || {}
}

export function setTaskMeta(userId: string, taskId: number, next: TaskMeta) {
  const store = loadTaskMetaStore(userId)
  store[String(taskId)] = next
  saveTaskMetaStore(userId, store)
}

export function patchTaskMeta(userId: string, taskId: number, patch: Partial<TaskMeta>) {
  const current = getTaskMeta(userId, taskId)
  setTaskMeta(userId, taskId, { ...current, ...patch })
}

export function deleteTaskMeta(userId: string, taskId: number) {
  const store = loadTaskMetaStore(userId)
  delete store[String(taskId)]
  saveTaskMetaStore(userId, store)
}


