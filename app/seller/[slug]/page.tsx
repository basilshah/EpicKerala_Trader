import Link from 'next/link';
import { notFound } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/cards/ProductCard';
import { VerifiedBadge, Badge, CertificationBadge } from '@/components/ui/Badge';
import {
  BadgeCheck,
  Factory,
  MapPin,
  Globe,
  Award,
  CheckCircle,
  FileText,
  Download,
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { canViewContactDetails } from '@/lib/access-control';
import { Lock } from 'lucide-react';

interface SellerPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SellerPage({ params }: SellerPageProps) {
  const { slug } = await params;

  // Check authentication for contact details
  const session = await auth();
  const canSeeContact = canViewContactDetails(session);

  // Fetch Seller with Products
  const seller = await prismaClient.seller.findUnique({
    where: { slug },
    include: {
      products: {
        where: {
          verificationStatus: 'APPROVED',
        },
        include: {
          category: true,
        },
      },
    },
  });

  if (!seller) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Seller Header / Banner */}
      <div className="bg-white border-b border-border">
        <Container className="py-10 md:py-14">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo Placeholder */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
              <Factory className="w-10 h-10 md:w-14 md:h-14 text-slate-400" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-primary">{seller.companyName}</h1>
                {seller.isVerified && <VerifiedBadge />}
                <Badge variant="default" className="capitalize">
                  {seller.type}
                </Badge>
              </div>

              <p className="text-slate-700 text-lg mb-6 max-w-3xl font-medium">{seller.description}</p>

              <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  {seller.city}, {seller.state}, {seller.country}
                </div>
                {seller.establishedYear && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Est. {seller.establishedYear}
                  </div>
                )}
                {seller.offersOEM && (
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-secondary" />
                    OEM / Private Label Available
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3">
              {canSeeContact ? (
                <>
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-white"
                  >
                    Contact Supplier
                  </Button>
                  {seller.website && (
                    <a
                      href={seller.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto"
                    >
                      <Button variant="outline" className="w-full gap-2 border-slate-200">
                        Visit Website <Globe className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </>
              ) : (
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
                  <Lock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">Sign in to view contact details</p>
                  <Link href={`/signin?callbackUrl=/seller/${slug}`}>
                    <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Business Type
                  </span>
                  <span className="font-medium capitalize">{seller.type}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Location
                  </span>
                  <span>
                    {seller.city}, {seller.state}
                  </span>
                </div>
                {seller.certifications && (
                  <div>
                    <span className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                      Certifications
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {seller.certifications.split(',').map((cert, i) => (
                        <CertificationBadge key={i}>{cert.trim()}</CertificationBadge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Catalogs Section */}
            {seller.catalogs && JSON.parse(seller.catalogs).length > 0 && (
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Company Catalogs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {JSON.parse(seller.catalogs).map((catalog: any, index: number) => (
                    <a
                      key={index}
                      href={catalog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-600">
                          {catalog.filename}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content: Products */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">
                Products ({seller.products.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seller.products.map((product) => (
                <ProductCard key={product.id} product={product} showSeller={false} />
              ))}
            </div>

            {seller.products.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed text-slate-700 font-medium">
                No listed products found.
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
