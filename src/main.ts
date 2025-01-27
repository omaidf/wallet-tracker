import { TrackWallets } from './lib/track-wallets'
import chalk from 'chalk'
import gradient from 'gradient-string'

const WALLETS_TO_TRACK = [
  'AAAAAA9FvEidYJiK3gCp6sZ6M93uio2tk9Ep23kzZggA',
  '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9',
  '5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD',
  '5ho9wT4YVTbetpNBFiZAFn7sJ74GgvgjVTUWDnwmPW1U',
  'DQyLTdDksgBsVZUYajb9iQLSM5XiVHW44dyZceoGg1uL',
]

async function main() {
  console.log(gradient.pastel.multiline('\n🐱 Solana | Wallet Tracker\n'))
  console.log(chalk.cyan('Starting wallet tracking...\n'))

  const trackWallets = new TrackWallets()

  try {
    for (const wallet of WALLETS_TO_TRACK) {
      await trackWallets.trackWallet(wallet, true)
    }
    console.log(chalk.green('\nTracking initialized successfully! Press Ctrl+C to stop.\n'))

    // Handle cleanup on exit
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\nShutting down...'))
      await trackWallets.cleanup()
      process.exit(0)
    })
  } catch (error) {
    console.error(chalk.red('Error starting tracker:'), error)
    process.exit(1)
  }
}

main()
