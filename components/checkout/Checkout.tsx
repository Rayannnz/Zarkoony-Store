"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { facts } from "@/lib/content";
import {
  cartSubtotal,
  createOrder,
  DELIVERY_FEE,
  paymentMethods,
  provinces,
  stitchingWindow,
  type Address,
  type PaymentMethod,
} from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { Field, fieldClass, fieldLabelClass, invalidFields } from "../Field";
import { LineItem, Totals } from "../orders/OrderParts";
import { cartActions, orderActions, useCart, useHydrated, useSession } from "../Store";

const section = "space-y-4 border-t border-neutral-200 pt-6";
const sectionTitle = "caps text-label font-bold text-black";

/**
 * Mock checkout: validates with the browser, builds an order, stores it on this device and hands
 * off to the confirmation page. No payment is taken and no card details are ever requested.
 */
export function Checkout() {
  const cart = useCart();
  const hydrated = useHydrated();
  const session = useSession();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [express, setExpress] = useState(false);
  const [pending, setPending] = useState(false);

  if (!hydrated) {
    return (
      <div aria-busy="true" className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="skeleton h-96" />
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (cart.length === 0 && !pending) {
    return (
      <div className="py-16 text-center">
        <p className="caps text-[11px] text-black">Your cart is empty</p>
        <p className="mt-3 text-[13px] text-neutral-500">Add a piece before checking out.</p>
        <Link href="/shop" className="btn-black mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(cart);
  const expressFee = express ? facts.express.fee : 0;
  const total = subtotal + DELIVERY_FEE + expressFee;
  const window = express ? [facts.express.days, facts.express.days] : stitchingWindow(cart);
  const savedAddress = session?.addresses[0];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = invalidFields(form);
    setErrors(invalid);
    if (Object.keys(invalid).length) return;

    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const address: Address = {
      fullName: text("fullName"),
      phone: text("phone"),
      line1: text("line1"),
      line2: text("line2") || undefined,
      city: text("city"),
      province: text("province"),
      postcode: text("postcode") || undefined,
    };
    const order = createOrder(cart, {
      email: text("email"),
      address,
      payment: text("payment") as PaymentMethod,
      express,
    });

    setPending(true);
    orderActions.place(order);
    router.push(`/checkout/confirmation?order=${order.id}`);
    cartActions.clear();
  };

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className={sectionTitle}>Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="E-mail"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={session?.email}
              error={errors.email}
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+92 3XX XXXXXXX"
              defaultValue={savedAddress?.phone}
              error={errors.phone}
              hint="For fitting questions and delivery updates on WhatsApp."
            />
          </div>
        </section>

        <section className={section}>
          <h2 className={sectionTitle}>Delivery address</h2>
          <Field
            label="Full name"
            name="fullName"
            required
            autoComplete="name"
            defaultValue={savedAddress?.fullName ?? session?.name}
            error={errors.fullName}
          />
          <Field
            label="Address"
            name="line1"
            required
            autoComplete="address-line1"
            defaultValue={savedAddress?.line1}
            error={errors.line1}
          />
          <Field
            label="Apartment, floor, landmark (optional)"
            name="line2"
            autoComplete="address-line2"
            defaultValue={savedAddress?.line2}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              label="City"
              name="city"
              required
              autoComplete="address-level2"
              defaultValue={savedAddress?.city}
              error={errors.city}
            />
            <label className="block">
              <span className={fieldLabelClass}>Province</span>
              <select
                name="province"
                required
                defaultValue={savedAddress?.province ?? ""}
                aria-invalid={!!errors.province || undefined}
                className={`${fieldClass} cursor-pointer`}
              >
                <option value="" disabled>
                  Select
                </option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && (
                <span role="alert" className="mt-1 block text-[12px] text-red-700">
                  {errors.province}
                </span>
              )}
            </label>
            <Field
              label="Postcode (optional)"
              name="postcode"
              inputMode="numeric"
              autoComplete="postal-code"
              defaultValue={savedAddress?.postcode}
            />
          </div>
        </section>

        <section className={section}>
          <h2 className={sectionTitle}>Stitching</h2>
          <p className="text-[13px] text-neutral-600">
            Standard window for this order: {stitchingWindow(cart)[0]}–{stitchingWindow(cart)[1]}{" "}
            working days. {facts.stitchingNote}
          </p>
          <label className="flex cursor-pointer items-start gap-3 border border-neutral-200 p-4 transition-colors duration-(--duration-fast) has-checked:border-black">
            <input
              type="checkbox"
              name="express"
              checked={express}
              onChange={(event) => setExpress(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 appearance-none border border-neutral-400 bg-white checked:border-black checked:bg-black"
            />
            <span className="text-[13px] text-neutral-700">
              <span className="caps block text-[11px] text-black">
                Priority stitching · {formatPrice(facts.express.fee)}
              </span>
              Your commission moves to the front of the atelier and ships within {facts.express.days}{" "}
              working days.
            </span>
          </label>
        </section>

        <section className={section}>
          <h2 className={sectionTitle}>Payment</h2>
          <div role="radiogroup" aria-label="Payment method" className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className="flex cursor-pointer items-start gap-3 border border-neutral-200 p-4 transition-colors duration-(--duration-fast) has-checked:border-black"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  required
                  defaultChecked={method.value === "cod"}
                  className="mt-0.5 size-4 shrink-0 appearance-none border border-neutral-400 bg-white checked:border-4 checked:border-black"
                />
                <span className="text-[13px] text-neutral-700">
                  <span className="caps block text-[11px] text-black">{method.label}</span>
                  {method.detail}
                </span>
              </label>
            ))}
            <div className="flex items-start gap-3 border border-dashed border-neutral-200 p-4 text-neutral-400">
              <span className="mt-0.5 size-4 shrink-0 border border-neutral-300" aria-hidden />
              <span className="text-[13px]">
                <span className="caps block text-[11px]">Card payment</span>
                Coming soon. We never ask for card details on this page.
              </span>
            </div>
          </div>
          {errors.payment && (
            <p role="alert" className="text-[12px] text-red-700">
              Choose a payment method.
            </p>
          )}
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-neutral-200 p-6">
          <h2 className={sectionTitle}>Your commission</h2>
          <div className="mt-2 divide-y divide-neutral-200">
            {cart.map((line) => (
              <LineItem key={line.id} line={line} />
            ))}
          </div>
          <div className="mt-2 border-t border-neutral-200 pt-2">
            <Totals subtotal={subtotal} delivery={DELIVERY_FEE} expressFee={expressFee} total={total} />
          </div>
          <p className="mt-4 text-[13px] text-neutral-500">
            Stitching {window[0]}–{window[1]} working days, then {facts.deliveryPakistan.toLowerCase()}
          </p>
          <button type="submit" disabled={pending} className="btn-black mt-6 w-full disabled:opacity-60">
            {pending ? "Placing order…" : "Place order"}
          </button>
          <p className="mt-4 text-[12px] text-neutral-500">
            By placing an order you agree to our{" "}
            <Link href="/policies/terms" className="link-underline text-black">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/policies/refund" className="link-underline text-black">
              refund policy
            </Link>
            .
          </p>
        </div>
      </aside>
    </form>
  );
}
