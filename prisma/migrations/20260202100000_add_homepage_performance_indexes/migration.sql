-- CreateIndex
CREATE INDEX IF NOT EXISTS "Category_parentId_name_idx" ON "Category"("parentId", "name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Seller_isVerified_idx" ON "Seller"("isVerified");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_isPublic_verificationStatus_idx" ON "Product"("isPublic", "verificationStatus");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
