/*
  Warnings:

  - You are about to drop the column `createdAt` on the `StockTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `StockTransaction` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `StockTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StockTransaction" DROP CONSTRAINT "StockTransaction_supplierId_fkey";

-- AlterTable
ALTER TABLE "public"."StockTransaction" DROP COLUMN "createdAt",
DROP COLUMN "note",
ADD COLUMN     "purchasePrice" DOUBLE PRECISION,
ADD COLUMN     "storeId" INTEGER NOT NULL,
ALTER COLUMN "supplierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."StockTransaction" ADD CONSTRAINT "StockTransaction_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockTransaction" ADD CONSTRAINT "StockTransaction_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
