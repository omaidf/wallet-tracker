import { Logger } from '../utils/logger'
import { TRADE_CONFIG } from './config/trade-config'

interface SellEvent {
  wallet: string
  timestamp: number
  solAmount: number
  tokenMint: string
}

export class MultiSellTracker {
  private static instance: MultiSellTracker
  private sellEvents: SellEvent[] = []

  private constructor() {}

  static getInstance(): MultiSellTracker {
    if (!MultiSellTracker.instance) {
      MultiSellTracker.instance = new MultiSellTracker()
    }
    return MultiSellTracker.instance
  }

  public trackSell(wallet: string, solAmount: number, tokenMint: string): boolean {
    const now = Date.now()
    const timeWindow = TRADE_CONFIG.MULTI_SELL.TIME_WINDOW_HOURS * 60 * 60 * 1000

    this.sellEvents = this.sellEvents.filter((event) => now - event.timestamp < timeWindow)

    if (solAmount >= TRADE_CONFIG.MULTI_SELL.MIN_SELL_AMOUNT_SOL) {
      this.sellEvents.push({
        wallet,
        timestamp: now,
        solAmount,
        tokenMint,
      })
    }

    Logger.info(`Total sell events: ${this.sellEvents.length} tracked yet.`)

    return this.isMultiSell(tokenMint)
  }

  private isMultiSell(tokenMint: string): boolean {
    const relevantSells = this.sellEvents.filter((event) => event.tokenMint === tokenMint)
    const uniqueWallets = new Set(relevantSells.map((event) => event.wallet))

    return uniqueWallets.size >= TRADE_CONFIG.MULTI_SELL.MIN_UNIQUE_WALLETS
  }

  public getMultiSellStats(tokenMint: string): {
    uniqueWallets: number
    totalSolAmount: number
    recentSells: SellEvent[]
  } {
    const relevantSells = this.sellEvents.filter((event) => event.tokenMint === tokenMint)
    const uniqueWallets = new Set(relevantSells.map((event) => event.wallet))
    const totalSolAmount = relevantSells.reduce((sum, event) => sum + event.solAmount, 0)

    return {
      uniqueWallets: uniqueWallets.size,
      totalSolAmount,
      recentSells: relevantSells,
    }
  }
}
