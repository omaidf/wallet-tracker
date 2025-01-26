import { Connection } from '@solana/web3.js'
import { Logger } from './logger'
import { withRetry } from './retry'

export class ConnectionMonitor {
  private healthCheckInterval: NodeJS.Timeout | null = null

  constructor(
    private connection: Connection,
    private intervalMs = 30000,
  ) {}

  async start() {
    await this.checkHealth()
    this.healthCheckInterval = setInterval(() => this.checkHealth(), this.intervalMs)
  }

  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
  }

  private async checkHealth() {
    try {
      await withRetry(async () => {
        const slot = await this.connection.getSlot()
        if (slot) {
          Logger.info('Connection health check: OK')
        } else {
          Logger.warning('Connection health check: Degraded')
        }
      })
    } catch (error) {
      Logger.error('Connection health check failed', error)
    }
  }
}
