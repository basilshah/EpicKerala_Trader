import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Globe, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="w-full py-6 sm:py-12 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center min-w-0">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in slide-in-from-left duration-700 fade-in min-w-0 overflow-hidden">
          <div className="space-y-2 sm:space-y-4">
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-secondary/10 border-secondary/20 text-secondary text-[10px] sm:text-xs font-bold tracking-wider uppercase"
            >
              <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Official Trade Portal of Kerala
            </Badge>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.1]">
              Connecting Global Buyers to{' '}
              <span className="text-secondary relative">
                Kerala&apos;s Finest
                <span className="absolute bottom-1 left-0 w-full h-2 bg-secondary/10 -z-10 rounded-sm" />
              </span>{' '}
              Export Products
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Source premium quality spices, coir, textiles, and more directly from verified
              manufacturers.
            </p>
          </div>

          <form
            action="/search"
            method="get"
            className="relative flex w-full max-w-full sm:max-w-lg rounded-2xl sm:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 bg-white overflow-hidden focus-within:outline-none focus-within:ring-0 min-w-0"
          >
            <div className="flex flex-1 min-w-0 items-center gap-2 py-2 pl-4 pr-24 sm:py-2.5 sm:pl-5 sm:pr-32">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search products (e.g., Cardamom...)"
                className="flex-1 min-w-0 border-0 bg-transparent px-0 text-base text-foreground placeholder:text-muted-foreground/50 outline-none focus:outline-none focus:ring-0 h-11"
              />
            </div>
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-5 sm:px-8 bg-primary hover:bg-primary/90 text-white font-semibold text-sm flex items-center justify-center rounded-r-2xl sm:rounded-r-full focus:outline-none focus-visible:outline-none"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Popular:</span>
            {['Spices', 'Coir', 'Textiles', 'Handicrafts'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag.toLowerCase()}`}
                className="hover:text-secondary underline decoration-dotted underline-offset-4 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative h-[200px] sm:h-[350px] lg:h-[550px] w-full flex items-center justify-center animate-in slide-in-from-right duration-700 fade-in lg:justify-end">
          <div className="absolute inset-0 bg-secondary/5 rounded-full blur-[100px] scale-75 translate-x-12 translate-y-12" />
          <Image
            src="/hero_export_kerala_illustration.png"
            alt="Kerala Export Illustration"
            width={700}
            height={700}
            className="relative z-10 object-contain max-w-full h-auto drop-shadow-xl hover:scale-[1.02] transition-transform duration-700"
            priority
          />
        </div>
      </div>
    </section>
  );
}
