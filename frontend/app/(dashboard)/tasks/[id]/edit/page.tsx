"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("")
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    // Fetch task data and populate the form
    const fetchTask = async () => {
      // In a real app, you would fetch this from your API
      const mockTask = { id, title: `Task ${id}` }
      setTitle(mockTask.title)
    }
    fetchTask()
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission, e.g., send a PUT request to your API
    router.push("/tasks")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
      </form>
    </div>
  )
}