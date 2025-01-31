/*
  Warnings:

  - Made the column `name` on table `Wallet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "network" TEXT NOT NULL DEFAULT 'solana',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");
