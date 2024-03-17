/*
  Warnings:

  - A unique constraint covering the columns `[omiseChargeId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "omiseChargeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_omiseChargeId_key" ON "Order"("omiseChargeId");
