import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

    // Verify wallet belongs to user
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!wallet) {
      return new NextResponse('Wallet not found', { status: 404 })
    }

    await prisma.wallet.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting wallet:', error)
    return new NextResponse('Error deleting wallet', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

    const { active } = await req.json()

    const wallet = await prisma.wallet.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!wallet) {
      return new NextResponse('Wallet not found', { status: 404 })
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: params.id },
      data: {
        active,
        status: active ? 'active' : 'inactive',
      },
    })

    return NextResponse.json(updatedWallet)
  } catch (error) {
    console.error('Error updating wallet:', error)
    return new NextResponse('Error updating wallet', { status: 500 })
  }
}
