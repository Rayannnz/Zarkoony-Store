"use client";

import { useState } from "react";
import Form from "next/form";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  listingQuery,
  priceRanges,
  sortOptions,
  type FacetKey,
  type ListingParams,
  type SortKey,
} from "@/lib/catalog";

export type Facet = { key: FacetKey; label: string; options: { value: string; count: number }[] };

const checkbox =
  "size-4 shrink-0 appearance-none border border-neutral-400 bg-white transition-colors checked:border-black checked:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

/** A facet, closed by default like Baroque's so the sidebar stays quiet. */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-neutral-200">
      <summary className="caps flex cursor-pointer list-none items-center justify-between py-3.5 text-[11px] text-black [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown size={16} strokeWidth={1.5} aria-hidden className="transition-transform duration-(--duration-medium) group-open:rotate-180" />
      </summary>
      <ul className="space-y-2.5 pb-4">{children}</ul>
    </details>
  );
}

/**
 * "Sort by" sits in the toolbar but belongs to the sidebar form (`form="listing-filters"`), so it
 * submits through next/form with the filters. It submits itself on change because the form's own
 * handler can't see a control outside its subtree; keyed on the value so chip links reset it.
 */
export function SortSelect({ value }: { value: SortKey }) {
  return (
    <label className="flex items-center gap-3">
      <span className="caps text-[11px] text-black">Sort by</span>
      <select
        key={value}
        form="listing-filters"
        name="sort"
        defaultValue={value}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="caps cursor-pointer bg-transparent text-[11px] text-neutral-600 outline-hidden focus-visible:text-black"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Filters as a GET form: every change resubmits through next/form, which navigates on the client
 * without scrolling to the top. The listing page re-reads the URL and re-renders.
 */
export function FilterForm({
  action,
  params,
  facets,
}: {
  action: string;
  params: ListingParams;
  facets: Facet[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="listing-filters"
        className="caps flex w-full items-center justify-between border-b border-neutral-200 py-3 text-[11px] text-black lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} strokeWidth={1.5} aria-hidden />
          Filter
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden
          className={`transition-transform duration-(--duration-medium) ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Keyed on the URL state so chips and "clear" links reset the uncontrolled inputs. */}
      <Form
        key={listingQuery(params)}
        id="listing-filters"
        action={action}
        scroll={false}
        replace
        onChange={(event) => event.currentTarget.requestSubmit()}
        className={`${open ? "block" : "hidden"} lg:block`}
      >
        {params.q && <input type="hidden" name="q" value={params.q} />}

        {facets.map((facet) => (
          <Group key={facet.key} label={facet.label}>
            {facet.options.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-3 text-[13px] text-neutral-700 hover:text-black">
                  <input
                    type="checkbox"
                    name={facet.key}
                    value={option.value}
                    defaultChecked={params[facet.key].includes(option.value)}
                    className={checkbox}
                  />
                  <span className="flex-1">{option.value}</span>
                  <span className="text-[11px] text-neutral-400">{option.count}</span>
                </label>
              </li>
            ))}
          </Group>
        ))}

        <Group label="Price">
          {priceRanges.map((range) => (
            <li key={range.value}>
              <label className="flex cursor-pointer items-center gap-3 text-[13px] text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  name="price"
                  value={range.value}
                  defaultChecked={params.price.includes(range.value)}
                  className={checkbox}
                />
                {range.label}
              </label>
            </li>
          ))}
        </Group>

        <label className="flex cursor-pointer items-center gap-3 py-4 text-[13px] text-neutral-700 hover:text-black">
          <input type="checkbox" name="new" value="1" defaultChecked={params.new} className={checkbox} />
          New arrivals only
        </label>

        <noscript>
          <button type="submit" className="btn-black w-full">
            Apply
          </button>
        </noscript>
      </Form>
    </>
  );
}
