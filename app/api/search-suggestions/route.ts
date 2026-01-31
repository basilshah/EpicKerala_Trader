import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    // Search in parallel for better performance
    const [categories, products, sellers] = await Promise.all([
      prismaClient.category.findMany({
        where: {
          name: { contains: query },
        },
        select: { id: true, name: true },
        take: 3,
      }),
      prismaClient.product.findMany({
        where: {
          name: { contains: query },
        },
        select: { id: true, name: true },
        take: 4,
      }),
      prismaClient.seller.findMany({
        where: {
          companyName: { contains: query },
        },
        select: { id: true, companyName: true },
        take: 3,
      }),
    ]);

    // Combine and format results
    const suggestions = [
      ...categories.map((cat) => ({ id: cat.id, name: cat.name, type: 'category' as const })),
      ...products.map((prod) => ({ id: prod.id, name: prod.name, type: 'product' as const })),
      ...sellers.map((seller) => ({ id: seller.id, name: seller.companyName, type: 'seller' as const })),
    ];

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json([]);
  }
}
