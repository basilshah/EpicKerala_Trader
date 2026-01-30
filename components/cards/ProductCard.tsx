import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { VerifiedBadge } from '@/components/ui/Badge';
import { Package, Factory } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  moq?: string | null;
  category?: {
    name: string;
  };
  seller?: {
    companyName: string;
    isVerified: boolean;
    type?: string;
  };
}

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
}

export function ProductCard({ product, showSeller = true }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border border-slate-200">
        <div className="relative h-[200px] bg-slate-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <Package className="w-16 h-16 text-slate-300" />
            </div>
          )}
          {product.seller?.isVerified && (
            <div className="absolute top-4 left-4">
              <VerifiedBadge className="shadow-sm" />
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted mb-3 line-clamp-2">{product.description}</p>
          )}
          {showSeller && product.seller && (
            <div className="flex items-center gap-2 text-xs text-muted mb-4">
              <Factory className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{product.seller.companyName}</span>
              {product.seller.type && (
                <>
                  <span>•</span>
                  <span className="capitalize">{product.seller.type}</span>
                </>
              )}
            </div>
          )}
          {product.category && (
            <span className="text-xs text-secondary font-semibold mb-2 block">
              {product.category.name}
            </span>
          )}
          {product.moq && <p className="text-sm text-muted mb-4">MOQ: {product.moq}</p>}
          <ViewDetailsLink text="View Details" />
        </CardContent>
      </Card>
    </Link>
  );
}
