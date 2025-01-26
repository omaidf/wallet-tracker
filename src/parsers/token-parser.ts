import { Connection, PublicKey, VersionedTransactionResponse } from '@solana/web3.js'
import { Collection, Data, Metadata, TokenStandard, Uses } from '@metaplex-foundation/mpl-token-metadata'
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'

interface TokenInfo {
  key: string
  updateAuthority: string
  mint: string
  data: Data
  primarySaleHappened: boolean
  isMutable: boolean
  editionNonce: number
  tokenStandard: TokenStandard
  collection: Collection
  uses: Uses
}

export class TokenParser {
  constructor(private connection: Connection) {
    this.connection = connection
  }

  public async getTokenInfo(tokenMint: string): Promise<TokenInfo> {
    const mintPublicKey = new PublicKey(tokenMint)
    const [tokenmetaPubkey] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID,
    )
    const tokenContent = await Metadata.fromAccountAddress(this.connection, tokenmetaPubkey)

    const token = tokenContent.pretty()
    //  console.log('TOKEN', token)

    return token
  }
}
