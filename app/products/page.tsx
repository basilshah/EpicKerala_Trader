import Link from 'next/link';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/cards/ProductCard';
import { Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prismaClient.product
    .findMany({
      where: {
        isPublic: true,
        verificationStatus: 'APPROVED',
      },
      include: {
        seller: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    .catch(() => []);

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="mt-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3">All Products</h1>
          <p className="text-lg text-slate-600">
            {products.length} products available from verified exporters
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-600">No products found</p>
          </div>
        )}
      </Container>
    </div>
  );
}
