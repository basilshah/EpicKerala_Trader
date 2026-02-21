'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { BLUR_PLACEHOLDER } from '@/lib/image-utils';

interface ProductImageCarouselProps {
  images: Array<{ url: string; filename: string }>;
  productName: string;
  fallbackIcon?: React.ReactNode;
}

export function ProductImageCarousel({
  images,
  productName,
  fallbackIcon,
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-64 md:h-80 bg-accent flex items-center justify-center">{fallbackIcon}</div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Navigation */}
      <div className="relative group">
        <div className="relative h-64 md:h-80 bg-accent overflow-hidden">
          <Image
            src={images[currentIndex].url}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            priority={currentIndex === 0}
            loading={currentIndex === 0 ? undefined : 'lazy'}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            quality={88}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        </div>

        {/* Navigation Buttons - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-border shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity w-11 h-11 sm:w-9 sm:h-9 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-border shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity w-11 h-11 sm:w-9 sm:h-9 p-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'relative aspect-square rounded overflow-hidden border-2 transition-all hover:scale-105',
                currentIndex === index
                  ? 'border-secondary shadow-md ring-2 ring-secondary/20'
                  : 'border-border hover:border-secondary/50'
              )}
            >
              <Image
                src={image.url}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                quality={70}
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator - Alternative for mobile when few images */}
      {images.length > 1 && images.length <= 5 && (
        <div className="flex justify-center gap-2 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                currentIndex === index ? 'bg-secondary w-6' : 'bg-border w-2'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
