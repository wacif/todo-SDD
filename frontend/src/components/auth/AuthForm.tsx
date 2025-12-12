'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
