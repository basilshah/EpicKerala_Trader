import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface HomeCategoryCircleProps {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  imageUrl?: string;
}

export function HomeCategoryCircle({ category, imageUrl }: HomeCategoryCircleProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center shrink-0 min-w-[4rem] sm:min-w-0 active:opacity-80 touch-manipulation"
    >
      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-secondary/30 bg-slate-100 flex items-center justify-center group-hover:border-secondary group-active:scale-95 sm:group-hover:scale-105 transition-all duration-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <Package className="w-6 h-6 text-primary/30" />
          </div>
        )}
      </div>
      <span className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm font-medium text-primary group-hover:text-secondary transition-colors text-center line-clamp-2 max-w-[4rem] sm:max-w-24">
        {category.name}
      </span>
    </Link>
  );
}
