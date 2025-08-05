'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Events', href: '/events', icon: '🎭' },
  { name: 'Calendar', href: '/calendar', icon: '📅' },
  { name: 'Reports', href: '/reports', icon: '📈' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800'
      case 'VIEWER':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <span className="sr-only">Open sidebar</span>
                ☰
              </button>
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm font-playfair">PV</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-slate-900 font-playfair">Palazzo Versace</h1>
                  <p className="text-xs text-slate-600">Events Management</p>
                </div>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={session?.user?.name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-black font-semibold">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email}
                      </p>
                      <Badge className={cn('text-xs w-fit', getRoleColor(session?.user?.role || ''))}>
                        {session?.user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Account Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 border-r-2 border-amber-500"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 text-center">
                <p>&copy; 2024 Palazzo Versace Dubai</p>
                <p>Events Management System</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
