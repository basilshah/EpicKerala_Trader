import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-[url('/pattern-bg.png')] bg-no-repeat bg-cover bg-center bg-scroll sm:bg-fixed relative">
      <div className="absolute inset-0 bg-primary/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/80 via-primary to-primary-foreground/5 opacity-50" />
      <div className="container-custom relative z-10 text-center max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Ready to Source Premium Kerala Products?
        </h2>
        <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto font-light">
          Join thousands of international buyers connecting with verified exporters on the official
          trade portal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 sm:pt-4">
          <Link href="/register/importer">
            <Button
              size="lg"
              className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg border-white/30 text-white hover:bg-white hover:text-primary font-bold rounded-full bg-white/5 backdrop-blur-sm transition-all w-full sm:w-auto"
            >
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
