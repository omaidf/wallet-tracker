import { Logger } from '../utils/logger'
import { TRADE_CONFIG } from './config/trade-config'

interface BuyEvent {
  wallet: string
  timestamp: number
  solAmount: number
  tokenMint: string
}

export class MultiBuyTracker {
  private static instance: MultiBuyTracker
  private buyEvents: BuyEvent[] = []

  private constructor() {}

  static getInstance(): MultiBuyTracker {
    if (!MultiBuyTracker.instance) {
      MultiBuyTracker.instance = new MultiBuyTracker()
    }
    return MultiBuyTracker.instance
  }

  public trackBuy(wallet: string, solAmount: number, tokenMint: string): boolean {
    const now = Date.now()
    const timeWindow = TRADE_CONFIG.MULTI_BUY.TIME_WINDOW_HOURS * 60 * 60 * 1000 // Convert hours to ms

    // Remove old events outside the time window
    this.buyEvents = this.buyEvents.filter((event) => now - event.timestamp < timeWindow)

    // Add new buy event
    if (solAmount >= TRADE_CONFIG.MULTI_BUY.MIN_BUY_AMOUNT_SOL) {
      this.buyEvents.push({
        wallet,
        timestamp: now,
        solAmount,
        tokenMint,
      })
    }

    Logger.info(`Total buy events: ${this.buyEvents.length} tracked yet.`)

    // Check if we have a multi-buy situation
    return this.isMultiBuy(tokenMint)
  }

  private isMultiBuy(tokenMint: string): boolean {
    const relevantBuys = this.buyEvents.filter((event) => event.tokenMint === tokenMint)
    const uniqueWallets = new Set(relevantBuys.map((event) => event.wallet))

    return uniqueWallets.size >= TRADE_CONFIG.MULTI_BUY.MIN_UNIQUE_WALLETS
  }

  public getMultiBuyStats(tokenMint: string): {
    uniqueWallets: number
    totalSolAmount: number
    recentBuys: BuyEvent[]
  } {
    const relevantBuys = this.buyEvents.filter((event) => event.tokenMint === tokenMint)
    const uniqueWallets = new Set(relevantBuys.map((event) => event.wallet))
    const totalSolAmount = relevantBuys.reduce((sum, event) => sum + event.solAmount, 0)

    return {
      uniqueWallets: uniqueWallets.size,
      totalSolAmount,
      recentBuys: relevantBuys,
    }
  }
}
