import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // First, delete all existing users
  await prisma.user.deleteMany()

  // Create test user
  const hashedPassword = await hash('password123', 12)

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  })

  console.log({ user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
