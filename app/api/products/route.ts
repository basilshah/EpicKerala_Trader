import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Generate unique slug
    let slug = slugify(data.name);
    let slugExists = await prismaClient.product.findUnique({
      where: { slug },
    });

    let counter = 1;
    while (slugExists) {
      slug = `${slugify(data.name)}-${counter}`;
      slugExists = await prismaClient.product.findUnique({
        where: { slug },
      });
      counter++;
    }

    // Create product
    const product = await prismaClient.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        sellerId: data.sellerId,
        categoryId: data.categoryId,
        hsCode: data.hsCode || null,
        moq: data.moq || null,
        origin: data.origin || 'India',
        shelfLife: data.shelfLife || null,
        images: data.images || null,
        isPublic: data.isPublic ?? true,
      },
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
