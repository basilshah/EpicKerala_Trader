/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN "contactPersonDesignation" TEXT;
ALTER TABLE "Seller" ADD COLUMN "contactPersonName" TEXT;
ALTER TABLE "Seller" ADD COLUMN "pincode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");
