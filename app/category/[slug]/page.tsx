import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, BadgeCheck, MapPin, Factory } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Fetch category with children and products
  const category = await prismaClient.category.findUnique({
    where: { slug },
    include: {
      children: {
        orderBy: { name: 'asc' },
      },
      parent: {
        include: {
          children: {
            orderBy: { name: 'asc' },
          },
        },
      },
      products: {
        where: { isPublic: true },
        include: {
          seller: true,
          category: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // If this category has children, also fetch products from children
  let allProducts = [...category.products];
  if (category.children.length > 0) {
    const childProducts = await prismaClient.product.findMany({
      where: {
        categoryId: {
          in: category.children.map((c: { id: string }) => c.id),
        },
        isPublic: true,
      },
      include: {
        seller: true,
        category: true,
      },
    });
    allProducts = [...allProducts, ...childProducts];
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border py-4">
        <Container>
          <div className="text-sm text-muted">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-primary">
              Categories
            </Link>
            {category.parent && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/category/${category.parent.slug}`} className="hover:text-primary">
                  {category.parent.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">{category.name}</span>
          </div>
        </Container>
      </div>

      <Container className="mt-12">
        {/* Category Header with Image */}
        <Card className="mb-10 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Text Content */}
            <div className="p-8 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-primary mb-4">{category.name}</h1>
              <p className="text-base text-muted mb-6 leading-relaxed">
                Explore Kerala's premium {category.name.toLowerCase()} exports including{' '}
                {category.children.length > 0
                  ? category.children
                      .slice(0, 3)
                      .map((c: any) => c.name.toLowerCase())
                      .join(', ')
                  : 'quality products'}
                , and more from verified manufacturers.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-3xl font-bold text-secondary">{allProducts.length}</p>
                  <p className="text-sm text-muted">Products</p>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div>
                  <p className="text-3xl font-bold text-secondary">
                    {new Set(allProducts.map((p) => p.sellerId)).size}
                  </p>
                  <p className="text-sm text-muted">Verified Exporters</p>
                </div>
              </div>
            </div>

            {/* Right: Category Image */}
            <div className="relative h-[300px] bg-gradient-to-br from-primary/10 to-secondary/10">
              {category.slug === 'agriculture-food' || category.slug === 'spices' ? (
                <Image
                  src="/cat_spices_1769688487625.png"
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : category.slug === 'handicrafts' || category.slug === 'textiles' ? (
                <Image
                  src="/cat_handicrafts_1769688509505.png"
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-32 h-32 text-slate-300" />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Sub-categories Filter */}
        {category.children.length > 0 && (
          <Card className="mb-10 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Browse Sub-categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {category.children.map((child: { id: string; slug: string; name: string }) => (
                <Link key={child.id} href={`/category/${child.slug}`}>
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white transition-all"
                  >
                    {child.name}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Parent Category with Siblings (if this is a sub-category) */}
        {category.parent && (
          <Card className="mb-10 p-6 bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Other {category.parent.name} Sub-categories
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href={`/category/${category.parent.slug}`}>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-all"
                >
                  View All {category.parent.name}
                </Button>
              </Link>
              {category.parent.children?.map(
                (sibling: { id: string; slug: string; name: string }) => (
                  <Link key={sibling.id} href={`/category/${sibling.slug}`}>
                    <Button
                      variant={sibling.slug === category.slug ? 'default' : 'outline'}
                      className={
                        sibling.slug === category.slug
                          ? 'bg-secondary hover:bg-secondary/90 text-white font-semibold shadow-md'
                          : 'border-secondary text-secondary hover:bg-secondary hover:text-white transition-all'
                      }
                    >
                      {sibling.name}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </Card>
        )}

        {/* Products Grid */}
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card className="group hover:shadow-lg transition-all h-full border border-slate-200">
                  {/* Product Image */}
                  <div className="h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    <Factory className="w-16 h-16 text-slate-300" />
                    {product.seller.isVerified && (
                      <span className="absolute top-3 right-3 bg-white text-secondary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                        <BadgeCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                    {product.seller.offersOEM && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        OEM Available
                      </span>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                        {product.category.name}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-muted mb-3 line-clamp-2">{product.description}</p>

                    <div className="pt-3 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                        {product.seller.companyName}
                        {product.seller.isVerified && (
                          <BadgeCheck className="w-3 h-3 text-secondary" />
                        )}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1 mb-1">
                        <Factory className="w-3 h-3" /> {product.seller.type}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" /> {product.seller.city}, {product.seller.state}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">MOQ: {product.moq || 'Negotiable'}</span>
                        {product.hsCode && (
                          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                            HS: {product.hsCode}
                          </span>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4 text-secondary border-secondary hover:bg-secondary hover:text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Products Found</h3>
            <p className="text-muted mb-6">
              There are currently no products listed in this category.
            </p>
            <Link href="/categories">
              <Button variant="outline">Browse Other Categories</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
