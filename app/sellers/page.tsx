import Link from 'next/link';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { VerifiedBadge } from '@/components/ui/Badge';
import { BadgeCheck, MapPin, Package, Factory, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellersPage() {
  const sellers = await prismaClient.seller.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: {
              verificationStatus: 'APPROVED',
            },
          },
        },
      },
    },
    orderBy: { isVerified: 'desc' },
  }).catch(() => []);

  return (
    <div className="bg-background min-h-screen pb-20">

      <Container className="mt-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3">Kerala Exporters</h1>
          <p className="text-lg text-muted-foreground">
            {sellers.length} verified manufacturers and exporters
          </p>
        </div>

        {/* Sellers Grid */}
        {sellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <Link key={seller.id} href={`/seller/${seller.slug}`}>
                <Card className="group hover:shadow-lg transition-all h-full border border-slate-200">
                  {/* Header Section */}
                  <div className="relative h-32 bg-gradient-to-br from-primary to-secondary p-6">
                    <div className="absolute top-4 right-4">
                      {seller.isVerified && <VerifiedBadge />}
                    </div>
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
                    <div className="flex items-center gap-1 text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {seller.city}, {seller.state}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-2xl font-bold text-secondary">
                          {seller._count.products}
                        </p>
                        <p className="text-xs text-muted-foreground">Products</p>
                      </div>
                      {seller.offersOEM && (
                        <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          <Award className="w-3 h-3" />
                          OEM Available
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {seller.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{seller.description}</p>
                    )}

                    <ViewDetailsLink text="View Profile" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Factory className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No exporters found</p>
          </div>
        )}
      </Container>
    </div>
  );
}
