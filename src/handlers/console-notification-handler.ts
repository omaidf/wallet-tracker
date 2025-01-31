import { TxMessages } from '../bot/messages/tx-messages'
import { NativeParserInterface } from '../types/general-interfaces'
import { Logger } from '../utils/logger'
import { prisma } from '@/lib/prisma'

export class ConsoleNotificationHandler {
  private txMessages: TxMessages

  constructor() {
    this.txMessages = new TxMessages()
  }

  public async send(message: NativeParserInterface) {
    try {
      // Format and log the message
      const formattedMessage = this.txMessages.formatTransactionMessage(message)
      // Logger.info('\nNew Transaction:')
      // console.log(formattedMessage)
      // console.log('----------------------------------------')
      // Save to database using Prisma Pulse
      await this.saveTransaction(message)
    } catch (error) {
      Logger.error('Error handling transaction:', error)
    }
  }

  private async saveTransaction(tx: NativeParserInterface) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          type: tx.type,
          platform: tx.platform ?? 'unknown',
          owner: tx.owner,
          signature: tx.signature,
          tokenAmountIn: tx.tokenTransfers.tokenAmountIn,
          tokenAmountOut: tx.tokenTransfers.tokenAmountOut,
          tokenInSymbol: tx.tokenTransfers.tokenInSymbol,
          tokenOutSymbol: tx.tokenTransfers.tokenOutSymbol,
          tokenInMint: tx.tokenTransfers.tokenInMint,
          tokenOutMint: tx.tokenTransfers.tokenOutMint,
          solPrice: tx.solPrice,
          tokenPrice: tx.swappedTokenPrice,
          marketCap: tx.swappedTokenMc,
          holdingPercent: tx.currenHoldingPercentage,
          holdingPrice: tx.currentHoldingPrice,
          description: tx.description,
          balanceChange: tx.balanceChange,
          isNew: tx.isNew,
          isLargeBuy: tx.isLargeBuy,
          isMultiBuy: tx.isMultiBuy,
          isMultiSell: tx.isMultiSell,
          isWhaleActivity: tx.isWhaleActivity,

          // Handle multi-buy/sell stats if present
          ...(tx.multiBuyStats && {
            uniqueWallets: tx.multiBuyStats.uniqueWallets,
            totalSolAmount: tx.multiBuyStats.totalSolAmount,
            recentTxs: tx.multiBuyStats.recentBuys,
          }),
          ...(tx.multiSellStats && {
            uniqueWallets: tx.multiSellStats.uniqueWallets,
            totalSolAmount: tx.multiSellStats.totalSolAmount,
            recentTxs: tx.multiSellStats.recentSells,
          }),
        },
      })

      Logger.info(`Transaction saved with ID: ${transaction.id}`)
    } catch (error) {
      Logger.error('Error saving transaction:', error)
      // Don't throw error to prevent disrupting the main flow
    }
  }
}
