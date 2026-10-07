import { madeToOrder } from "@/lib/home";

export function MadeToOrder() {
  return (
    <section
      id={madeToOrder.id}
      className="border-t border-neutral-200/70 bg-[#F8F7F4] py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h3 className="caps mb-3 text-[11px] font-normal text-neutral-500">
          {madeToOrder.eyebrow}
        </h3>
        <p className="mx-auto mb-6 max-w-2xl text-[17px] font-normal leading-[1.75] text-neutral-900 md:text-[19px]">
          &quot;{madeToOrder.quote}&quot;
        </p>
        <ul className="caps flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-neutral-700">
          {madeToOrder.assurances.map((assurance) => (
            <li key={assurance}>• {assurance}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
