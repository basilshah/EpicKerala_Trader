import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import SellerDashboardClient from '@/components/dashboard/SellerDashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  const seller = await prismaClient.seller.findUnique({
    where: { email: session.user.email },
  });

  if (!seller) {
    redirect('/signin');
  }

  // Get all products for this seller
  const allProducts = await prismaClient.product.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: 'desc' },
  });

  // Get all RFQs for this seller's products
  const allRFQs = await prismaClient.rFQ.findMany({
    where: {
      product: {
        sellerId: seller.id,
      },
    },
    include: {
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalProducts = allProducts.length;
  const activeListings = allProducts.filter((p) => p.isPublic).length;
  const totalRFQs = allRFQs.length;

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

      <SellerDashboardClient
        totalProducts={totalProducts}
        activeListings={activeListings}
        totalRFQs={totalRFQs}
        allProducts={allProducts}
        allRFQs={allRFQs}
        sellerSlug={seller.slug}
      />
    </Container>
  );
}
