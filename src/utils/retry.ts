import { MAX_RETRIES, RETRY_DELAY } from '../constants/config'
import chalk from 'chalk'

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      console.log(chalk.yellow(`Operation failed, retrying... (${retries} attempts left)`))
      await new Promise((resolve) => setTimeout(resolve, delay))
      return withRetry(operation, retries - 1, delay)
    }
    throw error
  }
}
