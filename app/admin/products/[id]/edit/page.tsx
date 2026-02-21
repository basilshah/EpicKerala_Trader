import { redirect, notFound } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import EditProductForm from '@/components/dashboard/EditProductForm';

export const dynamic = 'force-dynamic';

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const session = await adminAuth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const product = await prismaClient.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const mainCategories = await prismaClient.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
  });
  const allCategories = await prismaClient.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Product (Admin)</h1>
        <EditProductForm
          product={product}
          sellerId={product.sellerId}
          mainCategories={mainCategories}
          allCategories={allCategories}
          submitUrl={`/api/admin/products/${product.id}`}
          cancelHref={`/admin/products/${product.id}`}
          includeSellerId={false}
        />
      </div>
    </Container>
  );
}
