import { redirect, notFound } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import { Container } from '@/components/ui/Container';
import CategoryForm from '@/components/admin/CategoryForm';
import prismaClient from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await adminAuth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const { id } = await params;

  const category = await prismaClient.category.findUnique({
    where: { id },
    include: {
      parent: true,
    },
  });

  if (!category) {
    notFound();
  }

  // Get main categories for parent selection (excluding current category)
  const mainCategories = await prismaClient.category.findMany({
    where: {
      parentId: null,
      id: { not: id },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <Container className="py-6">
          <Link
            href="/admin/categories"
            className="text-emerald-600 hover:underline text-sm mb-2 block"
          >
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Category</h1>
          <p className="text-slate-700 mt-1">Update category information</p>
        </Container>
      </div>

      <Container className="py-8 max-w-2xl">
        <CategoryForm category={category} mainCategories={mainCategories} />
      </Container>
    </div>
  );
}
