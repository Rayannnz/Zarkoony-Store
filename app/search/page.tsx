import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";
import { Listing } from "@/components/shop/Listing";
import { parseListingParams, searchProducts } from "@/lib/catalog";
import { popularSearches } from "@/lib/site";

export const metadata: Metadata = { title: "Search" };

function SearchForm({ q }: { q: string }) {
  return (
    <Form action="/search" className="mx-auto mt-6 flex max-w-xl items-center gap-4 border-b border-neutral-300 pb-2 focus-within:border-black">
      <Search size={20} strokeWidth={1.5} aria-hidden className="shrink-0 text-neutral-500" />
      <input
        type="text"
        name="q"
        defaultValue={q}
        enterKeyHint="search"
        aria-label="Search the archive"
        placeholder="Search for a fabric, colour or garment..."
        className="caps min-w-0 flex-1 bg-transparent py-2 text-base text-black outline-hidden placeholder:text-neutral-400 sm:text-[15px]"
      />
      <button type="submit" className="caps text-[11px] text-black">
        Search
      </button>
    </Form>
  );
}

function Popular() {
  return (
    <div className="caps mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-neutral-500">
      <span>Popular:</span>
      {popularSearches.map((item) => (
        <Link key={item.label} href={item.href} className="link-underline text-black">
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const { q } = parseListingParams(searchParams);
  const results = q ? searchProducts(q) : [];

  return (
    <Listing
      title="Search"
      subtitle={q ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${q}”` : undefined}
      headerExtra={
        <>
          <SearchForm q={q} />
          {!q && <Popular />}
        </>
      }
      products={results}
      searchParams={searchParams}
      basePath="/search"
      crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      empty={
        <div className="py-12 text-center">
          {q ? (
            <>
              <p className="caps text-[11px] text-black">No results for “{q}”</p>
              <p className="mx-auto mt-3 max-w-md text-[13px] text-neutral-500">
                Try a fabric (velvet, organza), a colour, an occasion (bridal, Eid) or a garment
                (kalidar, peshwas, sharara).
              </p>
              <Popular />
              <Link href="/shop" className="btn-black mt-8">
                Browse everything
              </Link>
            </>
          ) : (
            <p className="caps text-[11px] text-neutral-500">Type to search the couture archive</p>
          )}
        </div>
      }
    />
  );
}
