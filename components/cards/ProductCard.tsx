import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { VerifiedBadge, Badge, CategoryBadge } from '@/components/ui/Badge';
import { Factory, MapPin, BadgeCheck, Globe, Calendar } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images?: string | null;
  moq?: string | null;
  hsCode?: string | null;
  origin?: string | null;
  shelfLife?: string | null;
  category?: {
    name: string;
  };
  seller?: {
    companyName: string;
    isVerified: boolean;
    type?: string;
    offersOEM?: boolean;
    city?: string | null;
    state?: string | null;
  };
}

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
}

export function ProductCard({ product, showSeller = true }: ProductCardProps) {
  // Parse product images
  let firstImage = null;
  if (product.images) {
    try {
      const images = JSON.parse(product.images);
      if (Array.isArray(images) && images.length > 0) {
        firstImage = images[0].url;
      }
    } catch (e) {
      console.error('Failed to parse product images:', e);
    }
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group hover:shadow-lg transition-all h-full border border-slate-200">
        {/* Product Image */}
        <div className="h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Factory className="w-16 h-16 text-slate-300" />
          )}
          {product.seller?.isVerified && (
            <div className="absolute top-3 right-3">
              <VerifiedBadge className="shadow-md" />
            </div>
          )}
          {product.seller?.offersOEM && (
            <div className="absolute top-3 left-3">
              <Badge variant="primary" className="shadow-md">
                OEM Available
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Category Badge */}
          <div className="mb-2 min-h-[28px] flex items-start">
            {product.category && <CategoryBadge>{product.category.name}</CategoryBadge>}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{product.name}</h3>

          {/* Product Description */}
          {product.description && (
            <p className="text-sm text-slate-700 mb-3 line-clamp-2 font-medium leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Seller Info */}
          {showSeller && product.seller && (
            <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {product.seller.isVerified && <BadgeCheck className="w-4 h-4 text-secondary" />}
                <span className="text-sm font-semibold text-slate-900">
                  {product.seller.companyName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Factory className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{product.seller.type}</span>
              </div>
              {product.seller.city && product.seller.state && (
                <div className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {product.seller.city}, {product.seller.state}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Product Specifications Grid */}
          <div className="space-y-2 mb-4">
            {product.origin && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="text-slate-600 font-medium">Origin: </span>
                  <span className="text-slate-900 font-semibold">{product.origin}</span>
                </div>
              </div>
            )}

            {product.moq && (
              <div className="flex items-start gap-2 text-sm">
                <Factory className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-600 font-medium">MOQ: </span>
                  <span className="text-slate-900 font-semibold">{product.moq}</span>
                </div>
              </div>
            )}

            {product.shelfLife && (
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-600 font-medium">Shelf Life: </span>
                  <span className="text-slate-900 font-semibold">{product.shelfLife}</span>
                </div>
              </div>
            )}

            {product.hsCode && (
              <div className="flex items-start gap-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-600 font-medium">HS Code: </span>
                  <span className="text-slate-900 font-semibold font-mono">{product.hsCode}</span>
                </div>
              </div>
            )}
          </div>

          <ViewDetailsLink />
        </CardContent>
      </Card>
    </Link>
  );
}
