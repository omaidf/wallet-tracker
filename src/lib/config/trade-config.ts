export const TRADE_CONFIG = {
  SIGNIFICANT_BUY_RATIO: 0.1, // 10% of market cap
  MINIMUM_CHANGE: 1, // Minimum change in price to trigger a notification
  MIN_SOL_AMOUNT: 20, // Minimum SOL amount for a large buy
  WHALE_ACTIVITY: {
    MIN_SOL_AMOUNT: 0.2, // Minimum SOL amount for whale activity
  },

  // Multi-buy detection config
  MULTI_BUY: {
    MIN_UNIQUE_WALLETS: 3, // Minimum number of different wallets
    TIME_WINDOW_HOURS: 1, // Time window to check in hours
    MIN_BUY_AMOUNT_SOL: 0.0001, // Minimum SOL amount per buy to count
  },

  // Multi-sell detection config
  MULTI_SELL: {
    MIN_UNIQUE_WALLETS: 3, // Minimum number of different wallets
    TIME_WINDOW_HOURS: 1, // Time window to check in hours
    MIN_SELL_AMOUNT_SOL: 0.0001, // Minimum SOL amount per sell to count
  },
}
