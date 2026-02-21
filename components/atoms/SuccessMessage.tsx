import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessMessageProps {
  message?: string | null;
  className?: string;
}

export function SuccessMessage({ message, className }: SuccessMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
