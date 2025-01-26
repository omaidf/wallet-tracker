import chalk from 'chalk'
import { format } from 'date-fns'

export class Logger {
  static info(message: string) {
    console.log(`${chalk.blue('ℹ')} ${chalk.gray(this.getTimestamp())} ${message}`)
  }

  static success(message: string) {
    console.log(`${chalk.green('✓')} ${chalk.gray(this.getTimestamp())} ${message}`)
  }

  static error(message: string, error?: any) {
    console.error(`${chalk.red('✗')} ${chalk.gray(this.getTimestamp())} ${message}`)
    if (error) {
      console.error(chalk.red(error))
    }
  }

  static warning(message: string) {
    console.warn(`${chalk.yellow('⚠')} ${chalk.gray(this.getTimestamp())} ${message}`)
  }

  private static getTimestamp(): string {
    return format(new Date(), 'HH:mm:ss')
  }
}
