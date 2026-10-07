"use client";

import type { Product } from "@/lib/products";
import { MeasureForm } from "../MeasureForm";
import { useOverlays } from "../Overlays";
import { WishlistButton } from "../WishlistButton";
import { SizeChart } from "./SizeChart";

/** The size and measurement flow (with the per-piece size chart) and the wishlist toggle. */
export function ProductForm({ product }: { product: Product }) {
  const { addToCart } = useOverlays();

  return (
    <div className="space-y-6">
      <MeasureForm
        item={{ slug: product.slug, title: product.name, price: product.price }}
        onConfirm={addToCart}
        sizeGuide={<SizeChart product={product} />}
      />
      <div className="flex justify-end">
        <WishlistButton
          slug={product.slug}
          name={product.name}
          size={18}
          className="caps flex items-center gap-2 text-[11px]"
        />
      </div>
    </div>
  );
}
