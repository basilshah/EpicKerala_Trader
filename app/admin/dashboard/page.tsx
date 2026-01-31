import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Package, CheckCircle, Clock, XCircle, Users } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await adminAuth();

  // Check if admin is authenticated
  if (!session?.user) {
    redirect('/admin/login');
  }

  // Get statistics
  const [pendingProducts, approvedProducts, rejectedProducts, totalSellers] = await Promise.all([
    prismaClient.product.count({ where: { verificationStatus: 'PENDING' } }),
    prismaClient.product.count({ where: { verificationStatus: 'APPROVED' } }),
    prismaClient.product.count({ where: { verificationStatus: 'REJECTED' } }),
    prismaClient.seller.count(),
  ]);

  const stats = [
    {
      label: 'Pending Products',
      value: pendingProducts,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-700',
      href: '/admin/products?status=PENDING',
    },
    {
      label: 'Approved Products',
      value: approvedProducts,
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-700',
      href: '/admin/products?status=APPROVED',
    },
    {
      label: 'Rejected Products',
      value: rejectedProducts,
      icon: XCircle,
      color: 'bg-red-100 text-red-700',
      href: '/admin/products?status=REJECTED',
    },
    {
      label: 'Total Sellers',
      value: totalSellers,
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      href: '/admin/sellers',
    },
  ];

  // Get recent pending products
  const recentPendingProducts = await prismaClient.product.findMany({
    where: { verificationStatus: 'PENDING' },
    include: {
      seller: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">Welcome, {session.user.name}</p>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Pending Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pending Products</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPendingProducts.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No pending products</p>
            ) : (
              <div className="space-y-3">
                {recentPendingProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="block p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {product.seller.companyName} • {product.category.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Submitted {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                        Pending
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
