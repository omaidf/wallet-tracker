import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const SOLANA_WALLET_REGEX = /^[a-zA-Z0-9]{32,44}$/

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }

    const text = await file.text()
    const rows = text.split('\n').slice(1) // Skip header row

    const wallets = rows
      .map((row) => {
        const [address, name] = row.split(',')
        if (!SOLANA_WALLET_REGEX.test(address)) {
          return null
        }
        return {
          address: address.trim(),
          name: name.trim(),
          userId: user.id,
        }
      })
      .filter((wallet): wallet is { address: string; name: string; userId: string } => wallet !== null)

    await prisma.wallet.createMany({
      data: wallets.map((row) => ({
        name: row.name,
        address: row.address,
        userId: row.userId,
        status: 'active',
        active: true,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading wallets:', error)
    return new NextResponse('Error processing CSV', { status: 500 })
  }
}
