import Link from 'next/link';
import { notFound } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import RFQForm from '@/components/product/RFQForm';
import { VerifiedBadge } from '@/components/ui/Badge';
import { BadgeCheck, Factory, Box, Tag, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  if (!product) {
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

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border py-4">
        <Container>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-primary">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium truncate">{product.name}</span>
          </div>
        </Container>
      </div>

      <Container className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Product Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Main Card */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="h-64 md:h-80 bg-slate-100 flex items-center justify-center relative">
                {/* Image Display */}
                {productImages.length > 0 ? (
                  <img
                    src={productImages[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Factory className="w-20 h-20 text-slate-300" />
                )}
                {product.seller.isVerified && (
                  <div className="absolute top-4 right-4">
                    <VerifiedBadge className="shadow-md" />
                  </div>
                )}
              </div>

              {/* Additional Images Gallery */}
              {productImages.length > 1 && (
                <div className="p-4 border-b border-slate-200">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {productImages.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-20 object-cover rounded border-2 border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors"
                      />
                    ))}
                  </div>
                </div>
              )}

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

                <div className="prose max-w-none text-slate-600 mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-2">Description</h3>
                  <p>{product.description}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5 text-secondary" /> Product Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        HS Code
                      </span>
                      <span className="font-mono text-slate-900">{product.hsCode || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Minimum Order Quantity (MOQ)
                      </span>
                      <span className="font-medium text-slate-900">
                        {product.moq || 'Negotiable'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Shelf Life
                      </span>
                      <span className="font-medium text-slate-900 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-400" /> {product.shelfLife || 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Origin
                      </span>
                      <span className="font-medium text-slate-900 flex items-center gap-2">
                        <Globe className="w-3 h-3 text-slate-400" /> {product.origin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: RFQ & Seller Info */}
          <div className="space-y-6">
            {/* RFQ Form */}
            <RFQForm productId={product.id} />

            {/* Seller Card */}
            <Card>
              <CardHeader className="pb-3 border-b border-border bg-slate-50/50">
                <CardTitle className="text-base flex items-center gap-2">Sold by</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-primary mb-1">
                    <Link href={`/seller/${product.seller.slug}`} className="hover:underline">
                      {product.seller.companyName}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                      {product.seller.type}
                    </span>
                    <span>•</span>
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
