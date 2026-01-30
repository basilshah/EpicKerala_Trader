import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { CategorySubLink } from '@/components/CategorySubLink';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { ProductCountBadge, SubcategoryBadge } from '@/components/ui/Badge';
import { Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Array<{ id: string; name: string; slug: string }>;
  _count?: { products: number };
}

interface CategoryCardProps {
  category: Category;
  imageUrl?: string;
  maxSubcategories?: number;
}

export function CategoryCard({ category, imageUrl, maxSubcategories = 3 }: CategoryCardProps) {
  const subcategories = category.children || [];
  const productCount = category._count?.products || 0;

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer border border-slate-200">
        {/* Category Image */}
        <div className="relative h-[200px] bg-slate-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <Package className="w-20 h-20 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <ProductCountBadge count={productCount} />
          </div>
        </div>

        <CardContent className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-primary mb-3">{category.name}</h3>

          <div className="flex-grow mb-4">
            <div className="min-h-[90px]">
              {subcategories.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Sub-categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {subcategories.slice(0, maxSubcategories).map((child) => (
                      <CategorySubLink key={child.id} href={`/category/${child.slug}`}>
                        <SubcategoryBadge interactive>{child.name}</SubcategoryBadge>
                      </CategorySubLink>
                    ))}
                    {subcategories.length > maxSubcategories && (
                      <SubcategoryBadge>
                        +{subcategories.length - maxSubcategories} more
                      </SubcategoryBadge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <ViewDetailsLink text="Browse Products" />
        </CardContent>
      </Card>
    </Link>
  );
}
