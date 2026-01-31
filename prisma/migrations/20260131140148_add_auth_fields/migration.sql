/*
  Warnings:

  - Added the required column `password` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Seller` table without a default value. This is not possible if the table is not empty.

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
    "username" TEXT NOT NULL,
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
-- Set default username and password for existing sellers (they'll need to reset)
INSERT INTO "new_Seller" ("address", "certifications", "city", "companyName", "contactPersonDesignation", "contactPersonName", "country", "createdAt", "description", "email", "establishedYear", "id", "isVerified", "logoUrl", "offersOEM", "phone", "pincode", "slug", "state", "type", "updatedAt", "website", "username", "password") 
SELECT "address", "certifications", "city", "companyName", "contactPersonDesignation", "contactPersonName", "country", "createdAt", "description", "email", "establishedYear", "id", "isVerified", "logoUrl", "offersOEM", "phone", "pincode", "slug", "state", "type", "updatedAt", "website", 
  LOWER(REPLACE("slug", '-', '_')),  -- Generate username from slug
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'  -- Default password: 'password123' (hashed)
FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
CREATE UNIQUE INDEX "Seller_slug_key" ON "Seller"("slug");
CREATE UNIQUE INDEX "Seller_username_key" ON "Seller"("username");
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
