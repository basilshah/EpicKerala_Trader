import { ArrowRight } from 'lucide-react';

interface ViewDetailsLinkProps {
  text?: string;
}

export function ViewDetailsLink({ text = 'View Details' }: ViewDetailsLinkProps) {
  return (
    <div className="border-t border-slate-100 pt-4">
      <span className="text-secondary font-semibold text-sm group-hover:underline flex items-center justify-center gap-2">
        {text}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  );
}
