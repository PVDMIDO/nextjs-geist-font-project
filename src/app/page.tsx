'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      {/* Header */}
      <header className="border-b border-amber-200/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl font-playfair">PV</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-playfair">Palazzo Versace Dubai</h1>
                <p className="text-amber-200 text-sm">Events Management System</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6 font-playfair">
            Luxury Events Management
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Experience the pinnacle of event management with our sophisticated platform designed 
            exclusively for Palazzo Versace Dubai's prestigious events team.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-black/40 border-amber-200/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-400 font-playfair">Event Dashboard</CardTitle>
                <CardDescription className="text-slate-300">
                  Comprehensive overview of all events with real-time analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">📊</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-amber-200/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-400 font-playfair">Event Management</CardTitle>
                <CardDescription className="text-slate-300">
                  Create, edit, and manage events with luxury-focused tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">🎭</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-amber-200/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-400 font-playfair">Reports & Analytics</CardTitle>
                <CardDescription className="text-slate-300">
                  Generate detailed reports and export to PDF or Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">📈</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-black/40 border border-amber-200/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4 font-playfair">Ready to Get Started?</h3>
            <p className="text-slate-300 mb-8">
              Access your events management dashboard and experience luxury event planning like never before.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-500 hover:to-amber-700 font-semibold px-8">
                  Sign In to Dashboard
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-8">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/20 bg-black/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 Palazzo Versace Dubai. All rights reserved.</p>
            <p className="text-sm mt-2">Luxury Events Management System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
