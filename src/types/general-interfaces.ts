import { SwapType, WalletWithUsers } from './swap-types'

export interface NativeParserInterface {
  type: 'buy' | 'sell'
  platform: SwapType
  owner: string
  signature: string
  tokenTransfers: {
    tokenAmountIn: string
    tokenAmountOut: string
    tokenInSymbol: string
    tokenOutSymbol: string
    tokenInMint: string
    tokenOutMint: string
  }
  solPrice: string
  swappedTokenPrice: number
  currenHoldingPercentage: string
  currentHoldingPrice: string
  swappedTokenMc: number
  description: string
  balanceChange: number
  isNew: boolean
  isLargeBuy: boolean
  isMultiBuy: boolean
  multiBuyStats?: MultiBuyStats
  isMultiSell: boolean
  multiSellStats?: MultiSellStats
  isWhaleActivity: boolean
}

export interface CreateUserInterface {
  id: string
  username: string
  firstName: string
  lastName: string
}

export interface CreateUserGroupInterface {
  id: string
  name: string
  userId: string
}

export interface ParsedTxInfo {
  info: {
    amount: string
    authority: string
    destination: string
    source: string
  }
  type: string
}

export interface UserGroup {
  id: string
  name: string
}

export interface TxPerSecondCapInterface {
  wallet: WalletWithUsers
  walletData: { count: number; startTime: number }
  excludedWallets: Map<string, boolean>
}

export interface SetupWalletWatcherProps {
  userId?: string | null
  walletId?: string | null
  event: 'create' | 'delete' | 'initial' | 'update'
}

export interface MultiBuyStats {
  uniqueWallets: number
  totalSolAmount: number
  recentBuys: Array<{
    wallet: string
    timestamp: number
    solAmount: number
    tokenMint: string
  }>
}

export interface MultiSellStats {
  uniqueWallets: number
  totalSolAmount: number
  recentSells: Array<{
    wallet: string
    timestamp: number
    solAmount: number
    tokenMint: string
  }>
}
