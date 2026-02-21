import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/home/getHomePageData';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await adminAuth();

    // Check if admin is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await params;
    const data = await request.json();

    // Validate required fields
    if (
      !data.verificationStatus ||
      !['PENDING', 'APPROVED', 'REJECTED'].includes(data.verificationStatus)
    ) {
      return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
    }

    if (data.verificationStatus === 'REJECTED' && !data.rejectionReason) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    // Update product verification status
    const product = await prismaClient.product.update({
      where: { id: productId },
      data: {
        verificationStatus: data.verificationStatus,
        rejectionReason: data.rejectionReason || null,
        verifiedAt: data.verificationStatus === 'APPROVED' ? new Date() : null,
      },
      include: {
        seller: true,
        category: true,
      },
    });

    revalidateTag(CACHE_TAGS.products, 'max');
    return NextResponse.json({
      message: 'Product verification updated successfully',
      product,
    });
  } catch (error: any) {
    console.error('Product verification error:', error);
    return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
  }
}
