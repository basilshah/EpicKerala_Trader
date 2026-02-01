'use client';

import Link from 'next/link';
import { Ship, Menu, X, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { colorPalette } from '@/lib/colors';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="w-full h-[70px] bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="https://trade.epickerala.com/wp-content/uploads/2026/01/cropped-Logo-EPIC-1-e1769326543778-1-e1769345122998.png"
            alt="Epic Kerala"
            className="h-10 cursor-pointer"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 text-slate-700">
          <Link 
            href="/" 
            className={`relative text-[15px] font-medium transition-colors px-4 py-2 ${
              pathname === '/' 
                ? colorPalette.nav.active.text 
                : `${colorPalette.nav.inactive.text} ${colorPalette.nav.inactive.hover}`
            }`}
          >
            Home
            {pathname === '/' && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorPalette.nav.active.underline} rounded-full`}></span>
            )}
          </Link>
          <Link
            href="/categories"
            className={`relative text-[15px] font-medium transition-colors px-4 py-2 ${
              pathname === '/categories' || pathname?.startsWith('/category/')
                ? colorPalette.nav.active.text 
                : `${colorPalette.nav.inactive.text} ${colorPalette.nav.inactive.hover}`
            }`}
          >
            Categories
            {(pathname === '/categories' || pathname?.startsWith('/category/')) && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorPalette.nav.active.underline} rounded-full`}></span>
            )}
          </Link>
          <Link
            href="/products"
            className={`relative text-[15px] font-medium transition-colors px-4 py-2 ${
              pathname === '/products' || pathname?.startsWith('/product/')
                ? colorPalette.nav.active.text 
                : `${colorPalette.nav.inactive.text} ${colorPalette.nav.inactive.hover}`
            }`}
          >
            Products
            {(pathname === '/products' || pathname?.startsWith('/product/')) && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorPalette.nav.active.underline} rounded-full`}></span>
            )}
          </Link>
          <Link
            href="/sellers"
            className={`relative text-[15px] font-medium transition-colors px-4 py-2 ${
              pathname === '/sellers' || pathname?.startsWith('/seller/')
                ? colorPalette.nav.active.text 
                : `${colorPalette.nav.inactive.text} ${colorPalette.nav.inactive.hover}`
            }`}
          >
            Exporters
            {(pathname === '/sellers' || pathname?.startsWith('/seller/')) && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorPalette.nav.active.underline} rounded-full`}></span>
            )}
          </Link>
          <Link
            href="/about"
            className={`relative text-[15px] font-medium transition-colors px-4 py-2 ${
              pathname === '/about'
                ? colorPalette.nav.active.text 
                : `${colorPalette.nav.inactive.text} ${colorPalette.nav.inactive.hover}`
            }`}
          >
            About Us
            {pathname === '/about' && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorPalette.nav.active.underline} rounded-full`}></span>
            )}
          </Link>
          <Link
            href="/contact"
            className={`relative text-[15px] font-medium transition-colors px-4 py-2 ${
              pathname === '/contact'
                ? colorPalette.nav.active.text 
                : `${colorPalette.nav.inactive.text} ${colorPalette.nav.inactive.hover}`
            }`}
          >
            Contact
            {pathname === '/contact' && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorPalette.nav.active.underline} rounded-full`}></span>
            )}
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {session ? (
            <Link href="/dashboard">
              <button className="h-9 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <button className="h-9 px-5 bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow-md">
                  Register as Exporter
                </button>
              </Link>
              <Link href="/signin">
                <button className="h-9 px-5 bg-white hover:bg-white/90 text-primary text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow-md">
                  Sign In
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-white">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
