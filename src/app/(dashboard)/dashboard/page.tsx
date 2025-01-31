'use client'

import { useEffect, useState } from 'react'
import { Transaction } from '@prisma/client'
import { ArrowDownIcon, ArrowUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface TransactionWithWallet extends Transaction {
  wallet?: {
    name: string
  }
}

const REFRESH_INTERVAL = 10000 // 10 seconds

// Helper function to format numbers
const formatAmount = (amount: string) => {
  const num = parseFloat(amount)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`
  return num.toFixed(2)
}

// Add helper function for formatting multi-transaction details
const formatMultiTxDetails = (recentTxs: any) => {
  return recentTxs.slice(0, 3).map((tx: any) => ({
    wallet: `${tx.wallet.slice(0, 4)}...${tx.wallet.slice(-4)}`,
    amount: parseFloat(tx.solAmount).toFixed(2),
    time: formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true }),
  }))
}

// Add token explorer URLs helper
const getTokenLinks = (tokenMint: string) => [
  { name: 'GMGN', url: `https://gmgn.ai/sol/token/${tokenMint}` },
  { name: 'BE', url: `https://birdeye.so/token/${tokenMint}?chain=solana` },
  { name: 'DS', url: `https://dexscreener.com/solana/${tokenMint}` },
  { name: 'PH', url: `https://photon-sol.tinyastro.io/en/lp/${tokenMint}` },
]

export default function Dashboard() {
  const [transactions, setTransactions] = useState<TransactionWithWallet[]>([])
  const [countdown, setCountdown] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/transactions')
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Dashboard - Solana Tracker'
    fetchTransactions()

    // Setup polling interval
    const interval = setInterval(() => {
      fetchTransactions()
      setCountdown(10) // Reset to 10 seconds
    }, REFRESH_INTERVAL)

    // Setup countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 10)) // Changed from 5 to 10
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Live Transactions <span className="text-sm text-gray-500 font-normal">(Showing Last 50)</span>
        </h1>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
          >
            <ArrowPathIcon className="w-5 h-5 text-gray-500" />
          </motion.div>
          <span className="text-sm text-gray-500">Refreshing in {countdown}s</span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
                tx.type === 'buy' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'buy' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'buy' ? (
                      <ArrowDownIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <span>{tx.type === 'buy' ? 'Buy' : 'Sell'}</span>
                      <span className="text-gray-400">on</span>
                      <span className="text-purple-600">{tx.platform}</span>
                      {tx.isWhaleActivity && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Whale
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{tx.tokenAmountIn}</span>
                        <span className="ml-1 text-sm font-bold text-blue-600">{tx.tokenInSymbol.toUpperCase()}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{tx.tokenAmountOut}</span>
                        <span className="ml-1 text-sm font-bold text-blue-600">{tx.tokenOutSymbol.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CurrencyDollarIcon className="w-4 h-4 text-yellow-500" />
                    <p className="text-sm font-medium">{formatAmount(tx.solPrice)} USD per SOL</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              {tx.description && <p className="mt-2 text-sm text-gray-600">{tx.description}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-mono">
                    {tx.owner.slice(0, 8)}...{tx.owner.slice(-8)}
                  </span>
                  {tx.wallet?.name && (
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      {tx.wallet.name}
                    </span>
                  )}
                </div>
                {tx.tokenPrice && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    ${tx.tokenPrice.toFixed(8)}
                  </span>
                )}
                {tx.marketCap && (
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                    MC: ${(tx.marketCap / 1_000_000).toFixed(2)}M
                  </span>
                )}

                {/* Add token explorer links if not SOL */}
                {tx.tokenOutSymbol !== 'SOL' && tx.tokenOutMint && (
                  <div className="flex items-center gap-1 ml-auto">
                    {getTokenLinks(tx.tokenOutMint).map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium 
                          text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {(tx.isMultiBuy || tx.isMultiSell) && tx.recentTxs && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-700">
                      {tx.isMultiBuy ? 'Multi-Buy' : 'Multi-Sell'} Activity
                    </span>
                    <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                      {tx.uniqueWallets} wallets
                    </span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      Total: {tx.totalSolAmount?.toFixed(2)} SOL
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {formatMultiTxDetails(tx.recentTxs).map((detail: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded"
                      >
                        <span className="font-mono">{detail.wallet}</span>
                        <span className="font-medium">{detail.amount} SOL</span>
                        <span className="text-gray-500">{detail.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
