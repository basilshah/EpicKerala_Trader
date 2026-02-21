import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { VerifiedBadge, Badge } from '@/components/ui/Badge';
import { Factory, MapPin, Award } from 'lucide-react';

interface Seller {
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

interface SellerCardProps {
  seller: Seller;
  allowVerticalScroll?: boolean;
}

export function SellerCard({ seller, allowVerticalScroll = false }: SellerCardProps) {
  const productCount = seller._count?.products || 0;

  return (
    <Link
      href={`/seller/${seller.slug}`}
      style={allowVerticalScroll ? ({ touchAction: 'pan-y' } as React.CSSProperties) : undefined}
    >
      <Card className="group hover:shadow-lg transition-all h-full border border-slate-200">
        {/* Header Section */}
        <div className="relative h-32 bg-gradient-to-br from-primary to-secondary p-6">
          <div className="absolute top-4 right-4">{seller.isVerified && <VerifiedBadge />}</div>
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <Factory className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <CardContent className="pt-12 p-6">
          {/* Company Name */}
          <h3 className="font-bold text-xl text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
            {seller.companyName}
          </h3>

          {/* Location */}
          {seller.city && seller.state && (
            <div className="flex items-center gap-1 text-slate-700 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                {seller.city}, {seller.state}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-2xl font-bold text-secondary">{productCount}</p>
              <p className="text-xs text-slate-700 font-bold">Products</p>
            </div>
            {seller.offersOEM && (
              <Badge
                variant="primary"
                className="bg-primary/10 text-primary border-0"
                icon={<Award className="w-3 h-3" />}
              >
                OEM Available
              </Badge>
            )}
          </div>

          {/* Description */}
          {seller.description && (
            <p className="text-sm text-slate-700 line-clamp-2 mb-4 font-medium">
              {seller.description}
            </p>
          )}

          <ViewDetailsLink text="View Profile" />
        </CardContent>
      </Card>
    </Link>
  );
}
