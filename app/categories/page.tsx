import Link from 'next/link';
import Image from 'next/image';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { CategorySubLink } from '@/components/CategorySubLink';
import { ViewDetailsLink } from '@/components/ui/ViewDetailsLink';
import { ProductCountBadge, SubcategoryBadge } from '@/components/ui/Badge';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // Fetch All Main Categories with Subcategories
  const categories = await prismaClient.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    include: {
      children: {
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      },
      _count: {
        select: { products: true },
      },
    },
  });

  // Calculate total products including subcategories
  const categoriesWithTotalCount = categories.map((category: any) => {
    const mainCategoryProducts = category._count.products;
    const subCategoryProducts = category.children.reduce(
      (sum: number, child: any) => sum + (child._count?.products || 0),
      0
    );
    return {
      ...category,
      totalProducts: mainCategoryProducts + subCategoryProducts,
    };
  });

  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 px-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-3 md:mb-4">
            Explore All Categories
          </h1>
          <p className="text-base md:text-lg text-muted">
            Browse our comprehensive directory of verified Kerala exporters across major industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {categoriesWithTotalCount.map((category: any, index: number) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer border border-slate-200">
                {/* Category Image */}
                <div className="relative h-[180px] md:h-[200px] bg-slate-100 overflow-hidden">
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
                      <Package className="w-16 md:w-20 h-16 md:h-20 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 md:top-4 right-3 md:right-4">
                    <ProductCountBadge count={category.totalProducts} />
                  </div>
                </div>

                <CardContent className="p-4 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 md:mb-3">
                    {category.name}
                  </h3>

                  <div className="flex-grow mb-3 md:mb-4">
                    <div className="min-h-[70px] md:min-h-[90px]">
                      {category.children.length > 0 && (
                        <div className="mb-3 md:mb-4">
                          <h4 className="text-xs md:text-sm font-semibold text-foreground mb-2">
                            Sub-categories:
                          </h4>
                          <div className="flex flex-wrap gap-1.5 md:gap-2">
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

                  <div className="border-t border-slate-100 pt-3 md:pt-4">
                    <span className="text-secondary font-semibold text-xs md:text-sm group-hover:underline flex items-center justify-center gap-2">
                      Browse Products
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
