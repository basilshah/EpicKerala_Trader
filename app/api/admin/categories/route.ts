import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';
import { adminAuth } from '@/lib/admin-auth';

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const session = await adminAuth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await prismaClient.category.findMany({
      include: {
        children: {
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    const session = await adminAuth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, imageUrl, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prismaClient.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const category = await prismaClient.category.create({
      data: {
        name,
        slug,
        description: description || null,
        imageUrl: imageUrl || null,
        parentId: parentId || null,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
