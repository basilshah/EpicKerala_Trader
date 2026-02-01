import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  const seller = await prismaClient.seller.findUnique({
    where: { email: session.user.email },
    include: {
      products: {
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!seller) {
    redirect('/signin');
  }

  return (
    <Container>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Products</h1>
          <p className="text-slate-600">Manage your product listings</p>
        </div>
        <Link href="/dashboard/products/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {seller.products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No products yet</h3>
          <p className="text-slate-600 mb-6">Start adding your products to reach global buyers</p>
          <Link href="/dashboard/products/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {seller.products.map((product) => {
            // Parse product images
            let firstImage = null;
            if (product.images) {
              try {
                const images = JSON.parse(product.images);
                if (Array.isArray(images) && images.length > 0) {
                  firstImage = images[0].url;
                }
              } catch (e) {
                console.error('Failed to parse product images:', e);
              }
            }

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                      {product.isPublic ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                      {product.description || ''}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {product.category.name}
                      </span>
                      {product.moq && <span>MOQ: {product.moq}</span>}
                      {product.hsCode && <span>HS Code: {product.hsCode}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/product/${product.slug}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
