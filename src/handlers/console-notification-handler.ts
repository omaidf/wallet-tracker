import { TxMessages } from '../bot/messages/tx-messages'
import { NativeParserInterface } from '../types/general-interfaces'
import { Logger } from '../utils/logger'

export class ConsoleNotificationHandler {
  private txMessages: TxMessages

  constructor() {
    this.txMessages = new TxMessages()
  }

  public send(message: NativeParserInterface) {
    try {
      const formattedMessage = this.txMessages.formatTransactionMessage(message)
      Logger.info('\nNew Transaction:')
      console.log(formattedMessage)
      console.log('----------------------------------------')
    } catch (error) {
      Logger.error('Error formatting transaction message:', error)
    }
  }
}
