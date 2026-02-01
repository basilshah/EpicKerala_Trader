import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboard() {
  const session = await adminAuth();

  // Check if admin is authenticated
  if (!session?.user) {
    redirect('/admin/login');
  }

  // Get statistics
  const [pendingProducts, approvedProducts, rejectedProducts, totalSellers, totalRFQs] =
    await Promise.all([
      prismaClient.product.count({ where: { verificationStatus: 'PENDING' } }),
      prismaClient.product.count({ where: { verificationStatus: 'APPROVED' } }),
      prismaClient.product.count({ where: { verificationStatus: 'REJECTED' } }),
      prismaClient.seller.count(),
      prismaClient.rFQ.count(),
    ]);

  // Get all pending products
  const allPendingProducts = await prismaClient.product.findMany({
    where: { verificationStatus: 'PENDING' },
    include: {
      seller: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get all approved products
  const allApprovedProducts = await prismaClient.product.findMany({
    where: { verificationStatus: 'APPROVED' },
    include: {
      seller: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get all RFQs
  const allRFQs = await prismaClient.rFQ.findMany({
    include: {
      product: {
        include: {
          seller: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get all sellers
  const allSellers = await prismaClient.seller.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Format dates to avoid hydration issues
  const formattedPendingProducts = allPendingProducts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }),
  }));

  const formattedApprovedProducts = allApprovedProducts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }),
  }));

  const formattedRFQs = allRFQs.map((r) => ({
    ...r,
    createdAt: r.createdAt.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }),
  }));

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
        <AdminDashboardClient
          pendingProducts={pendingProducts}
          approvedProducts={approvedProducts}
          totalSellers={totalSellers}
          totalRFQs={totalRFQs}
          allPendingProducts={formattedPendingProducts}
          allApprovedProducts={formattedApprovedProducts}
          allRFQs={formattedRFQs}
          allSellers={allSellers}
        />
      </Container>
    </div>
  );
}
