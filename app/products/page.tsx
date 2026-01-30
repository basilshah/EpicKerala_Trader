import Link from 'next/link';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { Package, BadgeCheck, MapPin, Factory } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prismaClient.product.findMany({
    where: { isPublic: true },
    include: {
      seller: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border py-4">
        <Container>
          <div className="text-sm text-muted">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">All Products</span>
          </div>
        </Container>
      </div>

      <Container className="mt-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3">All Products</h1>
          <p className="text-lg text-muted">
            {products.length} products available from verified exporters
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card className="group hover:shadow-lg transition-all h-full border border-slate-200">
                  {/* Product Image */}
                  <div className="h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    <Factory className="w-16 h-16 text-slate-300" />
                    {product.seller.isVerified && (
                      <span className="absolute top-3 right-3 bg-white text-secondary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                        <BadgeCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                    {product.seller.offersOEM && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        OEM Available
                      </span>
                    )}
                  </div>

                  <CardContent className="p-5">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {product.category.name}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-lg text-primary mb-3 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Seller Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        {product.seller.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-secondary" />
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {product.seller.companyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Factory className="w-3.5 h-3.5" />
                        <span className="text-xs">{product.seller.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {product.seller.city}, {product.seller.state}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    {(product.hsCode || product.moq) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.hsCode && (
                          <span className="text-xs text-muted border border-slate-200 px-2 py-1 rounded">
                            HS: {product.hsCode}
                          </span>
                        )}
                        {product.moq && (
                          <span className="text-xs text-muted border border-slate-200 px-2 py-1 rounded">
                            MOQ: {product.moq}
                          </span>
                        )}
                      </div>
                    )}

                    <ViewDetailsLink />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-muted">No products found</p>
          </div>
        )}
      </Container>
    </div>
  );
}
