import { PublicKey } from '@solana/web3.js'

import { SubscriptionPlan } from '@prisma/client'
import { MAX_FREE_DAILY_MESSAGES } from '../constants/pricing'

import { MAX_5_MIN_TXS_ALLOWED } from '../constants/handi-cat'
import { RpcConnectionManager } from '../providers/solana'
import { PrismaWalletRepository } from '../repositories/prisma/wallet'

export class RateLimit {
  private prismaWalletRepository: PrismaWalletRepository

  constructor(private subscriptions: Map<string, number>) {
    this.prismaWalletRepository = new PrismaWalletRepository()
  }

  public async last5MinutesTxs(walletAddress: string) {
    const currentTime = Date.now()

    // Calculate the time 5 minutes ago
    const fiveMinutesAgo = currentTime - 1 * 60 * 1000

    const signatures = await RpcConnectionManager.connections[0].getSignaturesForAddress(new PublicKey(walletAddress), {
      limit: MAX_5_MIN_TXS_ALLOWED,
    })

    // Filter the transactions that occurred in the last 5 minutes
    const recentTransactions = signatures.filter((signatureInfo) => {
      const transactionTime = signatureInfo.blockTime! * 1000 // Convert seconds to milliseconds
      return transactionTime >= fiveMinutesAgo
    })

    return recentTransactions.length
  }

  public async dailyMessageLimit(messagesToday: number, userPlan: SubscriptionPlan) {
    if (userPlan === 'FREE' && messagesToday >= MAX_FREE_DAILY_MESSAGES) {
      return { dailyLimitReached: true }
    }
  }
}
