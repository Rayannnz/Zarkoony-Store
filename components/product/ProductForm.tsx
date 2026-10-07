"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { sizeChart, sizeOrder, type Product } from "@/lib/products";
import { MeasureForm } from "../MeasureForm";
import { useOverlays } from "../Overlays";
import { WishlistButton } from "../WishlistButton";

/** The size and measurement flow, the size-guide dialog and the wishlist toggle. */
export function ProductForm({ product }: { product: Product }) {
  const { addToCart } = useOverlays();
  const guide = useRef<HTMLDialogElement>(null);

  return (
    <div className="space-y-6">
      <MeasureForm
        item={{ slug: product.slug, title: product.name, price: product.price }}
        onConfirm={addToCart}
      />

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => guide.current?.showModal()}
          className="link-underline caps text-[11px] text-black"
        >
          Size guide
        </button>
        <WishlistButton
          slug={product.slug}
          name={product.name}
          size={18}
          className="caps flex items-center gap-2 text-[11px]"
        />
      </div>

      <dialog
        ref={guide}
        aria-label="Size guide"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto bg-white p-6 text-charcoal-body backdrop:bg-black/40 md:p-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="caps text-[11px] text-neutral-500">Standard atelier sizes</p>
            <h2 className="mt-1 font-serif text-xl text-black">Size guide</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => guide.current?.close()}
            className="-m-2 p-2 text-neutral-500 hover:text-black"
          >
            <X size={24} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <p className="mt-4 text-[13px] text-neutral-600">
          Body measurements in inches. Between sizes, or outside them? Choose Custom and the pattern
          is drafted to you at no extra cost.
        </p>
        <table className="caps mt-6 w-full text-[11px]">
          <thead>
            <tr className="border-b border-neutral-300 text-neutral-500">
              <th scope="col" className="py-2 text-left font-normal">
                Size
              </th>
              {sizeOrder.map((size) => (
                <th key={size} scope="col" className="py-2 text-center font-bold text-black">
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.map((row) => (
              <tr key={row.label} className="border-b border-neutral-200">
                <th scope="row" className="py-2.5 text-left font-normal text-neutral-600">
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td key={sizeOrder[i]} className="py-2.5 text-center text-black">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </dialog>
    </div>
  );
}
