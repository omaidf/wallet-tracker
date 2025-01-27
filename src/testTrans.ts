import { TransactionParser } from './parsers/transaction-parser'
import { Logger } from './utils/logger'
import { CronJobs } from './lib/cron-jobs'
import { WatchTransaction } from './lib/watch-transactions'
import { TokenUtils } from './lib/token-utils'
import { RpcConnectionManager } from './providers/solana'
import fs from 'fs'

const main = async () => {
  try {
    // Read and parse transaction
    // const transaction_json = fs.readFileSync('transaction.json', 'utf8')
    // const transaction = JSON.parse(transaction_json)
    const transaction = await RpcConnectionManager.logConnection.getParsedTransaction(
      '4dBf8MozPRj17jwuUgYMU8S6ma8pUu5tWP98xxrsAYDUZXA1ZgnNGQ1HSWZKDNhq5mzdbPhCgztdL29aMLD1pJgx',
      {
        maxSupportedTransactionVersion: 0,
      },
    )

    fs.writeFileSync('transaction2.json', JSON.stringify(transaction, null, 2))

    // Get SOL price
    // const solPriceUsd = CronJobs.getSolPrice() || (await TokenUtils.getSolPriceNative())
    const solPriceUsd = '227.38'
    if (!solPriceUsd) {
      Logger.error('Failed to get SOL price')
      return
    }

    // Create parser instance
    const transactionParser = new TransactionParser(transaction?.transaction.signatures[0] || '')

    // Check if transaction is relevant
    const { isRelevant, swap } = new WatchTransaction().isRelevantTransaction2(transaction?.meta?.logMessages as any)

    if (!isRelevant) {
      Logger.info('Transaction is not a DeFi transaction')
      return
    }

    // Parse transaction
    const parsed = await transactionParser.parseRpc([transaction], swap, solPriceUsd)
    if (!parsed) {
      Logger.warning('Could not parse transaction')
      return
    }

    // Log results
    Logger.info('Parsed Transaction:')
    console.log(JSON.stringify(parsed, null, 2))
    Logger.info(`Description: ${parsed?.description}`)
  } catch (error) {
    Logger.error('Error parsing transaction:', error)
  }
}

main()
