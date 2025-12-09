'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Check if user just registered
  if (searchParams.get('registered') === 'true' && !successMessage) {
    setSuccessMessage('Registration successful! Please sign in with your credentials.')
  }

  const handleSubmit = async (data: AuthFormData) => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        // Handle error responses
        if (response.status === 401) {
          setError('Email or password is incorrect')
        } else if (response.status === 422) {
          // Pydantic validation error
          const detail = responseData.detail
          if (Array.isArray(detail)) {
            setError(detail[0]?.msg || 'Validation error')
          } else {
            setError(detail || 'Validation error')
          }
        } else {
          setError('An unexpected error occurred. Please try again.')
        }
        setLoading(false)
        return
      }

      // Success - store token and redirect to dashboard
      // Store token in localStorage (will be upgraded to httpOnly cookie with Better Auth later)
      if (responseData.token) {
        localStorage.setItem('auth_token', responseData.token)
        localStorage.setItem('user_id', responseData.user.id)
        localStorage.setItem('user_email', responseData.user.email)
        localStorage.setItem('user_name', responseData.user.name)
      }

      // Redirect to tasks page
      router.push('/tasks')
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {successMessage && (
        <div className="max-w-md mx-auto mt-8 mb-4">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  {successMessage}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
    </div>
  )
}
