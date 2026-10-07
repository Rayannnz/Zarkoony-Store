import type { ReactNode } from "react";
import Link from "next/link";
import { Package, Plus, RefreshCw, Scissors, Sparkles, Tag } from "lucide-react";
import { careByFabric, defaultCare, facts } from "@/lib/content";
import { stitchingLabel, type Product } from "@/lib/products";

const icon = { size: 18, strokeWidth: 1.5, "aria-hidden": true } as const;

export function ProductAccordions({ product }: { product: Product }) {
  const sections: { title: string; icon: ReactNode; body: ReactNode }[] = [
    {
      title: "Product details",
      icon: <Package {...icon} />,
      body: (
        <>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
            <dt className="caps text-[10px] text-neutral-500">Fabric</dt>
            <dd>{product.fabric}</dd>
            <dt className="caps text-[10px] text-neutral-500">Colour</dt>
            <dd>{product.color}</dd>
            <dt className="caps text-[10px] text-neutral-500">Silhouette</dt>
            <dd>{product.type}</dd>
            <dt className="caps text-[10px] text-neutral-500">Occasion</dt>
            <dd>{product.occasion}</dd>
          </dl>
          <p className="caps mt-4 text-[10px] text-neutral-500">Pieces</p>
          <ul className="mt-1 list-disc pl-4">
            {product.pieces.map((piece) => (
              <li key={piece}>{piece}</li>
            ))}
          </ul>
          <p className="caps mt-4 text-[10px] text-neutral-500">Handwork</p>
          <ul className="mt-1 list-disc pl-4">
            {product.embroidery.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-neutral-500">
            Colour may vary slightly with lighting and screen settings. Embroidery is placed by hand,
            so no two pieces are identical.
          </p>
        </>
      ),
    },
    {
      title: "Stitching & delivery",
      icon: <Scissors {...icon} />,
      body: (
        <>
          <p>
            <strong className="font-medium text-black">Stitching time: {stitchingLabel(product)}.</strong>{" "}
            {facts.stitchingNote} {facts.dispatch}
          </p>
          <p className="mt-3">{facts.deliveryPakistan}</p>
          <p className="mt-3">
            Need it sooner? Priority stitching completes in {facts.express.days} working days for a
            fixed fee, chosen at checkout.{" "}
            <Link href="/shipping" className="link-underline text-black">
              Dispatch timeline
            </Link>
          </p>
        </>
      ),
    },
    {
      title: "Description",
      icon: <Tag {...icon} />,
      body: <p>{product.description}</p>,
    },
    {
      title: "Alterations & exchanges",
      icon: <RefreshCw {...icon} />,
      body: (
        <>
          <p>{facts.alterations}</p>
          <p className="mt-3">{facts.exchanges}</p>
          <p className="mt-3">
            <Link href="/returns" className="link-underline text-black">
              Read the full policy
            </Link>
          </p>
        </>
      ),
    },
    {
      title: "Care",
      icon: <Sparkles {...icon} />,
      body: <p>{careByFabric[product.fabric] ?? defaultCare}</p>,
    },
  ];

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {sections.map((section) => (
        <details key={section.title} className="group">
          <summary className="caps flex cursor-pointer list-none items-center gap-3 py-5 text-[11px] text-black [&::-webkit-details-marker]:hidden">
            <span className="text-neutral-500">{section.icon}</span>
            {section.title}
            <Plus
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="ml-auto transition-transform duration-(--duration-medium) group-open:rotate-45"
            />
          </summary>
          <div className="pb-6 text-[13px] leading-relaxed text-neutral-600">{section.body}</div>
        </details>
      ))}
    </div>
  );
}
