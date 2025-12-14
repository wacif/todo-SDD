'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'

export interface AuthFormData {
  email: string
  password: string
  name?: string
}

export interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: AuthFormData) => Promise<void>
  error?: string
  loading?: boolean
}

export default function AuthForm({
  mode,
  onSubmit,
  error,
  loading = false,
}: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: mode === 'signup' ? '' : undefined,
  })

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false
    if (!/[A-Z]/.test(password)) return false
    if (!/[a-z]/.test(password)) return false
    if (!/[0-9]/.test(password)) return false
    return true
  }

  const getPasswordStrength = (
    password: string
  ): 'weak' | 'medium' | 'strong' | null => {
    if (!password) return null
    if (password.length < 8) return 'weak'
    if (!validatePassword(password)) return 'medium'
    return 'strong'
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const passwordStrength =
    mode === 'signup' ? getPasswordStrength(formData.password) : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {mode === 'signup' ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'signup' && (
              <Input
                id="name"
                label="Name"
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
                disabled={loading}
                fullWidth
              />
            )}

            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              disabled={loading}
              fullWidth
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              disabled={loading}
              fullWidth
              helperText={
                mode === 'signup' && !passwordStrength
                  ? 'Password must be at least 8 characters with uppercase, lowercase, and number'
                  : undefined
              }
            />
            
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded ${
                      passwordStrength === 'weak'
                        ? 'bg-red-500'
                        : passwordStrength === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded ${
                      passwordStrength === 'medium'
                        ? 'bg-yellow-500'
                        : passwordStrength === 'strong'
                          ? 'bg-green-500'
                          : 'bg-gray-700'
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded ${
                      passwordStrength === 'strong'
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                    }`}
                  />
                </div>
                <p
                  className={`mt-1 text-xs ${
                    passwordStrength === 'weak'
                      ? 'text-red-400'
                      : passwordStrength === 'medium'
                        ? 'text-yellow-400'
                        : 'text-green-400'
                  }`}
                >
                  {passwordStrength === 'weak'
                    ? 'Weak: At least 8 characters required'
                    : passwordStrength === 'medium'
                      ? 'Medium: Add uppercase, lowercase, and number'
                      : 'Strong password'}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-400">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {mode === 'signup' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#030712] text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-white text-black hover:bg-gray-200 border-transparent"
            onClick={async () => {
              await signIn.social({
                provider: 'google',
                callbackURL: '/tasks'
              })
            }}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Google
          </Button>
        </form>

        {mode === 'signup' && (
          <div className="text-xs text-center text-gray-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        )}
      </div>
    </div>
  )
}
