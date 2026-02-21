'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Package, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { colorPalette } from '@/lib/colors';

interface Product {
  id: string;
  name: string;
  createdAt: string; // Changed to string to avoid hydration issues
  verificationStatus: string;
  seller: {
    companyName: string;
  };
  category: {
    name: string;
  };
}

interface RFQ {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany: string | null;
  buyerCountry: string | null;
  quantity: string | null;
  message: string;
  createdAt: string; // Changed to string to avoid hydration issues
  product: {
    name: string;
    seller: {
      companyName: string;
    };
  };
}

interface Seller {
  id: string;
  companyName: string;
  email: string;
  city: string | null;
  state: string | null;
  isVerified: boolean;
}

interface AdminDashboardClientProps {
  pendingProducts: number;
  approvedProducts: number;
  totalSellers: number;
  totalRFQs: number;
  allPendingProducts: Product[];
  allApprovedProducts: Product[];
  allRFQs: RFQ[];
  allSellers: Seller[];
}

export default function AdminDashboardClient({
  pendingProducts,
  approvedProducts,
  totalSellers,
  totalRFQs,
  allPendingProducts,
  allApprovedProducts,
  allRFQs,
  allSellers,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rfqs' | 'sellers'>(
    'pending'
  );
  const [processingId, setProcessingId] = useState<string | null>(null);

  const updateProductStatus = async (productId: string, verificationStatus: string) => {
    setProcessingId(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to update product status');
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const updateSellerVerification = async (sellerId: string, isVerified: boolean) => {
    setProcessingId(sellerId);
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to update seller verification');
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const stats = [
    {
      id: 'pending' as const,
      label: 'Pending Products',
      value: pendingProducts,
      icon: Clock,
      color: `${colorPalette.stats.yellow.bg} ${colorPalette.stats.yellow.text}`,
      borderColor: colorPalette.stats.yellow.border,
    },
    {
      id: 'approved' as const,
      label: 'Approved Products',
      value: approvedProducts,
      icon: CheckCircle,
      color: `${colorPalette.stats.success.bg} ${colorPalette.stats.success.text}`,
      borderColor: colorPalette.stats.success.border,
    },
    {
      id: 'rfqs' as const,
      label: 'Total RFQs',
      value: totalRFQs,
      icon: TrendingUp,
      color: `${colorPalette.stats.warning.bg} ${colorPalette.stats.warning.text}`,
      borderColor: colorPalette.stats.warning.border,
    },
    {
      id: 'sellers' as const,
      label: 'Total Sellers',
      value: totalSellers,
      icon: Users,
      color: `${colorPalette.stats.secondary.bg} ${colorPalette.stats.secondary.text}`,
      borderColor: colorPalette.stats.secondary.border,
    },
  ];

  return (
    <>
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isSelected = selectedTab === stat.id;
          return (
            <Card
              key={stat.label}
              onClick={() => setSelectedTab(stat.id)}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? `ring-2 ${stat.borderColor} ${colorPalette.card.shadowSelected}`
                  : colorPalette.card.shadowHover
              }`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`${stat.color} p-2.5 md:p-3 rounded-lg`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
                <p className={`text-2xl md:text-3xl font-bold ${colorPalette.text.primary} mb-1`}>
                  {stat.value}
                </p>
                <p className={`text-xs md:text-sm ${colorPalette.text.secondary}`}>{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'pending' && (
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Pending Products</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {allPendingProducts.length === 0 ? (
              <p className="text-sm md:text-base text-slate-800 text-center py-6 md:py-8 font-medium">
                No pending products
              </p>
            ) : (
              <div className="space-y-3">
                {allPendingProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="block p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-800 mt-1 font-medium">
                          {product.seller.companyName} • {product.category.name}
                        </p>
                        <p className="text-xs text-slate-800 mt-1 font-medium">
                          Submitted {product.createdAt}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                        Pending
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTab === 'approved' && (
        <Card>
          <CardHeader>
            <CardTitle>Approved Products</CardTitle>
          </CardHeader>
          <CardContent>
            {allApprovedProducts.length === 0 ? (
              <p className="text-slate-800 text-center py-8 font-medium">No approved products</p>
            ) : (
              <div className="space-y-3">
                {allApprovedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="block p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-800 mt-1 font-medium">
                          {product.seller.companyName} • {product.category.name}
                        </p>
                        <p className="text-xs text-slate-800 mt-1 font-medium">
                          Submitted {product.createdAt}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                        Approved
                      </span>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        disabled={processingId === product.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          void updateProductStatus(product.id, 'PENDING');
                        }}
                        className="text-xs px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                      >
                        Unapprove
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTab === 'rfqs' && (
        <Card>
          <CardHeader>
            <CardTitle>All Enquiries (RFQs)</CardTitle>
          </CardHeader>
          <CardContent>
            {allRFQs.length === 0 ? (
              <p className="text-slate-800 text-center py-8 font-medium">No enquiries yet</p>
            ) : (
              <div className="space-y-4">
                {allRFQs.map((rfq) => (
                  <div
                    key={rfq.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{rfq.buyerName}</h3>
                        <p className="text-sm text-slate-800 font-medium">{rfq.buyerEmail}</p>
                        {rfq.buyerCompany && (
                          <p className="text-sm text-slate-800 font-medium">
                            {rfq.buyerCompany}
                            {rfq.buyerCountry && ` • ${rfq.buyerCountry}`}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-800 font-medium">{rfq.createdAt}</span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-slate-900">
                        Product: {rfq.product.name}
                      </p>
                      <p className="text-xs text-slate-800 font-medium">
                        Seller: {rfq.product.seller.companyName}
                      </p>
                      {rfq.quantity && (
                        <p className="text-sm text-slate-800 font-medium">
                          Quantity: {rfq.quantity}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-slate-900 bg-slate-50 p-2 rounded">{rfq.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTab === 'sellers' && (
        <Card>
          <CardHeader>
            <CardTitle>All Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            {allSellers.length === 0 ? (
              <p className="text-slate-800 text-center py-8 font-medium">No sellers yet</p>
            ) : (
              <div className="space-y-3">
                {allSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{seller.companyName}</h3>
                        <p className="text-sm text-slate-800 font-medium">{seller.email}</p>
                        {seller.city && seller.state && (
                          <p className="text-sm text-slate-800 font-medium">
                            {seller.city}, {seller.state}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/sellers/${seller.id}/edit`}
                          className="text-xs px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          Edit Seller
                        </Link>
                        {seller.isVerified && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            Verified
                          </span>
                        )}
                        <button
                          type="button"
                          disabled={processingId === seller.id}
                          onClick={() => void updateSellerVerification(seller.id, !seller.isVerified)}
                          className={`text-xs px-3 py-1 rounded border disabled:opacity-60 ${
                            seller.isVerified
                              ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                              : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {seller.isVerified ? 'Undo Verify' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
