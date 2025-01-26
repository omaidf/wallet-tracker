import { Connection, Logs, PublicKey } from '@solana/web3.js'
import { RpcConnectionManager } from '../providers/solana'
import { ConsoleNotificationHandler } from '../handlers/console-notification-handler'
import { NativeParser } from '../parsers/native-parser'
import { withRetry } from '../utils/retry'
import { Logger } from '../utils/logger'
import { ConnectionMonitor } from '../utils/connection-monitor'
import fs from 'fs'
import { CronJobs } from './cron-jobs'
import { TransactionParser } from '../parsers/transaction-parser'
import { WatchTransaction } from './watch-transactions'
import { TokenUtils } from './token-utils'

export class TrackWallets {
  private consoleNotificationHandler: ConsoleNotificationHandler
  private nativeParser: NativeParser
  private activeSubscriptions: Map<string, number>
  private connectionMonitor: ConnectionMonitor

  constructor() {
    this.consoleNotificationHandler = new ConsoleNotificationHandler()
    this.nativeParser = new NativeParser()
    this.activeSubscriptions = new Map()
    this.connectionMonitor = new ConnectionMonitor(RpcConnectionManager.logConnection)
  }

  private async getTransactionDetails(latestSignature: string) {
    const transaction = await RpcConnectionManager.logConnection.getParsedTransaction(latestSignature, {
      maxSupportedTransactionVersion: 0,
    })
    return transaction
  }

  public async trackWallet(walletAddress: string, isMain: boolean = false) {
    try {
      const publicKey = new PublicKey(walletAddress)
      Logger.info(`Starting to track wallet: ${walletAddress}`)

      // Get recent transactions
      if (!isMain) {
        await this.showRecentTransactions(publicKey)
      }

      const subscriptionId = await withRetry(async () => {
        return RpcConnectionManager.logConnection.onLogs(
          publicKey,
          async (logs, ctx) => {
            try {
              const { isRelevant, swap } = new WatchTransaction().isRelevantTransaction(logs)
              if (!isRelevant) {
                return
              }
              const transactionSignature = logs.signature
              console.log('transactionSignature', transactionSignature)

              const transactionDetails = await this.getTransactionDetails(transactionSignature)
              if (!transactionDetails) {
                Logger.error('No transaction details found for', transactionSignature)
                return
              }
              const solPriceUsd = CronJobs.getSolPrice() || (await TokenUtils.getSolPriceNative())
              const transactionParser = new TransactionParser(transactionSignature)
              const parsed = await transactionParser.parseRpc([transactionDetails], swap, solPriceUsd)

              if (!parsed) {
                // console.log('NO PARSED')
                return
              }
              Logger.info(JSON.stringify(parsed, null, 2))
              this.consoleNotificationHandler.send(parsed)
            } catch (error) {
              Logger.error('Error parsing transaction:', error)
            }
          },
          'confirmed',
        )
      })

      this.activeSubscriptions.set(walletAddress, subscriptionId)
      Logger.success(`Successfully initialized tracking for ${walletAddress}`)
      return subscriptionId
    } catch (error) {
      Logger.error(`Failed to track wallet ${walletAddress}:`, error)
      throw error
    }
  }

  private async showRecentTransactions(publicKey: PublicKey) {
    try {
      Logger.info('Fetching recent transactions...')
      const signatures = await RpcConnectionManager.getRandomConnection().getSignaturesForAddress(publicKey, {
        limit: 1,
      })

      if (signatures.length === 0) {
        console.log('No transactions found for this wallet.')
        return null
      }

      // Get the most recent transaction signature
      const latestSignature = signatures[0].signature

      Logger.info(`Latest Signature: ${latestSignature}`)

      // Get the transaction details
      const transaction = await this.getTransactionDetails(latestSignature)
      if (!transaction) {
        Logger.error('No transaction details found for', latestSignature)
        return
      }

      fs.writeFileSync('transaction.json', JSON.stringify(transaction, null, 2))

      if (transaction?.blockTime) {
        Logger.info(`Transaction block time: ${transaction.blockTime}`)
      }

      const solPriceUsd = CronJobs.getSolPrice() || (await TokenUtils.getSolPriceNative())
      const transactionParser = new TransactionParser(latestSignature)
      const { isRelevant, swap } = new WatchTransaction().isRelevantTransaction2([
        transaction?.meta?.logMessages,
      ] as unknown as Logs[])
      if (!isRelevant) {
        // console.log('TRANSACTION IS NOT DEFI', logs.signature)
        return
      }
      const parsed = await transactionParser.parseRpc([transaction], swap, solPriceUsd)

      if (!parsed) {
        // console.log('NO PARSED')
        return
      }
      if (!parsed) {
        console.log('NO PARSED')
        return
      }
      Logger.info(JSON.stringify(parsed, null, 2))
      this.consoleNotificationHandler.send(parsed)
    } catch (error) {
      Logger.error('Error fetching recent transactions:', error)
    }
  }

  public async startMonitoring() {
    await this.connectionMonitor.start()
  }

  public async cleanup() {
    this.connectionMonitor.stop()
    for (const [address] of this.activeSubscriptions) {
      await this.stopTracking(address)
    }
  }

  private async stopTracking(walletAddress: string) {
    try {
      const subscriptionId = this.activeSubscriptions.get(walletAddress)
      if (subscriptionId) {
        await RpcConnectionManager.logConnection.removeOnLogsListener(subscriptionId)
        this.activeSubscriptions.delete(walletAddress)
        Logger.info(`Stopped tracking wallet: ${walletAddress}`)
      }
    } catch (error) {
      Logger.error(`Error stopping tracking for ${walletAddress}:`, error)
    }
  }
}
