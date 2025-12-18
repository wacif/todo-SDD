'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthForm, { AuthFormData } from '@/components/auth/AuthForm'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { signIn, authClient } from '@/lib/auth-client'

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
      const { data: signInData, error: signInError } = await signIn.email({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        setError(signInError.message || 'Email or password is incorrect')
        setLoading(false)
        return
      }

      const [{ data: sessionData }, { data: tokenData }] = await Promise.all([
        authClient.getSession(),
        authClient.token(),
      ])

      if (!tokenData?.token) {
        setError('Login successful but failed to retrieve access token. Please try again.')
        setLoading(false)
        return
      }

      try {
        localStorage.setItem('auth_token', tokenData.token)
        const user = sessionData?.user ?? signInData?.user
        if (user?.id) localStorage.setItem('user_id', user.id)
        if (user?.email) localStorage.setItem('user_email', user.email)
        if (user?.name) localStorage.setItem('user_name', user.name)
      } catch {
        // ignore
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
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </ToastProvider>
  )
}
