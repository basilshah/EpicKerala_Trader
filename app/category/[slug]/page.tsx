import Link from "next/link";
import { notFound } from "next/navigation";
import prismaClient from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, BadgeCheck, MapPin, Factory } from "lucide-react";

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
        orderBy: { name: 'asc' }
      },
      parent: true,
      products: {
        where: { isPublic: true },
        include: {
          seller: true,
          category: true
        }
      }
    }
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
          in: category.children.map((c: { id: string }) => c.id)
        },
        isPublic: true
      },
      include: {
        seller: true,
        category: true
      }
    });
    allProducts = [...allProducts, ...childProducts];
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border py-4">
        <Container>
          <div className="text-sm text-muted">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-primary">Categories</Link>
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
        {/* Category Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3">{category.name}</h1>
          <p className="text-lg text-muted">
            {allProducts.length} products available from verified exporters
          </p>
        </div>

        {/* Sub-categories Filter */}
        {category.children.length > 0 && (
          <div className="mb-10 pb-8 border-b border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Filter by Sub-category</h2>
            <div className="flex flex-wrap gap-3">
              {category.children.map((child: { id: string; slug: string; name: string }) => (
                <Link key={child.id} href={`/category/${child.slug}`}>
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                    {child.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map(product => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card className="group hover:shadow-lg hover:border-secondary/50 transition-all h-full">
                  {/* Product Image */}
                  <div className="h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    <Factory className="w-16 h-16 text-slate-300" />
                    {product.seller.isVerified && (
                      <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                    {product.seller.offersOEM && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                        OEM
                      </span>
                    )}
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="mb-2">
                      <span className="text-xs text-secondary font-medium">
                        {product.category.name}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-muted mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="pt-3 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                        {product.seller.companyName}
                        {product.seller.isVerified && <BadgeCheck className="w-3 h-3 text-secondary" />}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" /> {product.seller.city}, {product.seller.state}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">MOQ: {product.moq || "Negotiable"}</span>
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
