'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { signUp } from '@/lib/auth-client'

function SignupContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false
    if (!/[A-Z]/.test(password)) return false
    if (!/[a-z]/.test(password)) return false
    if (!/[0-9]/.test(password)) return false
    return true
  }

  const handleSubmit = async (data: AuthFormData) => {
    setError('')

    // Client-side validation
    if (data.name && data.name.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    if (!validatePassword(data.password)) {
      setError(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      )
      return
    }

    setLoading(true)

    try {
      const { data: signUpData, error: signUpError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name || '',
      })

      if (signUpError) {
        setError(signUpError.message || 'An unexpected error occurred. Please try again.')
        setLoading(false)
        return
      }

      // Success - show toast and redirect
      toast({
        title: 'Account created!',
        description: 'Redirecting to login...',
        variant: 'success',
      })

      setTimeout(() => router.push('/login?registered=true'), 1000)
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  )
}

export default function SignupPage() {
  return (
    <ToastProvider>
      <SignupContent />
    </ToastProvider>
  )
}
