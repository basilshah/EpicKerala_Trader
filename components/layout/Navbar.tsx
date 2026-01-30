import Link from 'next/link';
import { Ship, Menu, X } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full h-[70px] bg-primary border-b border-primary/20 sticky top-0 z-50">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Ship className="w-6 h-6 text-white" strokeWidth={2.5} />
          <span className="text-white font-bold text-lg tracking-wide uppercase">
            EPIC KERALA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-white">
          <Link href="/" className="text-[15px] font-medium hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/categories" className="text-[15px] font-medium hover:text-secondary transition-colors">
            Categories
          </Link>
          <Link href="/products" className="text-[15px] font-medium hover:text-secondary transition-colors">
            Products
          </Link>
          <Link href="/sellers" className="text-[15px] font-medium hover:text-secondary transition-colors">
            Exporters
          </Link>
          <Link href="/about" className="text-[15px] font-medium hover:text-secondary transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-[15px] font-medium hover:text-secondary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/register">
            <button className="h-9 px-5 bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold rounded transition-colors">
              Register as Exporter
            </button>
          </Link>
          <Link href="/signin" className="text-white text-sm font-medium hover:text-secondary transition-colors px-3">
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-white">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
