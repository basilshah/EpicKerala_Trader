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
    <section className="py-6 sm:py-12 lg:py-24 bg-background">
      <div className="container-custom">
        <SectionHeader
          title="Featured Exporters"
          description="Connect with top-rated government verified manufacturers."
          action={
            sellers.length > 0 ? (
              <Link href="/sellers" className="hidden md:block">
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
          <>
            {/* Mobile: horizontal carousel with View All card */}
            <div
              className="md:hidden flex gap-4 overflow-x-auto overflow-y-hidden pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4 snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {sellers.map((seller) => (
                <div key={seller.id} className="flex-[0_0_85%] sm:flex-[0_0_75%] min-w-0 snap-start">
                  <SellerCard seller={seller} allowVerticalScroll />
                </div>
              ))}
              <Link
                href="/sellers"
                className="group flex-shrink-0 w-[85%] sm:w-[75%] max-w-[320px] flex flex-col items-center justify-center min-h-[240px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-secondary hover:bg-secondary/5 active:opacity-90 transition-all touch-manipulation snap-start"
                aria-label="View all exporters"
              >
                <ArrowRight className="w-8 h-8 text-slate-400 mb-2 group-hover:text-secondary transition-colors" />
                <span className="text-sm font-semibold text-primary">View All Exporters</span>
              </Link>
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 sm:py-16">
            <Factory className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No exporters registered yet</p>
            <p className="text-sm text-muted-foreground">Manufacturers will be joining soon</p>
          </div>
        )}
      </div>
    </section>
  );
}
