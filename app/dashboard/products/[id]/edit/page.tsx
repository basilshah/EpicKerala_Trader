import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import EditProductForm from '@/components/dashboard/EditProductForm';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  const seller = await prismaClient.seller.findUnique({
    where: { email: session.user.email },
  });

  if (!seller) {
    redirect('/signin');
  }

  // Fetch the product
  const product = await prismaClient.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product || product.sellerId !== seller.id) {
    redirect('/dashboard/products');
  }

  // Fetch main categories (no parent) and all categories
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
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        <EditProductForm
          product={product}
          sellerId={seller.id}
          mainCategories={mainCategories}
          allCategories={allCategories}
        />
      </div>
    </Container>
  );
}
