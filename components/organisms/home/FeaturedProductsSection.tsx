import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/cards/ProductCard';
import { SectionHeader } from '@/components/molecules/SectionHeader';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images?: string | null;
  moq?: string | null;
  hsCode?: string | null;
  origin?: string;
  shelfLife?: string | null;
  category?: { name: string };
  seller?: {
    companyName: string;
    isVerified: boolean;
    type?: string;
    offersOEM?: boolean;
    city?: string | null;
    state?: string | null;
  };
}

interface FeaturedProductsSectionProps {
  products: ProductItem[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="py-6 sm:py-12 lg:py-24 bg-slate-50 border-t border-slate-100">
      <div className="container-custom">
        <SectionHeader
          title="Featured Products"
          description="Premium quality exports directly from manufacturers."
          action={
            products.length > 0 ? (
              <Link href="/products" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-secondary group font-medium text-base"
                >
                  View All Products{' '}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : null
          }
        />

        {products.length > 0 ? (
          <>
            {/* Mobile: horizontal carousel with View All card */}
            <div
              className="md:hidden flex gap-4 overflow-x-auto overflow-y-hidden pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4 snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-[0_0_85%] sm:flex-[0_0_75%] min-w-0 snap-start">
                  <ProductCard product={product} allowVerticalScroll />
                </div>
              ))}
              <Link
                href="/products"
                className="group flex-shrink-0 w-[85%] sm:w-[75%] max-w-[320px] flex flex-col items-center justify-center min-h-[240px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-secondary hover:bg-secondary/5 active:opacity-90 transition-all touch-manipulation snap-start"
                aria-label="View all products"
              >
                <ArrowRight className="w-8 h-8 text-slate-400 mb-2 group-hover:text-secondary transition-colors" />
                <span className="text-sm font-semibold text-primary">View All Products</span>
              </Link>
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 sm:py-16">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No products available yet</p>
            <p className="text-sm text-muted-foreground">Exporters will be adding products soon</p>
          </div>
        )}
      </div>
    </section>
  );
}
