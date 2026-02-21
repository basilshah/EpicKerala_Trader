import Link from 'next/link';
import { notFound } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import RFQForm from '@/components/product/RFQForm';
import { VerifiedBadge } from '@/components/ui/Badge';
import { BadgeCheck, Factory, Box, Tag, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductImageCarousel } from '@/components/product/ProductImageCarousel';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch Product with Seller and Category
  const product = await prismaClient.product.findUnique({
    where: { slug },
    include: {
      seller: true,
      category: true,
    },
  });

  // Only show approved products to public
  if (!product || product.verificationStatus !== 'APPROVED') {
    notFound();
  }

  // Parse product images
  let productImages: Array<{ url: string; filename: string }> = [];
  if (product.images) {
    try {
      const images = JSON.parse(product.images);
      if (Array.isArray(images)) {
        productImages = images;
      }
    } catch (e) {
      console.error('Failed to parse product images:', e);
    }
  }

  // Parse product catalogs
  let productCatalogs: Array<{ url: string; filename: string; type: string }> = [];
  if (product.catalogs) {
    try {
      const catalogs = JSON.parse(product.catalogs);
      if (Array.isArray(catalogs)) {
        productCatalogs = catalogs;
      }
    } catch (e) {
      console.error('Failed to parse product catalogs:', e);
    }
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Product Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Product Main Card */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-4 md:p-6 relative">
                <ProductImageCarousel
                  images={productImages}
                  productName={product.name}
                  fallbackIcon={<Factory className="w-20 h-20 text-primary/20" />}
                />
                {product.seller.isVerified && (
                  <div className="absolute top-8 right-8 z-10">
                    <VerifiedBadge className="shadow-md" />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="text-sm font-medium text-secondary hover:underline"
                  >
                    {product.category.name}
                  </Link>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{product.name}</h1>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-2">Description</h3>
                  <p className="text-foreground leading-relaxed">{product.description}</p>
                </div>

                <div className="bg-accent rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5 text-secondary" /> Product Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-600 uppercase">
                        HS Code
                      </span>
                      <span className="font-mono text-foreground">{product.hsCode || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-600 uppercase">
                        Minimum Order Quantity (MOQ)
                      </span>
                      <span className="font-medium text-foreground">
                        {product.moq || 'Negotiable'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-600 uppercase">
                        Shelf Life
                      </span>
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-500" /> {product.shelfLife || 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-600 uppercase">
                        Origin
                      </span>
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <Globe className="w-3 h-3 text-slate-500" /> {product.origin}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Catalogs */}
                {productCatalogs.length > 0 && (
                  <div className="bg-accent rounded-lg p-6 border border-border mt-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Product Catalogs & Specifications
                    </h3>
                    <div className="space-y-2">
                      {productCatalogs.map((catalog, index) => (
                        <a
                          key={index}
                          href={catalog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white hover:bg-accent border border-border rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/10 rounded">
                              <Factory className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-foreground group-hover:text-secondary block">
                                {catalog.filename}
                              </span>
                              <span className="text-xs text-slate-500">
                                {catalog.type === 'application/pdf' ? 'PDF Document' : 'Image File'}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            Download
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: RFQ & Seller Info
           */}
          <div className="space-y-6">
            {/* RFQ Form */}
            <RFQForm productId={product.id} />

            {/* Seller Card */}
            <Card>
              <CardHeader className="pb-3 border-b border-border bg-accent/50">
                <CardTitle className="text-base flex items-center gap-2">Sold by</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-primary mb-1">
                    <Link href={`/seller/${product.seller.slug}`} className="hover:underline">
                      {product.seller.companyName}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="uppercase font-semibold bg-accent px-1.5 py-0.5 rounded">
                      {product.seller.type}
                    </span>
                    <span>
                      {product.seller.city}, {product.seller.state}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-600 mb-4 line-clamp-3">
                  {product.seller.description}
                </div>

                <Link href={`/seller/${product.seller.slug}`}>
                  <Button variant="outline" className="w-full">
                    View Seller Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
