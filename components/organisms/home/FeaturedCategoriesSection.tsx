import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { HomeCategoryCircle } from '@/components/cards/HomeCategoryCircle';

interface CategoryItem {
  id: string;
  imageUrl?: string | null;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: Array<{ id: string; name: string; slug: string }>;
}

interface FeaturedCategoriesSectionProps {
  categories: CategoryItem[];
}

export function FeaturedCategoriesSection({ categories }: FeaturedCategoriesSectionProps) {
  return (
    <section className="py-4 sm:py-8 lg:py-10 bg-slate-50/50 border-t border-border/40">
      <div className="container-custom">
        <h2 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">Category</h2>

        {categories.length > 0 ? (
          <div
            className="flex items-start gap-5 sm:gap-8 overflow-x-auto overflow-y-hidden pb-2 -mx-3 sm:-mx-4 md:-mx-8 px-3 sm:px-4 md:px-8 overscroll-x-contain overscroll-y-auto [touch-action:pan-x_pan-y] [scrollbar-width:none] sm:[scrollbar-width:thin] sm:[scrollbar-color:theme(colors.slate.300)_transparent] [&::-webkit-scrollbar]:hidden sm:[&::-webkit-scrollbar]:block sm:[&::-webkit-scrollbar]:h-1.5 sm:[&::-webkit-scrollbar-track]:bg-transparent sm:[&::-webkit-scrollbar-thumb]:rounded-full sm:[&::-webkit-scrollbar-thumb]:bg-slate-200"
            style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {categories.map((category, i) => (
              <HomeCategoryCircle
                key={category.id}
                category={category}
                imageUrl={category.imageUrl || undefined}
                priority={i < 3}
              />
            ))}
            <Link
              href="/categories"
              className="group flex flex-col items-center justify-center shrink-0 mt-0 min-w-[4rem] sm:min-w-0 touch-manipulation active:opacity-80"
              aria-label="Browse more categories"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary/5 group-active:scale-95 transition-all duration-200">
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-secondary transition-colors" />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium text-slate-600 group-hover:text-secondary transition-colors">
                Browse more
              </span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No categories available yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
