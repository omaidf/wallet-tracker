import { Logs, PublicKey } from '@solana/web3.js'
import chalk from 'chalk'
import EventEmitter from 'events'
import {
  JUPITER_PROGRAM_ID,
  PUMP_FUN_PROGRAM_ID,
  PUMP_FUN_TOKEN_MINT_AUTH,
  RAYDIUM_PROGRAM_ID,
} from '../config/program-ids'
import { TransactionParser } from '../parsers/transaction-parser'
import { RpcConnectionManager } from '../providers/solana'
import { SwapType, WalletWithUsers } from '../types/swap-types'
import { CronJobs } from './cron-jobs'

export const trackedWallets: Set<string> = new Set()

export class WatchTransaction extends EventEmitter {
  public subscriptions: Map<string, number>

  private walletTransactions: Map<string, { count: number; startTime: number }>
  private excludedWallets: Map<string, boolean>

  constructor() {
    super()

    this.subscriptions = new Map()
    this.walletTransactions = new Map()
    this.excludedWallets = new Map()

    // this.trackedWallets = new Set()
  }

  public async watchSocket(wallets: WalletWithUsers[]): Promise<void> {
    try {
      for (const wallet of wallets) {
        const publicKey = new PublicKey(wallet.address)
        const walletAddress = publicKey.toBase58()

        // Check if a subscription already exists for this wallet address
        if (this.subscriptions.has(walletAddress)) {
          // console.log(`Already watching for: ${walletAddress}`)
          continue // Skip re-subscribing
        }

        console.log(chalk.greenBright(`Watching transactions for wallet: `) + chalk.yellowBright.bold(walletAddress))

        // Initialize transaction count and timestamp
        this.walletTransactions.set(walletAddress, { count: 0, startTime: Date.now() })

        // Start real-time log
        const subscriptionId = RpcConnectionManager.logConnection.onLogs(
          publicKey,
          async (logs, ctx) => {
            // Exclude wallets that have reached the limit
            if (this.excludedWallets.has(walletAddress)) {
              console.log(`Wallet ${walletAddress} is excluded from logging.`)
              return
            }

            // if (wallet.userWallets[0].status === 'SPAM_PAUSED') {
            //   console.log('PAUSED TRANSACTIONS FOR: ', walletAddress)
            //   return
            // }

            const { isRelevant, swap } = this.isRelevantTransaction(logs)

            if (!isRelevant) {
              // console.log('TRANSACTION IS NOT DEFI', logs.signature)
              return
            }
            // console.log('TRANSACTION IS DEFI', logs.signature)
            // check txs per second
            const walletData = this.walletTransactions.get(walletAddress)
            if (!walletData) {
              return
            }

            const transactionSignature = logs.signature

            const randomConnection = RpcConnectionManager.getRandomConnection()

            const transactionDetails = await this.getParsedTransaction(transactionSignature)

            if (!transactionDetails || transactionDetails[0] === null) {
              return
            }

            // Parse transaction
            const solPriceUsd = CronJobs.getSolPrice()
            const transactionParser = new TransactionParser(transactionSignature)
            const parsed = await transactionParser.parseRpc(transactionDetails, swap, solPriceUsd)

            if (!parsed) {
              // console.log('NO PARSED')
              return
            }

            console.log(parsed.description)
          },
          'confirmed',
        )

        // Store subscription ID
        this.subscriptions.set(wallet.address, subscriptionId)
        console.log(
          chalk.greenBright(`Subscribed to logs with subscription ID: `) + chalk.yellowBright.bold(subscriptionId),
        )
      }
    } catch (error) {
      console.error('Error in watchSocket:', error)
    }
  }

  public async getParsedTransaction(transactionSignature: string, retries = 4) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const transactionDetails = await RpcConnectionManager.getRandomConnection().getParsedTransactions(
          [transactionSignature],
          {
            maxSupportedTransactionVersion: 0,
          },
        )

        if (transactionDetails && transactionDetails[0] !== null) {
          return transactionDetails
        }

        console.log(`Attempt ${attempt}: No transaction details found for ${transactionSignature}`)
      } catch (error) {
        console.error(`Attempt ${attempt}: Error fetching transaction details`, error)
      }

      // Delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }

    console.error(`Failed to fetch transaction details after ${retries} retries for signature:`, transactionSignature)
    return null
  }

  public isRelevantTransaction(logs: Logs): { isRelevant: boolean; swap: SwapType } {
    if (!logs.logs || logs.logs.length === 0) {
      return { isRelevant: false, swap: null }
    }

    const logString = logs.logs.join(' ')

    if (logString.includes(PUMP_FUN_TOKEN_MINT_AUTH)) {
      return { isRelevant: true, swap: 'mint_pumpfun' }
    }
    if (logString.includes(PUMP_FUN_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'pumpfun' }
    }
    if (logString.includes(JUPITER_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'jupiter' }
    }
    if (logString.includes(RAYDIUM_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'raydium' }
    }

    return { isRelevant: false, swap: null }
  }

  public isRelevantTransaction2(logs: Logs[]): { isRelevant: boolean; swap: SwapType } {
    if (!logs || logs.length === 0) {
      return { isRelevant: false, swap: null }
    }

    const logString = logs.join(' ')

    if (logString.includes(PUMP_FUN_TOKEN_MINT_AUTH)) {
      return { isRelevant: true, swap: 'mint_pumpfun' }
    }
    if (logString.includes(PUMP_FUN_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'pumpfun' }
    }
    if (logString.includes(JUPITER_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'jupiter' }
    }
    if (logString.includes(RAYDIUM_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'raydium' }
    }

    return { isRelevant: false, swap: null }
  }
}
