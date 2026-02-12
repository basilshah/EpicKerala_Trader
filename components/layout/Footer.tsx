import Link from 'next/link';
import { Ship, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <Logo size="lg" linkable={false} className="text-white" />
            <p className="text-sm text-white/80 leading-relaxed">
              Official export trade portal connecting global buyers with Kerala&apos;s finest
              manufacturers and exporters.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-secondary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-secondary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="hover:text-secondary transition-colors">
                  Exporters
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Export Categories */}
          <div>
            <h3 className="font-bold text-base mb-5">Export Categories</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link
                  href="/category/agriculture-food"
                  className="hover:text-secondary transition-colors"
                >
                  Spices
                </Link>
              </li>
              <li>
                <Link
                  href="/category/textiles-apparel"
                  className="hover:text-secondary transition-colors"
                >
                  Textiles
                </Link>
              </li>
              <li>
                <Link
                  href="/category/handicrafts-decor"
                  className="hover:text-secondary transition-colors"
                >
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link
                  href="/category/chemicals-allied"
                  className="hover:text-secondary transition-colors"
                >
                  Chemicals
                </Link>
              </li>
              <li>
                <Link
                  href="/category/engineering-industrial"
                  className="hover:text-secondary transition-colors"
                >
                  Industrial
                </Link>
              </li>
              <li>
                <Link
                  href="/category/leather-footwear"
                  className="hover:text-secondary transition-colors"
                >
                  Leather
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-base mb-5">Contact</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>Kerala Industrial Development</li>
              <li>Corporation Building</li>
              <li>Thiruvananthapuram, Kerala</li>
              <li className="pt-2">
                <a
                  href="mailto:info@epickerala.gov.in"
                  className="hover:text-secondary transition-colors"
                >
                  info@epickerala.gov.in
                </a>
              </li>
              <li>
                <a href="tel:+914712345678" className="hover:text-secondary transition-colors">
                  +91 471 234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-primary/80">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
          <p>© 2025 EPIC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-secondary transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
