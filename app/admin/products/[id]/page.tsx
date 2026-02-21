import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ProductVerificationForm from '@/components/admin/ProductVerificationForm';
import { Factory, FileText, Download } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface AdminProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductPage({ params }: AdminProductPageProps) {
  const session = await adminAuth();
  const { id } = await params;

  // Check if admin is authenticated
  if (!session?.user) {
    redirect('/admin/login');
  }

  // Fetch product with all details
  const product = await prismaClient.product.findUnique({
    where: { id },
    include: {
      seller: true,
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Parse images and catalogs
  let productImages: Array<{ url: string; filename: string }> = [];
  let productCatalogs: Array<{ url: string; filename: string; type: string }> = [];

  if (product.images) {
    try {
      const images = JSON.parse(product.images);
      if (Array.isArray(images)) {
        productImages = images;
      }
    } catch (e) {
      console.error('Failed to parse product images:', e);
    }
  }

  if (product.catalogs) {
    try {
      const catalogs = JSON.parse(product.catalogs);
      if (Array.isArray(catalogs)) {
        productCatalogs = catalogs;
      }
    } catch (e) {
      console.error('Failed to parse product catalogs:', e);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
            Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <Container className="py-6">
          <Link
            href="/admin/dashboard"
            className="text-emerald-600 hover:underline text-sm mb-2 block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Product Verification</h1>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Edit Product
              </Link>
              {getStatusBadge(product.verificationStatus)}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Images */}
                {productImages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Product Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {productImages.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Product Name</h3>
                  <p className="text-slate-700 text-lg">{product.name}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-700">
                    {product.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Category</h3>
                    <p className="text-slate-700">{product.category.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">HS Code</h3>
                    <p className="text-slate-700">{product.hsCode || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">MOQ</h3>
                    <p className="text-slate-700">{product.moq || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Origin</h3>
                    <p className="text-slate-700">{product.origin}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Shelf Life</h3>
                    <p className="text-slate-700">{product.shelfLife || 'N/A'}</p>
                  </div>
                </div>

                {/* Product Catalogs */}
                {productCatalogs.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Product Catalogs</h3>
                    <div className="space-y-2">
                      {productCatalogs.map((catalog, index) => (
                        <a
                          key={index}
                          href={catalog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium">{catalog.filename}</span>
                          </div>
                          <Download className="w-4 h-4 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Company Name
                  </h4>
                  <p className="font-semibold text-slate-900">{product.seller.companyName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Email
                  </h4>
                  <p className="text-slate-900 font-medium">{product.seller.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Location
                  </h4>
                  <p className="text-slate-900 font-medium">
                    {product.seller.city}, {product.seller.state}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Type</h4>
                  <p className="text-slate-900 font-medium">{product.seller.type}</p>
                </div>
                <Link
                  href={`/seller/${product.seller.slug}`}
                  target="_blank"
                  className="block text-center py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  View Seller Profile
                </Link>
              </CardContent>
            </Card>

            {/* Verification Form */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Action</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductVerificationForm
                  productId={product.id}
                  currentStatus={product.verificationStatus}
                  rejectionReason={product.rejectionReason}
                />
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-700 font-semibold">Created:</span>
                  <p className="font-medium text-slate-900">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-700 font-semibold">Last Updated:</span>
                  <p className="font-medium text-slate-900">
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
                {product.verifiedAt && (
                  <div>
                    <span className="text-slate-700 font-semibold">Verified:</span>
                    <p className="font-medium text-slate-900">
                      {new Date(product.verifiedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
