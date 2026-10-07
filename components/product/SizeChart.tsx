"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { chartForPiece, sizeOrder, type Product } from "@/lib/products";

/**
 * Baroque's size chart: a "Size chart" link beside the size label opening a modal with the product
 * photo (arrows cycle the views) and one finished-measurement table per garment piece.
 */
export function SizeChart({ product }: { product: Product }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [photo, setPhoto] = useState(0);
  const tables = product.pieces
    .map((piece) => ({ piece, rows: chartForPiece(piece) }))
    .filter((t) => t.rows !== undefined);
  const turn = (step: number) => setPhoto((i) => (i + step + product.images.length) % product.images.length);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="caps text-[11px] font-bold text-black underline underline-offset-4 hover:text-neutral-600"
      >
        Size chart
      </button>

      <dialog
        ref={dialog}
        aria-label="Size chart"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-[1143px] overflow-hidden bg-white text-charcoal-body backdrop:bg-black/40"
      >
        <div className="relative flex h-14 items-center justify-center bg-ivory-base px-14">
          <h2 className="caps truncate text-label font-bold text-black">{product.name}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
            className="absolute right-2 top-2 flex size-10 items-center justify-center bg-black text-white hover:bg-neutral-800"
          >
            <X size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <div className="grid max-h-[calc(90vh-3.5rem)] grid-cols-1 gap-6 overflow-y-auto p-4 md:grid-cols-[1fr_1.1fr] md:gap-8 md:overflow-hidden md:p-8">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[2/3] overflow-hidden bg-ivory-base">
              <Image
                src={product.images[photo]}
                alt={`${product.name}, view ${photo + 1}`}
                fill
                sizes="(min-width: 768px) 450px, 90vw"
                className="object-cover object-top"
              />
            </div>
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => turn(-1)}
                  className="absolute left-0 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center bg-white/90 text-black hover:bg-white"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => turn(1)}
                  className="absolute right-0 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center bg-white/90 text-black hover:bg-white"
                >
                  <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
                </button>
              </>
            )}
          </div>

          <div className="space-y-8 md:max-h-[calc(90vh-7.5rem)] md:overflow-y-auto md:pr-2">
            {tables.map(({ piece, rows }) => (
              <section key={piece}>
                <h3 className="caps mb-3 text-center text-[11px] font-bold text-black">
                  {product.id} {piece}
                </h3>
                <table className="caps w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-ivory-base text-black">
                      <th scope="col" className="border border-neutral-200 px-2 py-1.5 text-left font-bold">
                        Size (inches)
                      </th>
                      {sizeOrder.map((size) => (
                        <th key={size} scope="col" className="border border-neutral-200 px-2 py-1.5 text-center font-bold">
                          {size}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows!.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className="border border-neutral-200 px-2 py-1.5 text-left font-normal text-neutral-700">
                          {row.label}
                        </th>
                        {row.values.map((value, i) => (
                          <td key={sizeOrder[i]} className="border border-neutral-200 px-2 py-1.5 text-center text-black">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
            <p className="text-[12px] text-neutral-500">
              Finished garment measurements. Between sizes? Choose Custom and the pattern is drafted
              to you at no extra cost.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
