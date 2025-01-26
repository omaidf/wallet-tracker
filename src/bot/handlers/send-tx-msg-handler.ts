import { TokenPrices } from '../../lib/token-prices-api'
import { FormatNumbers } from '../../lib/format-numbers'
import { TxMessages } from '../messages/tx-messages'
import { PrismaWalletRepository } from '../../repositories/prisma/wallet'
import { NativeParserInterface } from '../../types/general-interfaces'
import { Logger } from '../../utils/logger'

export class SendTransactionMsgHandler {
  private tokenPrices: TokenPrices
  private prismaWalletRepository: PrismaWalletRepository
  constructor() {
    this.tokenPrices = new TokenPrices()
    this.prismaWalletRepository = new PrismaWalletRepository()
  }

  public async send(message: NativeParserInterface, chatId: string) {
    const tokenToMc = message.type === 'buy' ? message.tokenTransfers.tokenInMint : message.tokenTransfers.tokenOutMint
    const tokenToMcSymbol =
      message.type === 'buy' ? message.tokenTransfers.tokenInSymbol : message.tokenTransfers.tokenOutSymbol

    const walletName = await this.prismaWalletRepository.getUserWalletNameById(chatId, message.owner)

    if (!walletName?.address || !message.owner) {
      console.log('Address not found in user wallets')
      return
    }

    try {
      if (message.platform === 'raydium' || message.platform === 'jupiter') {
        let tokenMarketCap = message.swappedTokenMc

        // Check if the market cap is below 1000 and adjust if necessary
        if (tokenMarketCap && tokenMarketCap < 1000) {
          console.log('MC ADJUSTED')
          tokenMarketCap *= 1000
        }

        const formattedMarketCap = tokenMarketCap ? FormatNumbers.formatPrice(tokenMarketCap) : undefined
        const tokenPrice = message.swappedTokenPrice

        const messageText = TxMessages.txMadeMessage(message, formattedMarketCap, walletName?.name)
        Logger.info(`Message Text: ${messageText}`)
        return
      } else if (message.platform === 'pumpfun') {
        // const tokenInfo = await this.tokenPrices.gmgnTokenInfo(tokenToMc)
        // let tokenMarketCap = tokenInfo?.market_cap
        // const tokenInfo = await this.tokenPrices.pumpFunTokenInfo(tokenToMc)
        // let tokenMarketCap = tokenInfo?.usd_market_cap

        let tokenMarketCap = message.swappedTokenMc

        const formattedMarketCap = tokenMarketCap ? FormatNumbers.formatPrice(tokenMarketCap) : undefined

        const messageText = TxMessages.txMadeMessage(message, formattedMarketCap, walletName?.name)
        Logger.info(`Message Text: ${messageText}`)
        return
      } else if (message.platform === 'mint_pumpfun') {
        // new!
        const messageText = TxMessages.tokenMintedMessage(message, walletName?.name)

        Logger.info(`Message Text: ${messageText}`)
        return
      }
    } catch (error: any) {
      if (error.response && error.response.statusCode === 403) {
        console.log(`User ${chatId} has blocked the bot or chat no longer exists`)
      } else {
        console.log(`Failed to send message to ${chatId}:`, error)
      }
    }

    return
  }
}
