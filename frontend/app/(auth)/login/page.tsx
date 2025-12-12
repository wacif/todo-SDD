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

            // Get JWT token
      const { data: tokenData } = await authClient.token()
      
      console.log('Sign in data:', signInData);
      console.log('Token data:', tokenData);

      if (tokenData?.token) {
        localStorage.setItem('auth_token', tokenData.token)
        
        if (signInData?.user) {
             localStorage.setItem('user_id', signInData.user.id)
             localStorage.setItem('user_email', signInData.user.email)
             localStorage.setItem('user_name', signInData.user.name)
        } else {
            console.error('User data missing in sign in response');
        }
      } else {
          console.error('Token missing in token response');
          // Fallback: check if we can get session
          const { data: sessionData } = await authClient.getSession();
          console.log('Session data:', sessionData);
          if (sessionData?.session) {
              // If we have a session but no token, we might be in a weird state for JWT.
              // But let's see if we can proceed or if we need to show an error.
          }
      }

      if (!localStorage.getItem('auth_token')) {
          setError('Login successful but failed to retrieve access token. Please try again.');
          setLoading(false);
          return;
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
