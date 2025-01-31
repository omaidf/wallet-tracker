// import cron from 'node-cron'
// import { Payments } from './payments'
import { TokenUtils } from './token-utils'

export class CronJobs {
  private static cachedPrice: string | undefined = undefined
  private static lastFetched: number = 0
  private static readonly refreshInterval: number = 5 * 60 * 1000 // 5 minutes

  public async updateSolPrice(): Promise<string | undefined> {
    const now = Date.now()

    if (CronJobs.cachedPrice && now - CronJobs.lastFetched < CronJobs.refreshInterval) {
      // console.log('Using cached Solana price:', CronJobs.cachedPrice)
      return CronJobs.cachedPrice
    }

    try {
      // console.log('REFETCHING SOL PRICE')
      let solPrice = await TokenUtils.getSolPriceGecko()

      if (!solPrice) {
        solPrice = await TokenUtils.getSolPriceNative()
      }

      if (solPrice) {
        CronJobs.cachedPrice = solPrice
        CronJobs.lastFetched = now
      }

      return CronJobs.cachedPrice!
    } catch (error) {
      console.error('Error fetching Solana price:', error)

      // Fallback to the last cached price, if available
      if (CronJobs.cachedPrice) {
        return CronJobs.cachedPrice
      }

      return
    }
  }

  static getSolPrice() {
    return this.cachedPrice
  }
}
