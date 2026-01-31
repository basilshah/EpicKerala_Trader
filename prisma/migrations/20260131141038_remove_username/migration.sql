/*
  Warnings:

  - You are about to drop the column `username` on the `Seller` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "logoUrl" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "pincode" TEXT,
    "establishedYear" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "certifications" TEXT,
    "offersOEM" BOOLEAN NOT NULL DEFAULT false,
    "contactPersonName" TEXT,
    "contactPersonDesignation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Seller" ("address", "certifications", "city", "companyName", "contactPersonDesignation", "contactPersonName", "country", "createdAt", "description", "email", "establishedYear", "id", "isVerified", "logoUrl", "offersOEM", "password", "phone", "pincode", "slug", "state", "type", "updatedAt", "website") SELECT "address", "certifications", "city", "companyName", "contactPersonDesignation", "contactPersonName", "country", "createdAt", "description", "email", "establishedYear", "id", "isVerified", "logoUrl", "offersOEM", "password", "phone", "pincode", "slug", "state", "type", "updatedAt", "website" FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
CREATE UNIQUE INDEX "Seller_slug_key" ON "Seller"("slug");
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
