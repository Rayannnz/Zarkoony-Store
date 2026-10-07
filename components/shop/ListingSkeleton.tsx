/** Shown by the listing routes' loading.tsx while a filtered page renders. */
export function ListingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products" className="mx-auto max-w-[1920px] px-4 pb-16 md:px-10 md:pb-24 lg:px-14">
      <div className="py-4">
        <div className="skeleton h-3 w-40" />
      </div>
      <div className="flex flex-col items-center pb-8 md:pb-10">
        <div className="skeleton h-7 w-56" />
        <div className="skeleton mt-3 h-3 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-14">
        <div className="hidden space-y-4 border-t border-neutral-200 pt-4 lg:block">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-4 w-32" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="skeleton aspect-[3/4]" />
              <div className="skeleton mx-auto mt-4 h-3 w-2/3" />
              <div className="skeleton mx-auto mt-2 h-3 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
