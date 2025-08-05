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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
        { organizer: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        include: {
          guests: {
            select: {
              id: true,
              rsvpStatus: true
            }
          },
          tasks: {
            select: {
              id: true,
              status: true
            }
          }
        }
      }),
      prisma.event.count({ where })
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Events GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check permissions
    if (session.user.role === 'VIEWER') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      date,
      time,
      venue,
      organizer,
      status = 'DRAFT',
      images = '',
      documents = ''
    } = body

    // Validate required fields
    if (!title || !date || !time || !venue || !organizer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        venue,
        organizer,
        status,
        images,
        documents,
        userId: session.user.id
      },
      include: {
        guests: true,
        tasks: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Events POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
