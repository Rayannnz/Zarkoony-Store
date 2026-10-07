import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import {
  facetKeys,
  facetValues,
  hasActiveFilters,
  listingQuery,
  priceRanges,
  runListing,
  type SearchParams,
} from "@/lib/catalog";
import { categories, type Product } from "@/lib/products";
import { Breadcrumbs, type Crumb } from "../Breadcrumbs";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";
import { FilterForm, type Facet } from "./FilterForm";

export type Pill = { label: string; href: string; active?: boolean };

type Props = {
  title: string;
  subtitle?: string;
  intro?: string;
  pills?: Pill[];
  banner?: { image: string; alt: string; focus: string };
  /** Rendered under the header; the search page puts its form here. */
  headerExtra?: ReactNode;
  products: Product[];
  searchParams: SearchParams;
  /** Where filter and pagination links point. */
  basePath: string;
  crumbs: Crumb[];
  /** Shown when the source set itself is empty (not when filters hide everything). */
  empty?: ReactNode;
};

export const headingClass =
  "caps text-title font-normal text-black";

const facetLabels = { type: "Garment", fabric: "Fabric", color: "Colour" } as const;

/** The pill row shared by /shop and /shop/[category]. */
export const shopPills = (active?: string): Pill[] => [
  { label: "All", href: "/shop", active: !active },
  { label: "New Arrivals", href: "/shop/new-arrivals", active: active === "new-arrivals" },
  ...categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}`, active: active === c.slug })),
];

export function Listing({
  title,
  subtitle,
  intro,
  pills,
  banner,
  headerExtra,
  products,
  searchParams,
  basePath,
  crumbs,
  empty,
}: Props) {
  const { params, items, page, pages, total } = runListing(products, searchParams);
  const baseQuery = params.q ? `?q=${encodeURIComponent(params.q)}` : "";

  const facets: Facet[] = facetKeys
    .map((key) => ({ key, label: facetLabels[key], options: facetValues(products, key) }))
    .filter((facet) => facet.options.length > 1);

  const chips = [
    ...facetKeys.flatMap((key) =>
      params[key].map((value) => ({
        label: value,
        href: basePath + listingQuery(params, { [key]: params[key].filter((v) => v !== value), page: 1 }),
      })),
    ),
    ...params.price.map((value) => ({
      label: priceRanges.find((r) => r.value === value)?.label ?? value,
      href: basePath + listingQuery(params, { price: params.price.filter((v) => v !== value), page: 1 }),
    })),
    ...(params.new ? [{ label: "New arrivals", href: basePath + listingQuery(params, { new: false, page: 1 }) }] : []),
  ];

  return (
    <div className="mx-auto max-w-[1920px] px-4 pb-16 md:px-10 md:pb-24 lg:px-14">
      <div className="py-4">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <header className="pb-8 text-center md:pb-10">
        <h1 className={headingClass}>{title}</h1>
        {subtitle && <p className="caps mt-2 text-xs text-neutral-500">{subtitle}</p>}
        {intro && <p className="mx-auto mt-4 max-w-2xl text-[15px] text-neutral-600">{intro}</p>}
        {pills && (
          <nav aria-label="Categories" className="caps mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px]">
            {pills.map((pill) => (
              <Link
                key={pill.href}
                href={pill.href}
                aria-current={pill.active ? "page" : undefined}
                className={`border-b pb-1 transition-colors duration-(--duration-fast) ${
                  pill.active ? "border-black text-black" : "border-transparent text-neutral-500 hover:text-black"
                }`}
              >
                {pill.label}
              </Link>
            ))}
          </nav>
        )}
        {headerExtra}
      </header>

      {banner && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden bg-neutral-900 md:aspect-[2.6/1]">
          <Image
            src={banner.image}
            alt={banner.alt}
            fill
            preload
            sizes="100vw"
            style={{ objectPosition: banner.focus }}
            className="object-cover"
          />
        </div>
      )}

      {products.length === 0 && empty ? (
        empty
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-14">
          <aside aria-label="Filters" className="lg:border-t lg:border-neutral-200">
            <FilterForm action={basePath} params={params} facets={facets} />
          </aside>

          <div className="lg:border-t lg:border-neutral-200 lg:pt-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pb-6">
              <p className="caps text-[11px] text-neutral-500">
                {total} {total === 1 ? "product" : "products"}
              </p>
              {chips.length > 0 && (
                <ul className="flex flex-wrap items-center gap-2">
                  {chips.map((chip) => (
                    <li key={chip.href}>
                      <Link
                        href={chip.href}
                        scroll={false}
                        className="caps inline-flex items-center gap-1.5 border border-neutral-300 px-2.5 py-1 text-[10px] text-black transition-colors duration-(--duration-fast) hover:border-black"
                      >
                        {chip.label}
                        <X size={12} strokeWidth={1.5} aria-hidden />
                        <span className="sr-only">(remove)</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={basePath + baseQuery} scroll={false} className="link-underline caps text-[10px] text-neutral-500">
                      Clear all
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {items.length === 0 ? (
              <div className="py-20 text-center">
                <p className="caps text-[11px] text-black">Nothing matches these filters</p>
                <p className="mt-3 text-[13px] text-neutral-500">
                  Every piece is made to order, so try a wider fabric or price range.
                </p>
                {hasActiveFilters(params) && (
                  <Link href={basePath + baseQuery} className="btn-black mt-6">
                    Clear filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3">
                {items.map((product, index) => (
                  <Reveal key={product.slug} index={index % 3}>
                    <ProductCard product={product} eager={index < 3} />
                  </Reveal>
                ))}
              </div>
            )}

            {pages > 1 && (
              <nav aria-label="Pagination" className="caps mt-14 flex items-center justify-center gap-5 text-[11px]">
                {page > 1 && (
                  <Link href={basePath + listingQuery(params, { page: page - 1 })} className="text-neutral-500 hover:text-black">
                    Previous
                  </Link>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={basePath + listingQuery(params, { page: n })}
                    aria-current={n === page ? "page" : undefined}
                    className={`border-b pb-0.5 ${
                      n === page ? "border-black text-black" : "border-transparent text-neutral-500 hover:text-black"
                    }`}
                  >
                    {n}
                  </Link>
                ))}
                {page < pages && (
                  <Link href={basePath + listingQuery(params, { page: page + 1 })} className="text-neutral-500 hover:text-black">
                    Next
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
