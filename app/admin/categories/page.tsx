import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import { Container } from '@/components/ui/Container';
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient';
import prismaClient from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const session = await adminAuth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const categories = await prismaClient.category.findMany({
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: 'asc' },
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
  });

  const mainCategoriesCount = categories.filter((c) => !c.parentId).length;
  const subCategoriesCount = categories.filter((c) => c.parentId).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/dashboard"
                className="text-emerald-600 hover:underline text-sm mb-2 block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>
              <p className="text-slate-700 mt-1">
                {mainCategoriesCount} main categories, {subCategoriesCount} subcategories
              </p>
            </div>
            <Link href="/admin/categories/add">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <AdminCategoriesClient categories={categories} />
      </Container>
    </div>
  );
}
