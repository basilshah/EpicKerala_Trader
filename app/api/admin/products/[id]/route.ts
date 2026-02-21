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

    const { id } = await params;
    const data = await request.json();

    const product = await prismaClient.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        hsCode: data.hsCode || null,
        moq: data.moq || null,
        origin: data.origin || 'India',
        shelfLife: data.shelfLife || null,
        images: data.images || null,
        catalogs: data.catalogs || null,
        certificationFiles: data.certificationFiles || null,
        isPublic: data.isPublic ?? true,
        verificationStatus: data.verificationStatus || undefined,
      },
      include: {
        seller: true,
        category: true,
      },
    });

    revalidateTag(CACHE_TAGS.products, 'max');
    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (error: any) {
    console.error('Admin product update error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
