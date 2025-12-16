/**
 * Lightweight "AI" helpers used by the Inbox (Tasks) page.
 *
 * This intentionally ships with deterministic fallback logic (no external API key required),
 * mirroring the sample clone behavior when AI is unavailable.
 *
 * Later we can swap these implementations to call a real LLM endpoint.
 */

export async function breakdownTask(taskText: string): Promise<string[]> {
  const text = (taskText || '').trim()
  if (!text) return []

  // Simulate latency for UX parity with the sample app.
  await new Promise((r) => setTimeout(r, 900))

  // Simple heuristic breakdown.
  const base = text.replace(/[.?!]$/, '')
  return [
    `Clarify requirements for "${base}"`,
    `Draft a quick plan for "${base}"`,
    `Execute and review "${base}"`,
  ]
}

export async function prioritizeTasks(tasks: { id: number; text: string }[]): Promise<number[]> {
  await new Promise((r) => setTimeout(r, 1200))

  // Heuristic: longer tasks first, then stable by id.
  return [...tasks]
    .sort((a, b) => {
      const dl = (b.text || '').length - (a.text || '').length
      if (dl !== 0) return dl
      return a.id - b.id
    })
    .map((t) => t.id)
}

export interface ScheduleItem {
  time: string
  taskId: number
  reasoning: string
}

export async function generateSchedule(
  tasks: { id: number; text: string }[]
): Promise<ScheduleItem[]> {
  await new Promise((r) => setTimeout(r, 1400))

  // Mock schedule: start 9am, one-hour blocks, simple context hints.
  let hour = 9
  let isAm = true
  return tasks.map((t, idx) => {
    const labelHour = hour
    const time = `${labelHour}:00 ${isAm ? 'AM' : 'PM'}`

    hour += 1
    if (isAm && hour === 12) {
      // 12:00 PM boundary
      isAm = false
    } else if (!isAm && hour === 13) {
      hour = 1
    }

    const reasoning =
      idx < 2
        ? 'Scheduled early for focused deep work.'
        : 'Scheduled later to balance energy and context switching.'

    return { time, taskId: t.id, reasoning }
  })
}


