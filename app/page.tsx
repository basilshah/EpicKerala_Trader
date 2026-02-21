import prismaClient from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { HeroSection } from '@/components/organisms/home/HeroSection';
import { FeaturedCategoriesSection } from '@/components/organisms/home/FeaturedCategoriesSection';
import { FeaturedProductsSection } from '@/components/organisms/home/FeaturedProductsSection';
import { FeaturedExportersSection } from '@/components/organisms/home/FeaturedExportersSection';
import { CTASection } from '@/components/organisms/home/CTASection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();

  // 1. Fetch all main categories (with error handling)
  const categories = await prismaClient.category
    .findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
        children: { take: 3 },
      },
    })
    .catch(() => []);

  // 2. Fetch Featured Sellers (with error handling)
  const verifiedSellers = await prismaClient.seller
    .findMany({
      where: { isVerified: true },
      take: 3,
      include: { _count: { select: { products: true } } },
    })
    .catch(() => []);

  // 3. Fetch Featured Products (with error handling)
  const featuredProducts = await prismaClient.product
    .findMany({
      where: {
        isPublic: true,
        verificationStatus: 'APPROVED',
      },
      take: 4,
      include: {
        seller: true,
        category: true,
      },
    })
    .catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-secondary/30">
      <HeroSection />
      <FeaturedCategoriesSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <FeaturedExportersSection sellers={verifiedSellers} />
      {!session?.user ? <CTASection /> : null}
    </div>
  );
}
