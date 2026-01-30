import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Search } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { ProductCard } from '@/components/cards/ProductCard';
import { SellerCard } from '@/components/cards/SellerCard';

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
        name: { contains: query },
      },
      include: {
        _count: {
          select: { products: true },
        },
        children: true,
      },
      take: 6,
    });

    // Search products
    products = await prismaClient.product.findMany({
      where: {
        OR: [{ name: { contains: query } }, { description: { contains: query } }],
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
        OR: [{ companyName: { contains: query } }, { description: { contains: query } }],
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
              No results found for &quot;<span className="font-semibold">{query}</span>&quot;
            </p>
            <p className="text-sm text-muted mt-2">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <p className="text-muted">
                Found <span className="font-bold text-foreground">{totalResults} results</span> for
                &quot;<span className="font-semibold text-foreground">{query}</span>&quot;
              </p>
            </div>

            {/* Categories Results */}
            {categories.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Categories ({categories.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </section>
            )}

            {/* Products Results */}
            {products.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Products ({products.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Sellers/Exporters Results */}
            {sellers.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Exporters ({sellers.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sellers.map((seller) => (
                    <SellerCard key={seller.id} seller={seller} />
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
