'use client';

import Link from 'next/link';
import { Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/Separator';
import Logo from '@/components/layout/Logo';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Products', href: '/products' },
    { name: 'Exporters', href: '/sellers' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="w-full h-20 bg-white/95 backdrop-blur-md border-b border-border/60 sticky top-0 z-50">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo Section */}
        <Logo size="sm" className="text-primary transition-transform hover:scale-105" />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'relative text-[15px] font-medium transition-all px-4 py-2 rounded-full hover:bg-muted/50',
                pathname === link.href ||
                  (link.href !== '/' && pathname?.startsWith(link.href.replace(/s$/, ''))) // Handle singular/plural rough match
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-2 font-medium">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-8" />
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="gap-2 border-slate-200 text-muted-foreground hover:text-red-500 hover:border-red-100 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-semibold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all px-6">
                  Register as Exporter
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl lg:hidden animate-in slide-in-from-top-2">
          <div className="container-custom py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                  pathname === link.href
                    ? 'bg-primary/5 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                )}
              >
                {link.name}
              </Link>
            ))}

            <Separator className="my-4 opacity-50" />

            {/* Mobile Actions */}
            <div className="space-y-3 px-2">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start gap-2" variant="default">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full justify-start gap-2 text-red-600 border-red-100 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center text-base py-6 bg-primary font-semibold">
                      Register as Exporter
                    </Button>
                  </Link>
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-center text-base py-6 border-slate-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
