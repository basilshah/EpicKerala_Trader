import Link from "next/link";
import Image from "next/image";
import prismaClient from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, Building2, Package, Grid3x3, Globe, BadgeCheck, MapPin, Award, ArrowRight, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data
  const categories = await prismaClient.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    },
    take: 6
  });

  const featuredSellers = await prismaClient.seller.findMany({
    where: { isVerified: true },
    take: 3,
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  const featuredProducts = await prismaClient.product.findMany({
    where: { isPublic: true },
    take: 4,
    include: {
      seller: true,
      category: true
    }
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
              Connect directly with verified manufacturers and exporters. Quality assured, globally delivered.
            </p>
            
            {/* Search Bar */}
            <div className="flex max-w-2xl gap-0 mb-6">
              <input 
                type="text" 
                placeholder="Search products, categories, or exporters..."
                className="flex-1 h-12 px-5 rounded-l-md text-foreground bg-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary border-0"
              />
              <button className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-r-md transition-colors flex items-center gap-2">
                Search
              </button>
            </div>
            <p className="text-sm text-white/70">
              Popular: <span className="text-white font-medium">Spices, Seafood, Coir Products, Handloom Textiles</span>
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
            <h2 className="text-4xl font-bold text-primary mb-3">
              Browse Export Categories
            </h2>
            <p className="text-lg text-muted">
              Explore Kerala's diverse range of premium export products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg hover:border-secondary/50 transition-all h-full">
                  <div className="relative h-[250px] bg-slate-200 overflow-hidden">
                    {index === 0 ? (
                      <Image src="/cat_spices_1769688487625.png" alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : index === 2 ? (
                      <Image src="/cat_handicrafts_1769688509505.png" alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">
                      {category.name}
                    </h3>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted mb-4">
                      {category._count.products} Products Available
                    </p>
                    <div className="flex items-center text-secondary font-semibold text-sm group-hover:underline">
                      Explore Category <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Image Container */}
                <div className="relative h-[200px] bg-slate-100 flex items-center justify-center">
                  <Package className="w-12 h-12 text-slate-300" />
                  {/* Verified Badge */}
                  {product.seller.isVerified && (
                    <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-medium px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-1 text-muted">
                    {product.seller.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-secondary" />}
                    <span className="text-xs">{product.seller.companyName}</span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-xs">{product.seller.city}, {product.seller.state}</span>
                  </div>

                  {/* Product Info */}
                  {(product.hsCode || product.moq) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.hsCode && (
                        <span className="text-xs text-muted border border-slate-200 px-2 py-0.5 rounded">
                          HS: {product.hsCode}
                        </span>
                      )}
                      {product.moq && (
                        <span className="text-xs text-muted border border-slate-200 px-2 py-0.5 rounded">
                          MOQ: {product.moq}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Button */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-4 w-full block text-center border border-secondary text-secondary py-2 rounded text-sm font-medium hover:bg-secondary hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
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
            <Link href="/sellers" className="text-secondary font-semibold hover:underline flex items-center gap-1">
              View All Exporters <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {featuredSellers.map((seller) => (
              <Card key={seller.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="bg-primary h-24 flex items-center justify-center relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {seller.companyName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {seller.isVerified && (
                    <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-foreground mb-2">
                    {seller.companyName}
                  </h3>
                  <p className="text-sm text-muted mb-3">{seller.type}</p>
                  <p className="text-sm text-muted mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {seller.city}, {seller.state}
                  </p>
                  <p className="text-sm text-muted mb-4">Member since {seller.establishedYear || '2018'}</p>
                  <p className="text-sm text-foreground mb-3">
                    <span className="font-semibold">Exports:</span> {seller.description || 'Various Products'}
                  </p>
                  
                  {seller.certifications && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {seller.certifications.split(',').slice(0, 3).map((cert, i) => (
                        <span key={i} className="text-xs text-muted border border-slate-200 px-3 py-1 rounded">
                          {cert.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-muted mb-5 pt-4">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" /> {seller._count.products}+ Products
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" /> 12+ Countries
                    </span>
                  </div>
                  
                  <Link href={`/seller/${seller.slug}`} className="mt-auto">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 7: CTA BANNER */}
      <section className="relative w-full h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <Container className="relative h-full flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-4xl font-bold mb-3">
            Ready to Source Premium Kerala Products?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Register as a buyer to connect directly with verified exporters
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
              Register Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
