import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import prismaClient from '@/lib/prisma';
import { adminAuth } from '@/lib/admin-auth';
import { CACHE_TAGS } from '@/lib/home/getHomePageData';
import { deleteFile, urlToKey } from '@/lib/upload/storage';

// GET single category
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await adminAuth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const category = await prismaClient.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: { orderBy: { name: 'asc' } },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update category
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await adminAuth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, imageUrl, parentId } = body;

    // Check if slug is taken by another category
    if (slug) {
      const existing = await prismaClient.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    // Fetch the current imageUrl so we can delete it from storage if replaced.
    const existing = await prismaClient.category.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    const category = await prismaClient.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        description: description !== undefined ? description : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        parentId: parentId !== undefined ? parentId : undefined,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    // Delete the old image from storage when it has been replaced.
    if (existing?.imageUrl && imageUrl !== undefined && imageUrl !== existing.imageUrl) {
      const key = urlToKey(existing.imageUrl);
      if (key) {
        deleteFile(key).catch((err) => console.error('Failed to delete old category image:', err));
      }
    }

    revalidateTag(CACHE_TAGS.categories, 'max');
    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await adminAuth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if category has children
    const category = await prismaClient.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Delete subcategories first.' },
        { status: 400 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${category._count.products} products. Move or delete products first.`,
        },
        { status: 400 }
      );
    }

    await prismaClient.category.delete({
      where: { id },
    });

    // Remove the category image from storage (best-effort, non-blocking).
    if (category.imageUrl) {
      const key = urlToKey(category.imageUrl);
      if (key) {
        deleteFile(key).catch((err) =>
          console.error('Failed to delete category image from storage:', err)
        );
      }
    }

    revalidateTag(CACHE_TAGS.categories, 'max');
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
