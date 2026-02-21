import { unstable_cache } from 'next/cache';
import prismaClient from '@/lib/prisma';

const CACHE_TAGS = {
  categories: 'home-categories',
  sellers: 'home-sellers',
  products: 'home-products',
} as const;

export const HOMEPAGE_REVALIDATE_SECONDS = 300; // 5 minutes

async function withRetry<T>(
  label: string,
  operation: () => Promise<T>,
  fallback: T,
  retries = 2
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }
  }

  console.error(`[HomePage] Failed to load ${label} after retries`, lastError);
  return fallback;
}

async function fetchCategories() {
  return withRetry(
    'categories',
    () =>
      prismaClient.category.findMany({
        where: { parentId: null },
        orderBy: { name: 'asc' },
        take: 20,
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      }),
    []
  );
}

async function fetchFeaturedSellers() {
  return withRetry(
    'featured sellers',
    () =>
      prismaClient.seller.findMany({
        where: { isVerified: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          companyName: true,
          slug: true,
          city: true,
          state: true,
          description: true,
          isVerified: true,
          type: true,
          offersOEM: true,
          _count: { select: { products: true } },
        },
      }),
    []
  );
}

async function fetchFeaturedProducts() {
  return withRetry(
    'featured products',
    () =>
      prismaClient.product.findMany({
        where: {
          isPublic: true,
          verificationStatus: 'APPROVED',
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          images: true,
          moq: true,
          hsCode: true,
          origin: true,
          shelfLife: true,
          seller: {
            select: {
              companyName: true,
              isVerified: true,
              type: true,
              offersOEM: true,
              city: true,
              state: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
    []
  );
}

export async function getHomePageData() {
  const [categories, verifiedSellers, featuredProducts] = await Promise.all([
    unstable_cache(fetchCategories, ['home-categories'], {
      tags: [CACHE_TAGS.categories],
      revalidate: HOMEPAGE_REVALIDATE_SECONDS,
    })(),
    unstable_cache(fetchFeaturedSellers, ['home-sellers'], {
      tags: [CACHE_TAGS.sellers],
      revalidate: HOMEPAGE_REVALIDATE_SECONDS,
    })(),
    unstable_cache(fetchFeaturedProducts, ['home-products'], {
      tags: [CACHE_TAGS.products],
      revalidate: HOMEPAGE_REVALIDATE_SECONDS,
    })(),
  ]);

  return { categories, verifiedSellers, featuredProducts };
}

export { CACHE_TAGS };
