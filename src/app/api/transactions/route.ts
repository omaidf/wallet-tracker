import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      select: {
        id: true,
        type: true,
        platform: true,
        owner: true,
        signature: true,
        tokenAmountIn: true,
        tokenAmountOut: true,
        tokenInSymbol: true,
        tokenOutSymbol: true,
        solPrice: true,
        tokenPrice: true,
        marketCap: true,
        holdingPercent: true,
        holdingPrice: true,
        description: true,
        balanceChange: true,
        isNew: true,
        isLargeBuy: true,
        isMultiBuy: true,
        isMultiSell: true,
        isWhaleActivity: true,
        createdAt: true,
        updatedAt: true,
        uniqueWallets: true,
        totalSolAmount: true,
        recentTxs: true,
        tokenOutMint: true,
        wallet: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return new NextResponse('Error fetching transactions', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const transaction = await prisma.transaction.create({
      data: body,
    })
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error creating transaction:', error)
    return new NextResponse('Error creating transaction', { status: 500 })
  }
}

export async function DELETE() {
  try {
    await prisma.transaction.deleteMany()
    return new NextResponse('All transactions deleted', { status: 200 })
  } catch (error) {
    console.error('Error deleting transactions:', error)
    return new NextResponse('Error deleting transactions', { status: 500 })
  }
}
