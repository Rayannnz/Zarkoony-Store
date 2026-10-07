"use client";

import Link from "next/link";
import { productBySlug } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import { useHydrated, useWishlist } from "./Store";

export function WishlistView() {
  const slugs = useWishlist();
  const hydrated = useHydrated();
  const items = slugs.map(productBySlug).filter((p) => p !== undefined);

  if (!hydrated) {
    return (
      <div aria-busy="true" className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="caps text-[11px] text-black">Your wishlist is empty</p>
        <p className="mt-3 text-[13px] text-neutral-500">
          Tap the heart on any piece to keep it here while you decide.
        </p>
        <Link href="/shop" className="btn-black mt-8">
          Shop all
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.slug} product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
      ))}
    </div>
  );
}
