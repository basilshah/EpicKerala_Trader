export function HomePageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero skeleton - compact bar */}
      <div className="h-64 sm:h-80 lg:h-96 bg-slate-200 animate-pulse" />

      {/* Categories skeleton */}
      <section className="py-4 sm:py-8 border-t border-border/40 bg-slate-50/50">
        <div className="container-custom">
          <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products skeleton */}
      <section className="py-6 sm:py-12 border-t border-slate-100 bg-slate-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="h-48 sm:h-56 bg-slate-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-5 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exporters skeleton */}
      <section className="py-6 sm:py-12 border-t bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div className="space-y-2">
              <div className="h-8 w-56 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="h-32 bg-slate-200 animate-pulse" />
                <div className="p-6 pt-12 space-y-4">
                  <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="h-12 border-b border-slate-100" />
                  <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
