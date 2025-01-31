import { PrismaClient } from '@prisma/client'
import { withPulse } from '@prisma/extension-pulse'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(
    withPulse({
      apiKey: process.env.PULSE_API_KEY as string,
    }),
  )
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export types for Pulse subscriptions
export type WalletChangeCallback = (data: {
  wallet: {
    id: string
    address: string
    name: string
    balance: number
    network: string
    status: string
    active: boolean
    userId: string
    createdAt: Date
    updatedAt: Date
  }
}) => void
