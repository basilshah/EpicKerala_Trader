import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Factory } from 'lucide-react';
import { SellerCard } from '@/components/cards/SellerCard';

export const dynamic = 'force-dynamic';

export default async function SellersPage() {
  const sellers = await prismaClient.seller
    .findMany({
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
    })
    .catch(() => []);

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="mt-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">Kerala Exporters</h1>
          <p className="text-base sm:text-lg text-slate-600">
            {sellers.length} verified manufacturers and exporters
          </p>
        </div>

        {/* Sellers Grid */}
        {sellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Factory className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-600">No exporters found</p>
          </div>
        )}
      </Container>
    </div>
  );
}
