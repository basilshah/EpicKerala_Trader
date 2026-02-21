import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
