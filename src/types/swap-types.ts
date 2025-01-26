import { Prisma, User } from '@prisma/client'

export type SwapType = 'raydium' | 'jupiter' | 'pumpfun' | 'mint_pumpfun' | null

export type WalletWithUsers = Prisma.WalletGetPayload<{
  include: {
    userWallets: {
      include: {
        user: {
          select: {
            id: true
          }
        }
      }
    }
  }
}>

export type WalletsToTrack = {
  address: string
  id: string
  userWallets: [
    {
      name: string
      userId: string
      walletId: string
      user: Pick<User, 'id'>
    },
  ]
}

export interface TokenTransfer {
  tokenAmountIn: string
  tokenAmountOut: string
  tokenInSymbol: string
  tokenOutSymbol: string
  tokenInMint: string
  tokenOutMint: string
}
