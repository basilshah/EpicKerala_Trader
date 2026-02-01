import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardNav />
      <main className="flex-1">
        <div className="py-8">{children}</div>
      </main>
    </div>
  );
}
