import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create languages
  const english = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      name: 'English',
      code: 'en',
      flag: '🇺🇸',
      isActive: true,
    },
  })

  const spanish = await prisma.language.upsert({
    where: { code: 'es' },
    update: {},
    create: {
      name: 'Spanish',
      code: 'es',
      flag: '🇪🇸',
      isActive: true,
    },
  })

  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@church.com' },
    update: {},
    create: {
      email: 'admin@church.com',
      name: 'Church Administrator',
      password: 'hashed_password_here', // In production, use proper password hashing
      role: 'admin',
    },
  })

  // Create sample lessons
  const lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-1' },
    update: {},
    create: {
      id: 'lesson-1',
      title: 'Welcome to Our Church',
      description: 'An introduction to our church community and values',
      content: 'Welcome to our church family! We are excited to have you join us on this spiritual journey...',
      languageId: english.id,
      isPublished: true,
      order: 1,
    },
  })

  const lesson2 = await prisma.lesson.upsert({
    where: { id: 'lesson-2' },
    update: {},
    create: {
      id: 'lesson-2',
      title: 'Bienvenidos a Nuestra Iglesia',
      description: 'Una introducción a nuestra comunidad eclesiástica y valores',
      content: '¡Bienvenidos a nuestra familia de la iglesia! Estamos emocionados de tenerlos con nosotros en este viaje espiritual...',
      languageId: spanish.id,
      isPublished: true,
      order: 1,
    },
  })

  console.log('Seed data created successfully!')
  console.log({ admin, english, spanish, lesson1, lesson2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



