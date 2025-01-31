import { TrackWallets } from './lib/track-wallets'
import chalk from 'chalk'
import gradient from 'gradient-string'
import { prisma } from './lib/prisma'

const WALLETS_TO_TRACK = [
  'AAAAAA9FvEidYJiK3gCp6sZ6M93uio2tk9Ep23kzZggA',
  '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9',
  '5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD',
  '5ho9wT4YVTbetpNBFiZAFn7sJ74GgvgjVTUWDnwmPW1U',
  'DQyLTdDksgBsVZUYajb9iQLSM5XiVHW44dyZceoGg1uL',
]

export class WalletTracker {
  private static instance: WalletTracker
  private trackWallets: TrackWallets
  private isTracking: boolean = false

  private constructor() {
    this.trackWallets = new TrackWallets()
  }

  static getInstance(): WalletTracker {
    if (!WalletTracker.instance) {
      WalletTracker.instance = new WalletTracker()
    }
    return WalletTracker.instance
  }

  async startTracking(wallets: string[]) {
    if (this.isTracking) return

    console.log(gradient.pastel.multiline('\n🐱 Solana | Wallet Tracker\n'))
    console.log(chalk.cyan('Starting wallet tracking...\n'))

    this.isTracking = true
    try {
      for (const wallet of wallets) {
        await this.trackWallets.trackWallet(wallet, true)
      }
      console.log(chalk.green('\nTracking initialized successfully!\n'))
    } catch (error) {
      console.error(chalk.red('Error starting tracker:'), error)
      this.isTracking = false
      throw error
    }
  }

  async stopTracking() {
    if (!this.isTracking) return

    console.log(chalk.yellow('\nShutting down tracker...'))
    await this.trackWallets.cleanup()
    this.isTracking = false
    console.log(chalk.green('Tracker stopped successfully'))
  }

  getStatus(): boolean {
    return this.isTracking
  }
}

async function getActiveWallets() {
  // const wallets = await prisma.wallet.findMany({
  //   where: {
  //     active: true,
  //   },
  //   select: {
  //     address: true,
  //   },
  // })
  // return wallets.map((wallet) => wallet.address)
  return WALLETS_TO_TRACK
}

async function main() {
  const walletTracker = WalletTracker.getInstance()

  try {
    const activeWallets = await getActiveWallets()

    if (activeWallets.length === 0) {
      console.log(chalk.yellow('No active wallets found in database'))
      return
    }

    console.log(chalk.blue(`Found ${activeWallets.length} active wallets to track`))
    await walletTracker.startTracking(activeWallets)

    // Handle cleanup on exit
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\nShutting down...'))
      await walletTracker.stopTracking()
      process.exit(0)
    })
  } catch (error) {
    console.error(chalk.red('Error starting tracker:'), error)
    process.exit(1)
  }
}

main()
