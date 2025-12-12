'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm'
import { ToastProvider, useToast } from '@/components/ui/toast'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user just registered
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast({
        title: 'Registration successful!',
        description: 'Please sign in with your credentials.',
        variant: 'success',
      })
    }
  }, [searchParams, toast])

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
      if (responseData.token) {
        localStorage.setItem('auth_token', responseData.token)
        localStorage.setItem('user_id', responseData.user.id)
        localStorage.setItem('user_email', responseData.user.email)
        localStorage.setItem('user_name', responseData.user.name)
      }

      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
        variant: 'success',
      })

      // Redirect to tasks page
      setTimeout(() => router.push('/tasks'), 500)
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <AuthForm
      mode="login"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  )
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </ToastProvider>
  )
}
