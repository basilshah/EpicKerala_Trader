import Link from 'next/link';
import Image from 'next/image';
import prismaClient from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { ProductCard } from '@/components/cards/ProductCard';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { Badge } from '@/components/ui/Badge';
import { auth } from '@/lib/auth';
import { Search, MapPin, ArrowRight, CheckCircle2, Globe, Package, Factory } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure cn is imported if used

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();

  // 1. Fetch Categories (with error handling)
  const categories = await prismaClient.category
    .findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
      take: 4,
      include: {
        _count: { select: { products: true } },
        children: { take: 3 },
      },
    })
    .catch(() => []);

  // 2. Fetch Featured Sellers (with error handling)
  const verifiedSellers = await prismaClient.seller
    .findMany({
      where: { isVerified: true },
      take: 3,
      include: { _count: { select: { products: true } } },
    })
    .catch(() => []);

  // 3. Fetch Featured Products (with error handling)
  const featuredProducts = await prismaClient.product
    .findMany({
      where: {
        isPublic: true,
        verificationStatus: 'APPROVED',
      },
      take: 4,
      include: {
        seller: true,
        category: true,
      },
    })
    .catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-secondary/30">
      {/* 2. HERO SECTION */}
      <section className="w-full py-20 lg:py-28 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700 fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase">
                <Globe className="w-3 h-3" />
                Official Trade Portal of Kerala
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.1]">
                Connecting Global Buyers to{' '}
                <span className="text-secondary relative">
                  Kerala’s Finest
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-secondary/10 -z-10 bg-opacity-50 rounded-sm"></span>
                </span>{' '}
                Export Products
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Source premium quality spices, coir, textiles, and more directly from verified
                manufacturers. Experience seamless B2B trade with government-backed assurance.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 pl-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 max-w-lg flex items-center gap-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
              <Search className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search products (e.g., Cardamom...)"
                  className="border-0 shadow-none focus-visible:ring-0 text-base h-11 bg-transparent px-2 placeholder:text-muted-foreground/50"
                />
              </div>
              <Button
                size="lg"
                className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-semibold h-11"
              >
                Search
              </Button>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Popular:</span>
              <div className="flex flex-wrap gap-2">
                {['Spices', 'Coir', 'Textiles', 'Handicrafts'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag.toLowerCase()}`}
                    className="hover:text-secondary underline decoration-dotted underline-offset-4 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[400px] lg:h-[550px] w-full flex items-center justify-center animate-in slide-in-from-right duration-700 fade-in lg:justify-end">
            <div className="absolute inset-0 bg-secondary/5 rounded-full blur-[100px] scale-75 transform translate-x-12 translate-y-12"></div>
            <Image
              src="/hero_export_kerala_illustration.png"
              alt="Kerala Export Illustration"
              width={700}
              height={700}
              className="relative z-10 object-contain drop-shadow-xl hover:scale-[1.02] transition-transform duration-700"
              priority
            />
          </div>
        </div>

        {/* Curved Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] md:h-[100px] fill-slate-50/50"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 4. CATEGORIES GRID */}
      <section className="py-20 lg:py-24 bg-slate-50/50 border-t border-border/40">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Browse Export Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover a wide range of premium products from across Kerala's diverse industries.
            </p>
            <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full opacity-60"></div>
          </div>

          {categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {categories.map((category, index) => {
                  // Logic to match images from categories page
                  let imageUrl = undefined;
                  if (index === 0) imageUrl = '/cat_spices_1769688487625.png';
                  else if (index === 2) imageUrl = '/cat_handicrafts_1769688509505.png';

                  return (
                    <div key={category.id} className="h-full">
                      <CategoryCard category={category} imageUrl={imageUrl} />
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-12">
                <Link href="/categories">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/20 text-primary hover:bg-primary/5 font-semibold px-8"
                  >
                    View All Categories
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No categories available yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for exciting product categories</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container-custom">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
                Featured Products
              </h2>
              <p className="text-lg text-muted-foreground">
                Premium quality exports directly from manufacturers.
              </p>
            </div>
            {featuredProducts.length > 0 && (
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-secondary group font-medium text-base"
                >
                  View All Products{' '}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>

          {/* Products Grid */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No products available yet</p>
              <p className="text-sm text-muted-foreground">Exporters will be adding products soon</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. FEATURED EXPORTERS */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
                Featured Exporters
              </h2>
              <p className="text-lg text-muted-foreground">
                Connect with top-rated government verified manufacturers.
              </p>
            </div>
            {verifiedSellers.length > 0 && (
              <Link href="/sellers">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-secondary group font-medium text-base"
                >
                  View All Exporters{' '}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>

          {verifiedSellers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {verifiedSellers.map((seller) => (
              <Card
                key={seller.id}
                className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden rounded-xl"
              >
                <CardContent className="p-0">
                  <div className="p-6 md:p-8 flex flex-col items-center text-center border-b border-border/50 bg-gradient-to-b from-white to-background/50">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Factory className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-1 line-clamp-1">
                      {seller.companyName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {seller.city}, {seller.state}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {seller.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 gap-1 pl-1 pr-2"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </Badge>
                      )}
                      {seller.offersOEM && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-50 text-blue-700"
                        >
                          OEM
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50/50 flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                      <span className="text-primary font-bold text-sm block">
                        {seller._count.products}
                      </span>{' '}
                      Products
                    </div>
                    <Link href={`/seller/${seller.slug}`}>
                      <Button
                        size="sm"
                        className="bg-white hover:bg-primary hover:text-white text-primary border border-border shadow-sm transition-colors text-xs h-8 px-4 font-semibold"
                      >
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Factory className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No exporters registered yet</p>
              <p className="text-sm text-muted-foreground">Manufacturers will be joining soon</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. CTA SECTION */}
      {/* Exclude for logged in users if needed, or keep for all */}
      {!session?.user && (
        <section className="py-24 bg-[url('/pattern-bg.png')] bg-no-repeat bg-cover bg-center bg-fixed relative">
          <div className="absolute inset-0 bg-primary/95" /> {/* Fallback if no image */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/80 via-primary to-primary-foreground/5 opacity-50" />
          <div className="container-custom relative z-10 text-center max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Ready to Source Premium Kerala Products?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
              Join thousands of international buyers connecting with verified exporters on the
              official trade portal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register/importer">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg border-white/30 text-white hover:bg-white hover:text-primary font-bold rounded-full bg-white/5 backdrop-blur-sm hover:-translate-y-1 transition-all"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------
