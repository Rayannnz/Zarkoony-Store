export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading product" className="mx-auto max-w-[1376px] px-4 pt-6 md:px-10 md:pt-10 lg:px-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_413px] lg:gap-20">
        <div className="skeleton aspect-[3/4] md:ml-[96px] md:aspect-[2/3] lg:ml-[136px]" />
        <div className="space-y-4">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-24" />
          <div className="skeleton mt-8 h-11 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
