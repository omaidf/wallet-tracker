import { Connection, clusterApiUrl } from '@solana/web3.js'
import dotenv from 'dotenv'

dotenv.config()

const SOLANA_NETWORK = clusterApiUrl('mainnet-beta')
const HELIUS_NETWORK = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`

// Only create connections for non-empty API keys
const CHAINSTACK_NETWORK = process.env.CHAINSTACK_API_KEY
  ? `https://your-chainstack-endpoint/${process.env.CHAINSTACK_API_KEY}`
  : ''

const QUICKNODE_NETWORK = process.env.QUICKNODE_API_KEY
  ? `https://your-quicknode-endpoint/${process.env.QUICKNODE_API_KEY}`
  : ''

const USE_SOLANA_RPC = process.env.USE_SOLANA_RPC === 'true'

export class RpcConnectionManager {
  static connections: Connection[] = USE_SOLANA_RPC
    ? [new Connection(SOLANA_NETWORK, 'confirmed')]
    : [
        ...(CHAINSTACK_NETWORK ? [new Connection(CHAINSTACK_NETWORK, 'confirmed')] : []),
        ...(QUICKNODE_NETWORK ? [new Connection(QUICKNODE_NETWORK, 'confirmed')] : []),
      ]

  static logConnection = new Connection(HELIUS_NETWORK, 'confirmed')

  static getRandomConnection(): Connection {
    // Fallback to SOLANA_NETWORK if no other connections available
    if (this.connections.length === 0) {
      this.connections = [new Connection(SOLANA_NETWORK, 'confirmed')]
    }
    const randomIndex = Math.floor(Math.random() * this.connections.length)
    return this.connections[randomIndex]
  }
}
