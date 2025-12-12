"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [task, setTask] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    // Fetch task data and populate the form
    const fetchTask = async () => {
      // In a real app, you would fetch this from your API
      const mockTask = { id, title: `Task ${id}` }
      setTask(mockTask)
    }
    fetchTask()
  }, [id])

  if (!task) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <Link href={`/tasks/${id}/edit`} className="text-indigo-600 hover:underline">
        Edit
      </Link>
    </div>
  )
}