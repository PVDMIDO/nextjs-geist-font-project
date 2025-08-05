import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get dashboard statistics
    const totalEvents = await prisma.event.count({
      where: { userId: session.user.id }
    })

    const upcomingEvents = await prisma.event.count({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date()
        },
        status: {
          in: ['PUBLISHED', 'DRAFT']
        }
      }
    })

    const completedEvents = await prisma.event.count({
      where: {
        userId: session.user.id,
        status: 'COMPLETED'
      }
    })

    const totalGuests = await prisma.guest.count({
      where: {
        event: {
          userId: session.user.id
        }
      }
    })

    const pendingTasks = await prisma.task.count({
      where: {
        userId: session.user.id,
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        }
      }
    })

    // Get recent events
    const recentEvents = await prisma.event.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        venue: true,
        date: true,
        status: true,
        createdAt: true
      }
    })

    const stats = {
      totalEvents,
      upcomingEvents,
      completedEvents,
      totalGuests,
      pendingTasks
    }

    return NextResponse.json({
      stats,
      recentEvents
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
