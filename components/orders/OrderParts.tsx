import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { lineTotal, orderStages, stageIndex, type CartLine, type Order } from "@/lib/orders";
import { formatPrice, measurementFields } from "@/lib/products";

/** One cart line as shown in the cart page, checkout summary and order pages. */
export function LineItem({ line, children }: { line: CartLine; children?: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-5">
      <Link href={`/product/${line.slug}`} className="relative block w-20 shrink-0 bg-ivory-base" style={{ aspectRatio: "3 / 4" }}>
        {line.image && <Image src={line.image} alt="" fill sizes="80px" className="object-cover object-top" />}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/product/${line.slug}`} className="font-serif text-[15px] text-black">
              {line.name}
            </Link>
            <p className="caps mt-1 text-[11px] text-neutral-500">
              {line.size === "Custom" ? "Custom measurements" : `Size ${line.size}`} · Made to order
              {line.qty > 1 && ` · Qty ${line.qty}`}
            </p>
          </div>
          <p className="caps shrink-0 text-[13px] font-bold text-black">{formatPrice(lineTotal(line))}</p>
        </div>
        {line.measurements && (
          <details className="mt-2 text-[12px] text-neutral-600">
            <summary className="link-underline inline cursor-pointer text-neutral-500">View measurements</summary>
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
              {measurementFields.map((f) => (
                <div key={f.key} className="flex justify-between gap-2">
                  <dt className="text-neutral-500">{f.label}</dt>
                  <dd className="text-black">{line.measurements?.[f.key]}&quot;</dd>
                </div>
              ))}
            </dl>
            {line.notes && <p className="mt-2">Notes: {line.notes}</p>}
          </details>
        )}
        {children}
      </div>
    </div>
  );
}

export function Totals({
  subtotal,
  delivery,
  expressFee = 0,
  total,
}: {
  subtotal: number;
  delivery: number;
  expressFee?: number;
  total: number;
}) {
  const row = "flex items-center justify-between gap-4 py-2";
  return (
    <dl className="text-[13px] text-neutral-600">
      <div className={row}>
        <dt>Subtotal</dt>
        <dd className="text-black">{formatPrice(subtotal)}</dd>
      </div>
      <div className={row}>
        <dt>Delivery</dt>
        <dd className="text-black">{delivery ? formatPrice(delivery) : "Complimentary"}</dd>
      </div>
      {expressFee > 0 && (
        <div className={row}>
          <dt>Priority stitching</dt>
          <dd className="text-black">{formatPrice(expressFee)}</dd>
        </div>
      )}
      <div className={`${row} caps border-t border-neutral-200 pt-3 text-[13px] font-bold text-black`}>
        <dt>Total</dt>
        <dd>{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

/** The production journey, with everything up to the current stage marked done. */
export function OrderTimeline({ order }: { order: Order }) {
  const current = stageIndex(order.status);
  return (
    <ol className="relative space-y-6 border-l border-neutral-200 pl-6">
      {orderStages.map((stage, index) => {
        const done = index <= current;
        return (
          <li key={stage.key} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[31px] top-0.5 flex size-[11px] items-center justify-center ${
                done ? "bg-black text-white" : "border border-neutral-300 bg-white"
              }`}
            >
              {done && <Check size={9} strokeWidth={3} />}
            </span>
            <p className={`caps text-[11px] ${done ? "text-black" : "text-neutral-400"}`}>
              {stage.label}
              {index === current && <span className="ml-2 text-champagne-gold">Current</span>}
            </p>
            <p className="mt-1 text-[13px] text-neutral-500">
              {index === 1 && index === current
                ? `${stage.detail} Estimated ${order.stitchingTime[0]}–${order.stitchingTime[1]} working days.`
                : stage.detail}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
