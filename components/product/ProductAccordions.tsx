import type { ReactNode } from "react";
import Link from "next/link";
import { Package, Plus, RefreshCw, Tag, Truck } from "lucide-react";
import { careByFabric, defaultCare, facts } from "@/lib/content";
import { stitchingLabel, type Product } from "@/lib/products";
import { Regional } from "../Price";

const icon = { size: 18, strokeWidth: 1.5, "aria-hidden": true } as const;

/** Baroque's four rows, each a few lines: details, delivery, description, exchanges. */
export function ProductAccordions({ product }: { product: Product }) {
  const care = (careByFabric[product.fabric] ?? defaultCare).split(". ")[0];
  const details: [string, string][] = [
    ["Fabric", product.fabric],
    ["Colour", product.color],
    ["Silhouette", product.type],
    ["Pieces", product.pieces.join(", ")],
    ["Handwork", product.embroidery.join(", ")],
    ["Care", care.endsWith(".") ? care : `${care}.`],
  ];

  const sections: { title: string; icon: ReactNode; body: ReactNode }[] = [
    {
      title: "Product details",
      icon: <Package {...icon} />,
      body: (
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
          {details.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="caps text-[11px] leading-[2.2] text-neutral-500">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      title: "Delivery",
      icon: <Truck {...icon} />,
      body: (
        <p>
          Stitched in {stitchingLabel(product)}, dispatched within 2 working days of the final
          inspection. <Regional pk={facts.deliveryPakistan} us={facts.internationalDelivery.note} /> Priority stitching in {facts.express.days} working
          days is available at checkout.
        </p>
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
        <p>
          {facts.alterations}{" "}
          <Link href="/returns" className="link-underline text-black">
            Read the full policy
          </Link>
        </p>
      ),
    },
  ];

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {sections.map((section) => (
        <details key={section.title} className="group">
          <summary className="caps flex cursor-pointer list-none items-center gap-3 py-5 text-label text-black [&::-webkit-details-marker]:hidden">
            <span className="text-neutral-500">{section.icon}</span>
            {section.title}
            <Plus
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="ml-auto transition-transform duration-(--duration-medium) group-open:rotate-45"
            />
          </summary>
          <div className="pb-6 text-[15px] leading-[1.65] text-neutral-600">{section.body}</div>
        </details>
      ))}
    </div>
  );
}
