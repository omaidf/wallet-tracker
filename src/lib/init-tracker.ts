import { WalletTracker } from '@/main'

let isInitialized = false

export async function initializeTracker() {
  if (isInitialized) return

  try {
    const tracker = WalletTracker.getInstance()
    await tracker.initializeTracking()
    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize tracker:', error)
  }
}
