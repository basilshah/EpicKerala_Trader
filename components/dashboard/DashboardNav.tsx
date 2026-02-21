'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { LayoutDashboard, Package, User, LogOut, Home, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { colorPalette } from '@/lib/colors';
import { useState } from 'react';

export default function DashboardNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
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
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center">
              <img
                src="/epicLandLogo.webp"
                alt="Epic Kerala"
                className="h-8 md:h-10 cursor-pointer"
              />
            </Link>
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
                    className={`group relative flex items-center gap-2 px-4 md:px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? colorPalette.nav.active.text
                        : `${colorPalette.nav.inactive.text} ${colorPalette.nav.inactive.hover}`
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}
                    />
                    {item.label}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorPalette.nav.active.underline} rounded-full`}
                      ></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className={`hidden md:flex ${colorPalette.nav.signOut.hover.bg} ${colorPalette.nav.signOut.hover.border} ${colorPalette.nav.signOut.hover.text} transition-all duration-300 group`}
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Sign Out
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden min-w-[44px] min-h-[44px] p-2 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/signin' });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
