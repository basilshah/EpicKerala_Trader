import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/lib/auth';
import prismaClient from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/home/getHomePageData';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await params;
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.description || !data.categoryId || !data.sellerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the seller belongs to the authenticated user
    const seller = await prismaClient.seller.findUnique({
      where: { email: session.user.email },
    });

    if (!seller || seller.id !== data.sellerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if product exists and belongs to this seller
    const existingProduct = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existingProduct.sellerId !== seller.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate new slug if name changed
    let slug = existingProduct.slug;
    if (data.name !== existingProduct.name) {
      slug = slugify(data.name);
      let slugExists = await prismaClient.product.findFirst({
        where: {
          slug,
          id: { not: productId },
        },
      });

      let counter = 1;
      while (slugExists) {
        slug = `${slugify(data.name)}-${counter}`;
        slugExists = await prismaClient.product.findFirst({
          where: {
            slug,
            id: { not: productId },
          },
        });
        counter++;
      }
    }

    // Update product
    const product = await prismaClient.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug,
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
      },
    });

    revalidateTag(CACHE_TAGS.products, 'max');
    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
