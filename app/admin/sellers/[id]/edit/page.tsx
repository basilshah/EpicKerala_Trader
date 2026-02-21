import { redirect, notFound } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import ProfileForm from '@/components/dashboard/ProfileForm';

export const dynamic = 'force-dynamic';

interface AdminSellerEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSellerEditPage({ params }: AdminSellerEditPageProps) {
  const session = await adminAuth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const seller = await prismaClient.seller.findUnique({
    where: { id },
  });

  if (!seller) {
    notFound();
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Seller</h1>
          <p className="text-slate-600">Update seller profile and business details</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <ProfileForm
            seller={seller}
            submitUrl={`/api/admin/sellers/${seller.id}`}
            cancelHref="/admin/dashboard"
            isAdminMode
          />
        </div>
      </div>
    </Container>
  );
}
