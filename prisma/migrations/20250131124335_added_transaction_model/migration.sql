-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "tokenAmountIn" TEXT NOT NULL,
    "tokenAmountOut" TEXT NOT NULL,
    "tokenInSymbol" TEXT NOT NULL,
    "tokenOutSymbol" TEXT NOT NULL,
    "tokenInMint" TEXT NOT NULL,
    "tokenOutMint" TEXT NOT NULL,
    "solPrice" TEXT NOT NULL,
    "swapped_token_price" DOUBLE PRECISION NOT NULL,
    "swapped_token_mc" DOUBLE PRECISION,
    "current_holding_percentage" TEXT NOT NULL,
    "current_holding_price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "balanceChange" DOUBLE PRECISION NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isLargeBuy" BOOLEAN NOT NULL DEFAULT false,
    "isMultiBuy" BOOLEAN NOT NULL DEFAULT false,
    "isMultiSell" BOOLEAN NOT NULL DEFAULT false,
    "isWhaleActivity" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uniqueWallets" INTEGER,
    "totalSolAmount" DOUBLE PRECISION,
    "recentTxs" JSONB,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_signature_key" ON "Transaction"("signature");

-- CreateIndex
CREATE INDEX "Transaction_owner_idx" ON "Transaction"("owner");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
