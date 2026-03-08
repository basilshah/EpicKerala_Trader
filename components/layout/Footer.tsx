import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { SITE_CONTACT, SITE_COPY, SITE_NAME } from '@/lib/site-content';

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-6 sm:py-10 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* Column 1: About - full width on mobile/tablet */}
          <div className="col-span-2 space-y-2 sm:space-y-4 order-first">
            <div className="scale-90 sm:scale-95 lg:scale-100 origin-left">
              <Logo size="lg" linkable={false} className="text-white" />
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {SITE_COPY.shortDescription}
            </p>
            <div className="flex items-center gap-1.5 sm:gap-3 pt-1 sm:pt-2">
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-5">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm text-white/80">
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
            <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-5">Export Categories</h3>
            <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm text-white/80">
              <li>
                <Link
                  href="/category/fruits-vegetables"
                  className="hover:text-secondary transition-colors"
                >
                  Fruits &amp; Vegetables
                </Link>
              </li>
              <li>
                <Link
                  href="/category/spices-masala"
                  className="hover:text-secondary transition-colors"
                >
                  Spices &amp; Masala
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ready-to-eat-snacks"
                  className="hover:text-secondary transition-colors"
                >
                  Ready to Eat Snacks
                </Link>
              </li>
              <li>
                <Link
                  href="/category/rice-grains-pulses"
                  className="hover:text-secondary transition-colors"
                >
                  Rice, Grains &amp; Pulses
                </Link>
              </li>
              <li>
                <Link
                  href="/category/coconut-products"
                  className="hover:text-secondary transition-colors"
                >
                  Coconut Products
                </Link>
              </li>
              <li>
                <Link
                  href="/category/textiles-apparel"
                  className="hover:text-secondary transition-colors"
                >
                  Textiles &amp; Apparel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-5">Contact</h3>
            <ul className="space-y-1 sm:space-y-3 text-xs sm:text-sm text-white/80">
              {SITE_CONTACT.addressLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li className="pt-2">
                <a
                  href={`mailto:${SITE_CONTACT.email}`}
                  className="hover:text-secondary transition-colors"
                >
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONTACT.phoneHref}`}
                  className="hover:text-secondary transition-colors"
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-primary/80">
        <div className="container-custom py-4 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/70">
          <p>© 2026 {SITE_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
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
