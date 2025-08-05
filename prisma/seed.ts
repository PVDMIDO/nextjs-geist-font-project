import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create demo users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const managerPassword = await bcrypt.hash('manager123', 12)
  const viewerPassword = await bcrypt.hash('viewer123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@palazzoversace.com' },
    update: {},
    create: {
      email: 'admin@palazzoversace.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@palazzoversace.com' },
    update: {},
    create: {
      email: 'manager@palazzoversace.com',
      name: 'Event Manager',
      password: managerPassword,
      role: 'MANAGER',
    },
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@palazzoversace.com' },
    update: {},
    create: {
      email: 'viewer@palazzoversace.com',
      name: 'Event Viewer',
      password: viewerPassword,
      role: 'VIEWER',
    },
  })

  console.log('✅ Demo users created')

  // Create demo events
  const events = [
    {
      title: 'Palazzo Versace Grand Gala',
      description: 'An exclusive evening of luxury dining and entertainment featuring world-class performers and exquisite cuisine.',
      date: new Date('2024-12-15'),
      time: '19:00',
      venue: 'Grand Ballroom',
      organizer: 'Palazzo Versace Events Team',
      status: 'PUBLISHED',
      images: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3e96deed-e77e-4afd-847b-b11dc75f5236.png',
      documents: '',
      userId: admin.id,
    },
    {
      title: 'New Year\'s Eve Celebration',
      description: 'Ring in the new year with style at our spectacular rooftop celebration with panoramic views of Dubai.',
      date: new Date('2024-12-31'),
      time: '21:00',
      venue: 'Rooftop Terrace',
      organizer: 'Special Events Department',
      status: 'PUBLISHED',
      images: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a3c35d7f-3518-43f3-93e2-e5774691f53b.png',
      documents: '',
      userId: manager.id,
    },
    {
      title: 'Corporate Leadership Summit',
      description: 'A high-level business conference bringing together industry leaders and innovators.',
      date: new Date('2024-11-20'),
      time: '09:00',
      venue: 'Conference Center',
      organizer: 'Business Development Team',
      status: 'COMPLETED',
      images: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ad3e9127-5d53-4c39-be96-d7d11d422c04.png',
      documents: '',
      userId: admin.id,
    },
    {
      title: 'Luxury Fashion Show',
      description: 'Showcase of the latest haute couture collections in an intimate luxury setting.',
      date: new Date('2024-12-08'),
      time: '20:00',
      venue: 'Atrium Gallery',
      organizer: 'Fashion Events Coordinator',
      status: 'DRAFT',
      images: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/eb175ca7-fba2-4323-8332-37e2a3f82e83.png',
      documents: '',
      userId: manager.id,
    },
    {
      title: 'Wine Tasting Evening',
      description: 'An exclusive wine tasting experience featuring rare vintages and expert sommeliers.',
      date: new Date('2024-11-25'),
      time: '18:30',
      venue: 'Wine Cellar',
      organizer: 'Culinary Team',
      status: 'PUBLISHED',
      images: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/727c9912-898c-4716-9d88-32faa68c329b.png',
      documents: '',
      userId: admin.id,
    },
  ]

  for (const eventData of events) {
    const event = await prisma.event.create({
      data: eventData,
    })

    // Create demo guests for each event
    const guests = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+971-50-123-4567',
        rsvpStatus: 'CONFIRMED',
        eventId: event.id,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+971-50-234-5678',
        rsvpStatus: 'CONFIRMED',
        eventId: event.id,
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+971-50-345-6789',
        rsvpStatus: 'PENDING',
        eventId: event.id,
      },
    ]

    for (const guestData of guests) {
      await prisma.guest.create({
        data: guestData,
      })
    }

    // Create demo tasks for each event
    const tasks = [
      {
        title: 'Setup venue decorations',
        description: 'Arrange floral displays and lighting according to event theme',
        dueDate: new Date(eventData.date.getTime() - 24 * 60 * 60 * 1000), // 1 day before event
        status: eventData.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
        assignedTo: 'Decoration Team',
        eventId: event.id,
        userId: eventData.userId,
      },
      {
        title: 'Coordinate catering services',
        description: 'Ensure all dietary requirements are met and service timing is perfect',
        dueDate: new Date(eventData.date.getTime() - 12 * 60 * 60 * 1000), // 12 hours before event
        status: eventData.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
        assignedTo: 'Catering Manager',
        eventId: event.id,
        userId: eventData.userId,
      },
    ]

    for (const taskData of tasks) {
      await prisma.task.create({
        data: taskData,
      })
    }
  }

  console.log('✅ Demo events, guests, and tasks created')
  console.log('🎉 Database seeding completed successfully!')
  
  console.log('\n📋 Demo Login Credentials:')
  console.log('Admin: admin@palazzoversace.com / admin123')
  console.log('Manager: manager@palazzoversace.com / manager123')
  console.log('Viewer: viewer@palazzoversace.com / viewer123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
