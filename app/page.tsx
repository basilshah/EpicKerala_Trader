import { auth } from '@/lib/auth';
import { getHomePageData } from '@/lib/home/getHomePageData';
import { HeroSection } from '@/components/organisms/home/HeroSection';
import { FeaturedCategoriesSection } from '@/components/organisms/home/FeaturedCategoriesSection';
import { FeaturedProductsSection } from '@/components/organisms/home/FeaturedProductsSection';
import { FeaturedExportersSection } from '@/components/organisms/home/FeaturedExportersSection';
import { CTASection } from '@/components/organisms/home/CTASection';

export const revalidate = 300; // 5 minutes ISR

export default async function HomePage() {
  const [session, { categories, verifiedSellers, featuredProducts }] = await Promise.all([
    auth(),
    getHomePageData(),
  ]);

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
