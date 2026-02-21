import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Package, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    _count?: {
      products: number;
    };
    children?: {
      id: string;
      name: string;
      slug: string;
    }[];
    // Fallback for categories page structure which might have totalProducts at top level
    totalProducts?: number;
  };
  // Optional image URL prop for flexibility, though Home design uses placeholder logic currently
  imageUrl?: string;
}

export function CategoryCard({ category, imageUrl }: CategoryCardProps) {
  const productCount = category.totalProducts ?? category._count?.products ?? 0;
  const subcategories = category.children || [];

  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/60 hover:border-secondary/30 hover:shadow-xl transition-all duration-300 rounded-xl bg-white group-hover:-translate-y-1">
        <div className="h-40 sm:h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:scale-110 transition-transform duration-700" />
              <Package className="w-12 h-12 text-primary/20 absolute z-0" />
            </>
          )}

          <Badge
            variant="outline"
            className="absolute top-3 right-3 z-10 backdrop-blur-sm shadow-md border-0 text-xs bg-white/90 text-foreground font-semibold"
          >
            {productCount} Products
          </Badge>
        </div>
        <CardContent className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 mb-4">
            {category.name}
          </h3>
          <ul className="space-y-2 mb-6 flex-1">
            {subcategories.slice(0, 3).map((child) => (
              <li
                key={child.id}
                className="flex items-center text-sm text-slate-700 font-medium before:content-['•'] before:mr-2 before:text-secondary"
              >
                {child.name}
              </li>
            ))}
            {subcategories.length > 3 && (
              <li className="flex items-center text-sm text-slate-700 font-medium before:content-['•'] before:mr-2 before:text-secondary">
                +{subcategories.length - 3} more
              </li>
            )}
            {subcategories.length === 0 && (
              <li className="text-sm text-slate-700 font-medium italic">Explore products inside</li>
            )}
          </ul>
          <div className="flex items-center text-sm font-semibold text-secondary group-hover:translate-x-1 transition-transform mt-auto">
            Explore Category <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
