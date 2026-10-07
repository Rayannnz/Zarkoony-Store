import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { headingClass } from "@/components/shop/Listing";
import { productsInCollection } from "@/lib/catalog";
import { collections } from "@/lib/products";

export const metadata: Metadata = {
  title: "Collections",
  description: "ZARKOONY's named collections: Signature, Luxury Edit, Velvet Winter and the Eid Edit.",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-[1920px] px-4 pb-16 md:px-10 md:pb-24 lg:px-14">
      <div className="py-4">
        <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      </div>
      <header className="pb-8 text-center md:pb-12">
        <h1 className={headingClass}>Collections</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] text-neutral-600">
          Curated edits from the atelier. Every piece in every collection is cut and stitched to
          your measurements after you order.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
        {collections.map((collection, index) => (
          <Reveal key={collection.slug} index={index % 2}>
            <Link
              href={`/collections/${collection.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-ivory-base sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5.2]"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                loading={index < 2 ? "eager" : "lazy"}
                sizes="(min-width: 768px) 50vw, 100vw"
                style={{ objectPosition: collection.focus }}
                className="object-cover transition-transform duration-[8s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-120"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-6 pb-8 pt-20 text-center text-white md:px-10 md:pb-10">
                <h2 className="caps text-[15px] md:text-lg">{collection.name}</h2>
                <p className="caps mt-2 text-[10px] text-white/80">
                  {collection.tagline} · {productsInCollection(collection.slug).length} pieces
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
