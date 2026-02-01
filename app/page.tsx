import Link from 'next/link';
import Image from 'next/image';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CategorySubLink } from '@/components/CategorySubLink';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { SearchBar } from '@/components/SearchBar';
import { auth } from '@/lib/auth';
import {
  ProductCountBadge,
  SubcategoryBadge,
  VerifiedBadge,
  Badge,
  CategoryBadge,
} from '@/components/ui/Badge';
import {
  Search,
  Building2,
  Package,
  Grid3x3,
  Globe,
  BadgeCheck,
  MapPin,
  Award,
  ArrowRight,
  ChevronRight,
  Factory,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();

  // Fetch data
  const categories = await prismaClient.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    include: {
      children: {
        orderBy: { name: 'asc' },
      },
      _count: {
        select: { products: true },
      },
    },
    take: 6,
  });

  const featuredSellers = await prismaClient.seller.findMany({
    where: { isVerified: true },
    take: 3,
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  const featuredProducts = await prismaClient.product.findMany({
    where: {
      isPublic: true,
      verificationStatus: 'APPROVED',
    },
    take: 3,
    include: {
      seller: true,
      category: true,
    },
  });

  return (
    <div className="bg-background">
      {/* SECTION 2: HERO */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <Image
          src="/hero_bg.png"
          alt="International Seaport"
          fill
          className="object-contain object-center"
          quality={100}
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />

        <div className="relative container-custom h-full flex items-center">
          <div className="max-w-2xl">
            <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-3">
              Official Trade Portal
            </p>
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Discover Kerala's Finest Export Products
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect directly with verified manufacturers and exporters. Quality assured, globally
              delivered.
            </p>

            {/* Search Bar */}
            <SearchBar />
            <p className="text-sm text-white/70">
              Popular:{' '}
              <span className="text-white font-medium">
                Spices, Seafood, Coir Products, Handloom Textiles
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATISTICS BAR */}
      <section className="w-full bg-primary py-8">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">750+</p>
              <p className="text-sm text-white/80">Verified Exporters</p>
              <div className="mt-2 h-0.5 w-16 bg-secondary mx-auto" />
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Package className="w-10 h-10 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">3500+</p>
              <p className="text-sm text-white/80">Products Listed</p>
              <div className="mt-2 h-0.5 w-16 bg-secondary mx-auto" />
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Grid3x3 className="w-10 h-10 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">25+</p>
              <p className="text-sm text-white/80">Export Categories</p>
              <div className="mt-2 h-0.5 w-16 bg-secondary mx-auto" />
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">65+</p>
              <p className="text-sm text-white/80">Countries Served</p>
              <div className="mt-2 h-0.5 w-16 bg-secondary mx-auto" />
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 4: BROWSE CATEGORIES */}
      <section className="py-20 bg-background">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-primary mb-3">Browse Export Categories</h2>
            <p className="text-lg text-muted">
              Explore Kerala's diverse range of premium export products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category: any, index: number) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer border border-slate-200">
                  {/* Category Image */}
                  <div className="relative h-[200px] bg-slate-100 overflow-hidden">
                    {index === 0 ? (
                      <Image
                        src="/cat_spices_1769688487625.png"
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : index === 2 ? (
                      <Image
                        src="/cat_handicrafts_1769688509505.png"
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <Package className="w-20 h-20 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <ProductCountBadge count={category._count.products} />
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-primary mb-3">{category.name}</h3>

                    <div className="flex-grow mb-4">
                      <div className="min-h-[90px]">
                        {category.children.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-foreground mb-2">
                              Sub-categories:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {category.children.slice(0, 3).map((child: any) => (
                                <CategorySubLink key={child.id} href={`/category/${child.slug}`}>
                                  <SubcategoryBadge interactive>{child.name}</SubcategoryBadge>
                                </CategorySubLink>
                              ))}
                              {category.children.length > 3 && (
                                <SubcategoryBadge>
                                  +{category.children.length - 3} more
                                </SubcategoryBadge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <ViewDetailsLink text="Browse Products" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 5: FEATURED PRODUCTS */}
      <section className="w-full bg-white py-20">
        <Container>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Featured Products</h2>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
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
                <Link key={product.id} href={`/product/${product.slug}`}>
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
                      {product.seller.isVerified && (
                        <div className="absolute top-3 right-3">
                          <VerifiedBadge className="shadow-md" />
                        </div>
                      )}
                      {product.seller.offersOEM && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="primary" className="shadow-md">
                            OEM Available
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <CategoryBadge>{product.category.name}</CategoryBadge>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-lg text-primary mb-3 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Seller Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          {product.seller.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-secondary" />
                          )}
                          <span className="text-sm font-medium text-foreground">
                            {product.seller.companyName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                          <Factory className="w-3.5 h-3.5" />
                          <span className="text-xs">{product.seller.type}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {product.seller.city}, {product.seller.state}
                          </span>
                        </div>
                      </div>

                      {/* Product Details */}
                      {(product.hsCode || product.moq) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.hsCode && (
                            <span className="text-xs text-muted border border-slate-200 px-2 py-1 rounded">
                              HS: {product.hsCode}
                            </span>
                          )}
                          {product.moq && (
                            <span className="text-xs text-muted border border-slate-200 px-2 py-1 rounded">
                              MOQ: {product.moq}
                            </span>
                          )}
                        </div>
                      )}

                      <ViewDetailsLink />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Mobile View All Link */}
          <Link
            href="/products"
            className="mt-8 md:hidden flex items-center justify-center gap-2 text-secondary font-medium"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>

      {/* SECTION 6: VERIFIED EXPORTERS */}
      <section className="py-20 bg-background">
        <Container>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Verified Exporters</h2>
              <p className="text-muted">Trusted manufacturers and trading companies</p>
            </div>
            <Link
              href="/sellers"
              className="text-secondary font-semibold hover:underline flex items-center gap-1"
            >
              View All Exporters <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {featuredSellers.map((seller) => (
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
                    <div className="flex items-center gap-1 text-muted mb-4">
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
                        <p className="text-xs text-muted">Products</p>
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
                      <p className="text-sm text-muted line-clamp-2 mb-4">{seller.description}</p>
                    )}

                    <ViewDetailsLink text="View Profile" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 7: CTA BANNER - Hidden for signed-in sellers */}
      {!session?.user && (
        <section className="relative w-full h-[300px] overflow-hidden">
          <div className="absolute inset-0 bg-primary/90" />
          <Container className="relative h-full flex flex-col items-center justify-center text-center text-white">
            <h2 className="text-4xl font-bold mb-3">Ready to Source Premium Kerala Products?</h2>
            <p className="text-lg text-white/90 mb-8">
              Register as a buyer to connect directly with verified exporters
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                Register Now
              </Button>
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-primary shadow-sm hover:shadow-md"
              >
                Contact Us
              </Button>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
