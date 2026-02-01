'use client';

import { useState } from 'react';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string | null;
  isPublic: boolean;
}

interface RFQ {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany: string | null;
  quantity: string | null;
  message: string;
  createdAt: Date;
  product: {
    name: string;
  };
}

interface SellerDashboardClientProps {
  totalProducts: number;
  activeListings: number;
  totalRFQs: number;
  allProducts: Product[];
  allRFQs: RFQ[];
  sellerSlug: string;
}

export default function SellerDashboardClient({
  totalProducts,
  activeListings,
  totalRFQs,
  allProducts,
  allRFQs,
  sellerSlug,
}: SellerDashboardClientProps) {
  const [selectedTab, setSelectedTab] = useState<'products' | 'listings' | 'rfqs'>('products');

  const stats = [
    {
      id: 'products' as const,
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-500',
      borderColor: 'border-blue-500',
    },
    {
      id: 'listings' as const,
      label: 'Active Listings',
      value: activeListings,
      icon: ShoppingBag,
      iconBg: 'bg-emerald-500',
      color: 'bg-emerald-100 text-emerald-700',
      borderColor: 'border-emerald-500',
    },
    {
      id: 'rfqs' as const,
      label: 'RFQ Received',
      value: totalRFQs,
      icon: TrendingUp,
      iconBg: 'bg-orange-500',
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-orange-500',
    },
  ];

  return (
    <>
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/products/add">
            <Button className="w-full" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button className="w-full" variant="outline">
              Edit Profile
            </Button>
          </Link>
          <Link href={`/seller/${sellerSlug}`}>
            <Button className="w-full" variant="outline">
              View Public Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isSelected = selectedTab === stat.id;
          return (
            <div
              key={stat.label}
              onClick={() => setSelectedTab(stat.id)}
              className={`bg-white rounded-lg shadow-md p-6 border border-slate-200 cursor-pointer transition-all ${
                isSelected ? `ring-2 ${stat.borderColor} shadow-lg` : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {isSelected && <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>}
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'products' && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">All Products</h2>
            <Link href="/dashboard/products">
              <Button variant="outline" size="sm">
                Manage Products
              </Button>
            </Link>
          </div>

          {allProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No products yet</p>
              <Link href="/dashboard/products/add">
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {allProducts.map((product) => {
                // Parse product images
                let firstImage = null;
                if (product.images) {
                  try {
                    const images = JSON.parse(product.images);
                    if (Array.isArray(images) && images.length > 0) {
                      firstImage = images[0].url;
                    }
                  } catch (e) {
                    console.error('Failed to parse product images:', e);
                  }
                }

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {firstImage && (
                        <img
                          src={firstImage}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {product.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {product.isPublic ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                          Draft
                        </span>
                      )}
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'listings' && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Active Listings</h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
              {activeListings} Active
            </span>
          </div>

          {allProducts.filter((p) => p.isPublic).length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No active listings</p>
              <p className="text-sm text-slate-500">Make your products public to show them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allProducts
                .filter((p) => p.isPublic)
                .map((product) => {
                  // Parse product images
                  let firstImage = null;
                  if (product.images) {
                    try {
                      const images = JSON.parse(product.images);
                      if (Array.isArray(images) && images.length > 0) {
                        firstImage = images[0].url;
                      }
                    } catch (e) {
                      console.error('Failed to parse product images:', e);
                    }
                  }

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {firstImage && (
                          <img
                            src={firstImage}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900">{product.name}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {product.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          Active
                        </span>
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'rfqs' && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">All Enquiries</h2>
            {totalRFQs > 0 && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
                {totalRFQs} Total
              </span>
            )}
          </div>

          {allRFQs.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No enquiries yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Buyers will contact you through product pages
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allRFQs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-slate-900">{rfq.buyerName}</h3>
                      <p className="text-sm text-slate-600">{rfq.buyerEmail}</p>
                      {rfq.buyerCompany && (
                        <p className="text-sm text-slate-500">{rfq.buyerCompany}</p>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(rfq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-slate-700">
                      Product: {rfq.product.name}
                    </p>
                    {rfq.quantity && (
                      <p className="text-sm text-slate-600">Quantity: {rfq.quantity}</p>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded">{rfq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
