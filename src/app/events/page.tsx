'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/dashboard/layout'
import Link from 'next/link'
import { toast } from 'sonner'

interface Event {
  id: string
  title: string
  description?: string
  date: string
  time: string
  venue: string
  organizer: string
  status: string
  guests: Array<{ id: string; rsvpStatus: string }>
  tasks: Array<{ id: string; status: string }>
  createdAt: string
}

export default function EventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session, search, statusFilter, pagination.page])

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) params.append('search', search)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/events?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch events')
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
      toast.error('Failed to fetch events')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getGuestStats = (guests: Array<{ rsvpStatus: string }>) => {
    const confirmed = guests.filter(g => g.rsvpStatus === 'CONFIRMED').length
    const pending = guests.filter(g => g.rsvpStatus === 'PENDING').length
    return { confirmed, pending, total: guests.length }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-playfair">Events</h1>
            <p className="text-slate-600 mt-1">Manage and organize your luxury events</p>
          </div>
          {session.user.role !== 'VIEWER' && (
            <Link href="/events/new">
              <Button className="bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-500 hover:to-amber-700">
                Create Event
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
                <p className="text-slate-600 mb-6">
                  {search || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first event to get started'
                  }
                </p>
                {session.user.role !== 'VIEWER' && (
                  <Link href="/events/new">
                    <Button>Create Your First Event</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {events.map((event) => {
                const guestStats = getGuestStats(event.guests)
                const pendingTasks = event.tasks.filter(t => t.status === 'PENDING').length
                
                return (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-playfair">{event.title}</CardTitle>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">
                            {event.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          {session.user.role !== 'VIEWER' && (
                            <Link href={`/events/${event.id}/edit`}>
                              <Button variant="outline" size="sm">Edit</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Date & Time</p>
                          <p className="text-sm text-slate-900">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Venue</p>
                          <p className="text-sm text-slate-900">{event.venue}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Organizer</p>
                          <p className="text-sm text-slate-900">{event.organizer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Guests</p>
                          <p className="text-sm text-slate-900">
                            {guestStats.confirmed} confirmed, {guestStats.pending} pending
                          </p>
                        </div>
                      </div>
                      
                      {pendingTasks > 0 && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">
                            ⚠️ {pendingTasks} pending task{pendingTasks > 1 ? 's' : ''} require attention
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} events
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
