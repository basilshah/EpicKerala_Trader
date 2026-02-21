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
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 border-t border-slate-100">
      <div className="container-custom">
        <SectionHeader
          title="Featured Products"
          description="Premium quality exports directly from manufacturers."
          action={
            products.length > 0 ? (
              <Link href="/products">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No products available yet</p>
            <p className="text-sm text-muted-foreground">Exporters will be adding products soon</p>
          </div>
        )}
      </div>
    </section>
  );
}
