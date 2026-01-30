import Link from 'next/link';
import Image from 'next/image';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { Package, Factory, Building2, Search } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  let categories: any[] = [];
  let products: any[] = [];
  let sellers: any[] = [];

  if (query) {
    // Search categories
    categories = await prismaClient.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      take: 6,
    });

    // Search products
    products = await prismaClient.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        seller: true,
      },
      take: 9,
    });

    // Search sellers
    sellers = await prismaClient.seller.findMany({
      where: {
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      take: 6,
    });
  }

  const totalResults = categories.length + products.length + sellers.length;

  return (
    <div className="bg-background min-h-screen">
      {/* Search Header */}
      <section className="w-full bg-primary py-12">
        <Container>
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Search Results</h1>
          <SearchBar initialQuery={query} />
        </Container>
      </section>

      <Container className="py-12">
        {!query ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-muted">
              Enter a search term to find products, categories, or exporters
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Results Found</h2>
            <p className="text-muted">
              No results found for "<span className="font-semibold">{query}</span>"
            </p>
            <p className="text-sm text-muted mt-2">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <p className="text-muted">
                Found <span className="font-bold text-foreground">{totalResults} results</span> for
                "<span className="font-semibold text-foreground">{query}</span>"
              </p>
            </div>

            {/* Categories Results */}
            {categories.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Categories ({categories.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border border-slate-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-primary">{category.name}</h3>
                            <span className="bg-white text-foreground text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
                              {category._count.products} Products
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-sm text-muted line-clamp-2 mb-4">
                              {category.description}
                            </p>
                          )}
                          <ViewDetailsLink text="View Category" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Products Results */}
            {products.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Products ({products.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border border-slate-200">
                        <div className="relative h-[200px] bg-slate-100">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                              <Package className="w-16 h-16 text-slate-300" />
                            </div>
                          )}
                          {product.seller?.isVerified && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-white text-secondary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                ✓ Verified
                              </span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted mb-4">
                            <Factory className="w-3.5 h-3.5" />
                            <span className="line-clamp-1">{product.seller?.companyName}</span>
                            {product.seller?.businessType && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{product.seller.businessType}</span>
                              </>
                            )}
                          </div>
                          <ViewDetailsLink text="View Details" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Sellers/Exporters Results */}
            {sellers.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Exporters ({sellers.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sellers.map((seller) => (
                    <Link key={seller.id} href={`/seller/${seller.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border border-slate-200">
                        <div className="relative h-[120px] bg-gradient-to-br from-primary to-primary/80">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Factory className="w-12 h-12 text-white/30" />
                          </div>
                          {seller.isVerified && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-white text-secondary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                ✓ Verified
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                              {seller._count.products} Products
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                            {seller.companyName}
                          </h3>
                          {seller.description && (
                            <p className="text-sm text-muted mb-3 line-clamp-2">
                              {seller.description}
                            </p>
                          )}
                          {seller.businessType && (
                            <div className="flex items-center gap-2 text-xs text-muted mb-4">
                              <Factory className="w-3.5 h-3.5" />
                              <span className="capitalize">{seller.businessType}</span>
                            </div>
                          )}
                          <ViewDetailsLink text="View Profile" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
