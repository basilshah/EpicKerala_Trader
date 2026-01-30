import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BadgeCheck, Award } from 'lucide-react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'primary' | 'success' | 'warning' | 'muted';
  className?: string;
  icon?: ReactNode;
}

const variantStyles = {
  default: 'bg-slate-100 text-foreground border-slate-200',
  secondary: 'bg-white text-secondary border-slate-200',
  primary: 'bg-primary text-white border-primary',
  success: 'bg-white text-secondary border-slate-200', // For verified badges
  warning: 'bg-amber-50 text-amber-900 border-amber-200',
  muted: 'bg-slate-100 text-muted border-slate-200',
};

export function Badge({ children, variant = 'default', className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors',
        variantStyles[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

// Specialized badge components for common use cases
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="success" className={className} icon={<BadgeCheck className="w-3 h-3" />}>
      Verified
    </Badge>
  );
}

export function ProductCountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <Badge variant="default" className={cn('bg-white/90 backdrop-blur-sm', className)}>
      {count} {count === 1 ? 'Product' : 'Products'}
    </Badge>
  );
}

export function SubcategoryBadge({
  children,
  interactive = false,
  className,
}: {
  children: ReactNode;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <Badge
      variant="default"
      className={cn(
        'shadow-sm',
        interactive && 'hover:bg-secondary hover:text-white cursor-pointer',
        className
      )}
    >
      {children}
    </Badge>
  );
}

export function CategoryBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Badge variant="primary" className={cn('bg-primary/10 text-primary border-0', className)}>
      {children}
    </Badge>
  );
}

export function CertificationBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Badge variant="warning" className={className} icon={<Award className="w-3 h-3" />}>
      {children}
    </Badge>
  );
}
