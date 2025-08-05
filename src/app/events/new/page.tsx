'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DashboardLayout } from '@/components/dashboard/layout'
import { toast } from 'sonner'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(1, 'Venue is required'),
  organizer: z.string().min(1, 'Organizer is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
})

type EventFormData = z.infer<typeof eventSchema>

export default function NewEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: 'DRAFT'
    }
  })

  const watchedStatus = watch('status')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user.role === 'VIEWER') {
      toast.error('Access denied', {
        description: 'You do not have permission to create events.'
      })
      router.push('/events')
    }
  }, [session, router])

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const event = await response.json()
        toast.success('Event created successfully!', {
          description: `${event.title} has been created.`
        })
        router.push(`/events/${event.id}`)
      } else {
        const errorData = await response.json()
        toast.error('Failed to create event', {
          description: errorData.error || 'An error occurred while creating the event.'
        })
      }
    } catch (error) {
      console.error('Failed to create event:', error)
      toast.error('Failed to create event', {
        description: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!session || session.user.role === 'VIEWER') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-playfair">Create New Event</h1>
          <p className="text-slate-600 mt-1">Plan and organize a luxury event experience</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair">Event Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter event title"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe your event..."
                    rows={4}
                    className="mt-1"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                    className="mt-1"
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="time">Event Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register('time')}
                    className="mt-1"
                  />
                  {errors.time && (
                    <p className="text-sm text-red-600 mt-1">{errors.time.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    {...register('venue')}
                    placeholder="Event venue"
                    className="mt-1"
                  />
                  {errors.venue && (
                    <p className="text-sm text-red-600 mt-1">{errors.venue.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="organizer">Organizer *</Label>
                  <Input
                    id="organizer"
                    {...register('organizer')}
                    placeholder="Event organizer"
                    className="mt-1"
                  />
                  {errors.organizer && (
                    <p className="text-sm text-red-600 mt-1">{errors.organizer.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watchedStatus}
                    onValueChange={(value) => setValue('status', value as 'DRAFT' | 'PUBLISHED')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select event status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                  )}
                </div>
              </div>

              {/* Status Information */}
              {watchedStatus === 'PUBLISHED' && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    📢 Publishing this event will make it visible to guests and team members.
                    Make sure all details are correct before publishing.
                  </AlertDescription>
                </Alert>
              )}

              {watchedStatus === 'DRAFT' && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    📝 This event will be saved as a draft. You can edit and publish it later.
                  </AlertDescription>
                </Alert>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-500 hover:to-amber-700"
                >
                  {isLoading ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 font-playfair">💡 Event Planning Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 text-sm">
              <li>• Choose a descriptive title that reflects the luxury nature of your event</li>
              <li>• Provide detailed descriptions to help guests understand what to expect</li>
              <li>• Consider the venue capacity and accessibility for your target audience</li>
              <li>• Save as draft first to review all details before publishing</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
