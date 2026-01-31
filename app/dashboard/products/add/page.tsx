import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import AddProductForm from '@/components/dashboard/AddProductForm';

export default async function AddProductPage() {
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Product</h1>
          <p className="text-slate-600">List your product to reach global buyers</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <AddProductForm
            sellerId={seller.id}
            mainCategories={mainCategories}
            allCategories={allCategories}
          />
        </div>
      </div>
    </Container>
  );
}
