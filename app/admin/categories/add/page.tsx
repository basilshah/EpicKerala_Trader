import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import { Container } from '@/components/ui/Container';
import CategoryForm from '@/components/admin/CategoryForm';
import prismaClient from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AddCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) {
  const session = await adminAuth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const parentId = params.parent;

  // Get main categories for parent selection
  const mainCategories = await prismaClient.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
  });

  // Get parent category name if creating subcategory
  let parentCategory = null;
  if (parentId) {
    parentCategory = await prismaClient.category.findUnique({
      where: { id: parentId },
      select: { name: true },
    });
  }

  const isSubcategory = !!parentId;

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
          <h1 className="text-3xl font-bold text-slate-900">
            {isSubcategory ? 'Add New Subcategory' : 'Add New Category'}
          </h1>
          <p className="text-slate-700 mt-1">
            {isSubcategory && parentCategory
              ? `Creating subcategory under "${parentCategory.name}"`
              : 'Create a new main category or subcategory'}
          </p>
        </Container>
      </div>

      <Container className="py-8 max-w-2xl">
        <CategoryForm mainCategories={mainCategories} />
      </Container>
    </div>
  );
}
