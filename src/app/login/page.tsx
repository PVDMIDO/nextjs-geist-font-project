'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        toast.error('Login failed', {
          description: 'Please check your credentials and try again.'
        })
      } else {
        toast.success('Welcome back!', {
          description: 'You have been successfully logged in.'
        })
        router.push('/dashboard')
      }
    } catch (error) {
      setError('An unexpected error occurred')
      toast.error('Login failed', {
        description: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-black font-bold text-2xl font-playfair">PV</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-playfair">Palazzo Versace Dubai</h1>
          <p className="text-amber-200 text-sm">Events Management System</p>
        </div>

        {/* Login Form */}
        <Card className="bg-black/40 border-amber-200/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white font-playfair">Welcome Back</CardTitle>
            <CardDescription className="text-slate-300">
              Sign in to access your events dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/20 border-amber-200/30 text-white placeholder:text-slate-400 focus:border-amber-400"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/20 border-amber-200/30 text-white placeholder:text-slate-400 focus:border-amber-400"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-500 hover:to-amber-700 font-semibold"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-amber-400 text-sm font-medium mb-2">Demo Credentials:</p>
              <div className="text-xs text-slate-300 space-y-1">
                <p><strong>Admin:</strong> admin@palazzoversace.com / admin123</p>
                <p><strong>Manager:</strong> manager@palazzoversace.com / manager123</p>
                <p><strong>Viewer:</strong> viewer@palazzoversace.com / viewer123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-400 hover:text-amber-400 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
