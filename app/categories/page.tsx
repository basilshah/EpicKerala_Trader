import Link from "next/link";
import Image from "next/image";
import prismaClient from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // Fetch All Main Categories with Subcategories
  const categories = await prismaClient.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    include: {
      children: {
        orderBy: { name: 'asc' }
      },
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
           <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Explore All Categories</h1>
           <p className="text-lg text-muted">
             Browse our comprehensive directory of verified Kerala exporters across major industries.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={category.id} className="overflow-hidden hover:shadow-lg hover:border-secondary/50 transition-all group">
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
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                    {category._count.products} Products
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-3">{category.name}</h3>
                
                {category.children.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Sub-categories:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.children.slice(0, 6).map((child) => (
                        <Link key={child.id} href={`/category/${child.slug}`}>
                          <span className="text-xs bg-slate-100 hover:bg-secondary hover:text-white text-foreground px-2 py-1 rounded transition-colors">
                            {child.name}
                          </span>
                        </Link>
                      ))}
                      {category.children.length > 6 && (
                        <span className="text-xs text-muted">
                          +{category.children.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <Link href={`/category/${category.slug}`}>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white flex items-center justify-center gap-2 group">
                    Browse Products
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
