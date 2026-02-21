import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { BLUR_PLACEHOLDER } from '@/lib/image-utils';

interface HomeCategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  imageUrl?: string;
}

export function HomeCategoryCard({ category, imageUrl }: HomeCategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border/60 bg-white hover:border-secondary/30 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-0.5">
        <div className="aspect-[4/3] h-20 sm:h-24 bg-slate-50 relative overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              quality={82}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              <Package className="w-8 h-8 text-primary/20 absolute z-0" />
            </>
          )}
        </div>
        <p className="px-2 py-2 text-sm font-semibold text-primary group-hover:text-secondary transition-colors truncate">
          {category.name}
        </p>
      </div>
    </Link>
  );
}
