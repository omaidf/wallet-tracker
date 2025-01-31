import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.wallet.deleteMany()
    console.log('✅ Successfully cleared all wallets')
  } catch (error) {
    console.error('❌ Error clearing wallets:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
