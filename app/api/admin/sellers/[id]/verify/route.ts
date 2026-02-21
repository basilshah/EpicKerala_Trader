import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/home/getHomePageData';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await adminAuth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sellerId } = await params;
    const data = await request.json();

    if (typeof data.isVerified !== 'boolean') {
      return NextResponse.json({ error: 'isVerified must be boolean' }, { status: 400 });
    }

    const seller = await prismaClient.seller.update({
      where: { id: sellerId },
      data: { isVerified: data.isVerified },
    });

    revalidateTag(CACHE_TAGS.sellers, 'max');
    return NextResponse.json({
      message: `Seller ${data.isVerified ? 'verified' : 'unverified'} successfully`,
      seller,
    });
  } catch (error: any) {
    console.error('Seller verification error:', error);
    return NextResponse.json({ error: 'Failed to update seller verification' }, { status: 500 });
  }
}
