import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Globe, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="w-full relative overflow-hidden min-h-[480px] sm:min-h-[560px] lg:min-h-[650px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kerala_hero_bg.png"
          alt="Kerala Spice Plantation"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay — deep green (primary) left, slightly transparent right, blends with gold accent */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(31,61,43,0.88) 0%, rgba(31,61,43,0.75) 45%, rgba(31,61,43,0.45) 70%, rgba(31,61,43,0.15) 100%)',
          }}
        />
        {/* Subtle gold shimmer at top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(201,163,74,0.07) 0%, transparent 40%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-12 sm:py-16 lg:py-24 w-full min-w-0">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in slide-in-from-left duration-700 fade-in min-w-0 overflow-hidden max-w-2xl">
          <div className="space-y-2 sm:space-y-4">
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-secondary/20 border-secondary/40 text-secondary text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-sm"
            >
              <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Official Trade Portal of Kerala
            </Badge>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Connecting Global Buyers to{' '}
              <span className="text-secondary relative">
                Kerala&apos;s Finest
                <span className="absolute bottom-1 left-0 w-full h-2 bg-secondary/20 -z-10 rounded-sm" />
              </span>{' '}
              Export Products
            </h1>

            <p className="text-sm sm:text-lg text-white/80 leading-relaxed max-w-xl">
              Source premium quality spices, coir, textiles, and more directly from verified
              manufacturers.
            </p>
          </div>

          <form
            action="/search"
            method="get"
            className="relative flex w-full max-w-full sm:max-w-lg rounded-2xl sm:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.25)] border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden focus-within:outline-none focus-within:ring-0 min-w-0"
          >
            <div className="flex flex-1 min-w-0 items-center gap-2 py-2 pl-4 pr-24 sm:py-2.5 sm:pl-5 sm:pr-32">
              <Search className="w-5 h-5 text-white/60 shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search products (e.g., Cardamom...)"
                className="flex-1 min-w-0 border-0 bg-transparent px-0 text-base text-white placeholder:text-white/50 outline-none focus:outline-none focus:ring-0 h-11"
              />
            </div>
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-5 sm:px-8 bg-secondary hover:bg-secondary/90 text-primary font-semibold text-sm flex items-center justify-center rounded-r-2xl sm:rounded-r-full focus:outline-none focus-visible:outline-none transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span className="font-semibold text-secondary">Popular:</span>
            {['Spices', 'Coir', 'Textiles', 'Handicrafts'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag.toLowerCase()}`}
                className="hover:text-secondary underline decoration-dotted underline-offset-4 transition-colors text-white/80"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
