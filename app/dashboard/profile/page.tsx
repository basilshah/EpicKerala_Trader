import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import ProfileForm from '@/components/dashboard/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
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

  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Profile</h1>
          <p className="text-slate-600">Update your company information and contact details</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <ProfileForm seller={seller} />
        </div>
      </div>
    </Container>
  );
}
