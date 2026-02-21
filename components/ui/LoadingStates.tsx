import { Spinner } from './Spinner';

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="text-primary mb-4" />
        <p className="text-slate-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-border p-6 animate-pulse">
      <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded animate-pulse"></div>
      ))}
    </div>
  );
}
