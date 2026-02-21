import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeaderProps) {
  if (align === 'center') {
    return (
      <div className={cn('text-center max-w-3xl mx-auto mb-16', className)}>
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{title}</h2>
        {description ? <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{description}</p> : null}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12 gap-2 sm:gap-4', className)}>
      <div>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-3">{title}</h2>
        {description ? <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
