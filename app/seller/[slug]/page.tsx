import Link from "next/link";
import { notFound } from "next/navigation";
import prismaClient from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BadgeCheck, Factory, MapPin, Globe, Mail, Award, CheckCircle } from "lucide-react";

interface SellerPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SellerPage({ params }: SellerPageProps) {
  const { slug } = await params;

  // Fetch Seller with Products
  const seller = await prismaClient.seller.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
           category: true
        }
      }
    }
  });

  if (!seller) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Seller Header / Banner */}
      <div className="bg-white border-b border-border">
        <Container className="py-10 md:py-14">
           <div className="flex flex-col md:flex-row gap-8 items-start">
             {/* Logo Placeholder */}
             <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
               <Factory className="w-10 h-10 md:w-14 md:h-14 text-slate-400" />
             </div>
             
             <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                   <h1 className="text-3xl font-bold text-primary">{seller.companyName}</h1>
                   {seller.isVerified && (
                      <span className="bg-green-100 text-[#166534] text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-green-200">
                         <BadgeCheck className="w-3 h-3" /> VERIFIED EXPORTER
                      </span>
                   )}
                   <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">
                      {seller.type}
                   </span>
                </div>
                
                <p className="text-muted-foreground text-lg mb-6 max-w-3xl">
                   {seller.description}
                </p>
                
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-slate-600">
                   <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      {seller.city}, {seller.state}, {seller.country}
                   </div>
                   {seller.establishedYear && (
                       <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          Est. {seller.establishedYear}
                       </div>
                   )}
                   {seller.offersOEM && (
                       <div className="flex items-center gap-2">
                          <Factory className="w-4 h-4 text-secondary" />
                          OEM / Private Label Available
                       </div>
                   )}
                </div>
             </div>
             
             <div className="w-full md:w-auto flex flex-col gap-3">
                <Button size="lg" className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-white shadow-sm">
                   Contact Supplier
                </Button>
                {seller.website && (
                    <a href={seller.website} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                        <Button variant="outline" className="w-full gap-2">
                           Visit Website <Globe className="w-4 h-4" />
                        </Button>
                    </a>
                )}
             </div>
           </div>
        </Container>
      </div>

      <Container className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Sidebar Info */}
           <div className="space-y-6">
              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Business Details</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div>
                       <span className="block text-xs font-medium text-muted-foreground uppercase mb-1">Business Type</span>
                       <span className="font-medium">{seller.type}</span>
                    </div>
                    <div>
                       <span className="block text-xs font-medium text-muted-foreground uppercase mb-1">Location</span>
                       <span>{seller.city}, {seller.state}</span>
                    </div>
                    {seller.certifications && (
                        <div>
                           <span className="block text-xs font-medium text-muted-foreground uppercase mb-1">Certifications</span>
                           <div className="flex flex-wrap gap-2 mt-2">
                              {seller.certifications.split(',').map((cert, i) => (
                                 <div key={i} className="flex items-center gap-1 text-xs bg-amber-50 text-amber-900 px-2 py-1 rounded border border-amber-100">
                                    <Award className="w-3 h-3" /> {cert.trim()}
                                 </div>
                              ))}
                           </div>
                        </div>
                    )}
                 </CardContent>
              </Card>
           </div>
           
           {/* Main Content: Products */}
           <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-primary">Products ({seller.products.length})</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {seller.products.map(product => (
                    <Link key={product.id} href={`/product/${product.slug}`} className="group">
                        <Card className="h-full hover:shadow-md transition-all group-hover:border-primary/20">
                            <div className="h-48 bg-slate-100 flex items-center justify-center rounded-t-lg relative overflow-hidden">
                                <Factory className="w-12 h-12 text-slate-300" />
                            </div>
                            <CardContent className="p-4">
                                <span className="text-xs text-secondary font-medium mb-1 block">
                                   {product.category.name}
                                </span>
                                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                                   {product.name}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-slate-100">
                                    <span>MOQ: {product.moq || "N/A"}</span>
                                    <span className="text-primary font-medium group-hover:underline">View Details</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                 ))}
              </div>
              
              {seller.products.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed text-muted-foreground">
                      No listed products found.
                  </div>
              )}
           </div>
        </div>
      </Container>
    </div>
  );
}
