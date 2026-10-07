"use client";

import Link from "next/link";
import { cartSubtotal, DELIVERY_FEE, stitchingWindow } from "@/lib/orders";
import { facts } from "@/lib/content";
import { LineItem, Totals } from "../orders/OrderParts";
import { Stepper } from "../Overlays";
import { cartActions, useCart, useHydrated } from "../Store";

export function CartView() {
  const cart = useCart();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div aria-busy="true" className="space-y-5">
        {[0, 1].map((i) => (
          <div key={i} className="skeleton h-28" />
        ))}
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="caps text-[11px] text-black">Your cart is empty</p>
        <p className="mt-3 text-[13px] text-neutral-500">
          Every piece is stitched to order, so there is no stock to run out of.
        </p>
        <Link href="/shop" className="btn-black mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(cart);
  const window = stitchingWindow(cart);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {cart.map((line) => (
          <LineItem key={line.id} line={line}>
            <div className="mt-3 flex items-center justify-between">
              <Stepper
                qty={line.qty}
                onChange={(qty) => cartActions.setQty(line.id, qty)}
                disabled={line.size === "Custom"}
              />
              <button
                type="button"
                onClick={() => cartActions.remove(line.id)}
                className="link-underline text-[13px] text-neutral-500"
              >
                Remove
              </button>
            </div>
          </LineItem>
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-neutral-200 p-6">
          <h2 className="caps text-label font-bold text-black">Summary</h2>
          <div className="mt-4">
            <Totals subtotal={subtotal} delivery={DELIVERY_FEE} total={subtotal + DELIVERY_FEE} />
          </div>
          <p className="mt-4 text-[13px] text-neutral-500">
            Stitching: {window[0]}–{window[1]} working days after confirmation. {facts.deliveryPakistan}
          </p>
          <Link href="/checkout" className="btn-black mt-6 w-full">
            Checkout
          </Link>
          <Link href="/shop" className="link-underline caps mt-5 inline-block text-[11px] text-neutral-500">
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}
