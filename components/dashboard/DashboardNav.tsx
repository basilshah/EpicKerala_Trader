'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { LayoutDashboard, Package, User, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Products',
      href: '/dashboard/products',
      icon: Package,
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold text-emerald-600"></Link>
            <img
              src="https://trade.epickerala.com/wp-content/uploads/2026/01/cropped-Logo-EPIC-1-e1769326543778-1-e1769345122998.png"
              alt="Epic Kerala"
              className="h-8"
            />
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                // Fix: Dashboard should only be active on exact match, others can match subdirectories
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}
                    />
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Sign Out
          </Button>
        </div>
      </Container>
    </div>
  );
}
