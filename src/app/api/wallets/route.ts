import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const SOLANA_WALLET_REGEX = /^[a-zA-Z0-9]{32,44}$/

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const { name, address } = await req.json()

    if (!SOLANA_WALLET_REGEX.test(address)) {
      return new NextResponse('Invalid wallet address', { status: 400 })
    }

    const wallet = await prisma.wallet.create({
      data: {
        name,
        address,
        userId: user.id,
        status: 'active',
        active: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
        balance: true,
        network: true,
        status: true,
        active: true,
        createdAt: true,
      },
    })

    return NextResponse.json(wallet)
  } catch (error) {
    console.error('Error creating wallet:', error)
    return new NextResponse('Error creating wallet', { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        address: true,
        balance: true,
        network: true,
        status: true,
        active: true,
        createdAt: true,
      },
    })

    return NextResponse.json(wallets)
  } catch (error) {
    console.error('Error fetching wallets:', error)
    return new NextResponse('Error fetching wallets', { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    await prisma.wallet.deleteMany({
      where: { userId: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting all wallets:', error)
    return new NextResponse('Error deleting all wallets', { status: 500 })
  }
}
