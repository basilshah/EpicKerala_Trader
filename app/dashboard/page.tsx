import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Package, ShoppingBag, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  const seller = await prismaClient.seller.findUnique({
    where: { email: session.user.email },
    include: {
      products: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!seller) {
    redirect('/signin');
  }

  const totalProducts = await prismaClient.product.count({
    where: { sellerId: seller.id },
  });

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Listings',
      value: seller.products.filter((p) => p.isPublic).length,
      icon: ShoppingBag,
      color: 'bg-emerald-500',
    },
    {
      label: 'Profile Views',
      value: '---',
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      label: 'RFQ Received',
      value: '---',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {seller.companyName}
        </h1>
        <p className="text-slate-600">
          Manage your products, profile, and track your export business
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-md p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/products/add">
            <Button className="w-full" variant="default">
              <Package className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button className="w-full" variant="outline">
              Edit Profile
            </Button>
          </Link>
          <Link href={`/seller/${seller.slug}`}>
            <Button className="w-full" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Public Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Products</h2>
          <Link href="/dashboard/products">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {seller.products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">No products yet</p>
            <Link href="/dashboard/products/add">
              <Button>Add Your First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
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
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    {firstImage && (
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-slate-900">{product.name}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2 min-h-[2.5rem]">
                        {product.description || ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.isPublic ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
