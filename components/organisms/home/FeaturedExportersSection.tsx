import Link from 'next/link';
import { ArrowRight, Factory } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SellerCard } from '@/components/cards/SellerCard';
import { SectionHeader } from '@/components/molecules/SectionHeader';

interface SellerItem {
  id: string;
  companyName: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  isVerified: boolean;
  type: string;
  offersOEM?: boolean;
  _count?: {
    products: number;
  };
}

interface FeaturedExportersSectionProps {
  sellers: SellerItem[];
}

export function FeaturedExportersSection({ sellers }: FeaturedExportersSectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container-custom">
        <SectionHeader
          title="Featured Exporters"
          description="Connect with top-rated government verified manufacturers."
          action={
            sellers.length > 0 ? (
              <Link href="/sellers">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-secondary group font-medium text-base"
                >
                  View All Exporters{' '}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : null
          }
        />

        {sellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Factory className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No exporters registered yet</p>
            <p className="text-sm text-muted-foreground">Manufacturers will be joining soon</p>
          </div>
        )}
      </div>
    </section>
  );
}
