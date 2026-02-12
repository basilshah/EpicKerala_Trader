-- AlterTable
ALTER TABLE "RFQ" ADD COLUMN     "importerId" TEXT;

-- CreateTable
CREATE TABLE "Importer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE',
    "companyName" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Importer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Importer_email_key" ON "Importer"("email");

-- AddForeignKey
ALTER TABLE "RFQ" ADD CONSTRAINT "RFQ_importerId_fkey" FOREIGN KEY ("importerId") REFERENCES "Importer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
