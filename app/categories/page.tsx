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
import { CategoryCard } from '@/components/cards/CategoryCard';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // Fetch All Main Categories with Subcategories (with error handling)
  const categories = await prismaClient.category
    .findMany({
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
    })
    .catch(() => []);

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
          <p className="text-base md:text-lg text-muted-foreground">
            Browse our comprehensive directory of verified Kerala exporters across major industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {categoriesWithTotalCount.map((category: any, index: number) => {
            // Logic for index-based images from original code
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
      </Container>
    </div>
  );
}
