"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { productBySlug } from "@/lib/catalog";
import {
  groupsForPieces,
  measurementFields,
  sizeOrder,
  standardSizes,
  type MeasureItem,
  type MeasurementKey,
  type Size,
} from "@/lib/products";
import type { CartLine } from "@/lib/orders";
import { diagrams } from "./MeasureDiagrams";

const groupTitles = { top: "Kameez", bottom: "Trouser" } as const;

type Props = {
  item: MeasureItem;
  /** Called with the finished line; the host adds it to the cart and decides what to show next. */
  onConfirm: (line: Omit<CartLine, "id">) => void;
  submitLabel?: string;
  /** Replaces the size-guide page link, e.g. the product page's per-piece size chart. */
  sizeGuide?: ReactNode;
};

type Choice = Size | "Custom";

const fieldLabel = "caps mb-1 block text-[12px] text-neutral-600";
// 16px on phones so iOS doesn't zoom the page on focus.
const field =
  "w-full border border-neutral-200 bg-white px-3 py-2.5 text-base text-black outline-hidden transition-colors focus:border-black user-invalid:border-red-700 sm:text-[15px]";

/**
 * Baroque's size row, then add to cart. Choosing Custom reveals the measurement guide inline
 * between the size row and the quantity. The guide only mounts while Custom is chosen, so its
 * required nearest-size radio can never block a standard-size submit.
 */
export function MeasureForm({ item, onConfirm, submitLabel = "Add to cart", sizeGuide }: Props) {
  const product = item.slug ? productBySlug(item.slug) : undefined;
  const sizes = product?.sizes ?? sizeOrder;
  // Bespoke commissions (no product) get both diagrams.
  const groups = product ? groupsForPieces(product.pieces) : groupsForPieces(["Kurta", "Trouser"]);

  const [size, setSize] = useState<Choice | "">("");
  const [base, setBase] = useState<Size | "">("");
  const [measurements, setMeasurements] = useState<Partial<Record<MeasurementKey, string>>>({});
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [pending, setPending] = useState(false);
  const panel = useRef<HTMLFieldSetElement>(null);

  /** Native validation of the current step; focuses the first invalid control. */
  const validate = () => {
    const controls = [...(panel.current?.elements ?? [])] as HTMLInputElement[];
    const invalid = controls.filter((c) => "checkValidity" in c && !c.checkValidity());
    const next: Record<string, string> = {};
    for (const control of invalid) next[control.name] = control.validity.valueMissing ? "missing" : "range";
    setErrors(next);
    invalid[0]?.focus();
    return invalid.length === 0;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setPending(true);
    // Only the measurements the customer changed; the rest follow the base size.
    const numbers = Object.fromEntries(
      Object.entries(measurements)
        .filter(([, v]) => v !== "")
        .map(([k, v]) => [k, Number(v)]),
    ) as Record<string, number>;
    const line = {
      slug: item.slug ?? "bespoke",
      name: item.title,
      image: product?.images[0] ?? "",
      price: item.price,
      size: size as Choice,
      base: size === "Custom" && base ? base : undefined,
      measurements: size === "Custom" ? numbers : undefined,
      notes: notes.trim() || undefined,
      qty,
    };
    // A beat of "Adding…" so the button acknowledges the click, then the host takes over
    // (opens the cart) and the form is ready for another commission.
    setTimeout(() => {
      onConfirm(line);
      setPending(false);
    }, 350);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <fieldset ref={panel} aria-label="Size" className="min-w-0">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="caps text-[15px] text-neutral-600">Size</p>
              {sizeGuide ?? (
                <Link
                  href="/made-to-order/size-guide"
                  className="link-underline caps text-[13px] text-black"
                >
                  Size guide
                </Link>
              )}
            </div>
            <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2.5">
              {standardSizes
                .filter((s) => s.size === "Custom" || sizes.includes(s.size))
                .map(({ size: value }) => (
                  <label
                    key={value}
                    className="relative flex h-11 min-w-12 cursor-pointer items-center justify-center border border-neutral-200 px-3 transition-colors hover:border-black has-checked:border-black has-checked:bg-black has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black"
                  >
                    <input
                      type="radio"
                      name="size"
                      value={value}
                      required
                      checked={size === value}
                      onChange={() => {
                        setSize(value);
                        setErrors({});
                      }}
                      className="sr-only"
                    />
                    <span className="caps text-[15px]">{value}</span>
                  </label>
                ))}
            </div>
            {errors.size && (
              <p role="alert" className="mt-3 text-[13px] text-red-700">
                Choose a size, or Custom.
              </p>
            )}
        {/* The guide appears as soon as Custom is chosen; the block mounts so @starting-style runs. */}
        {size === "Custom" && (
          <div className="mt-6 min-w-0 transition-[opacity,translate] duration-300 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none">
            <div className="mb-4 flex items-baseline justify-between">
              <p className="caps text-[15px] text-neutral-600">Custom size (inches)</p>
              <Link
                href="/made-to-order/measurement-guide"
                className="link-underline caps text-[13px] text-black"
              >
                How to measure
              </Link>
            </div>

            <div className="bg-ivory-base px-4 py-3 text-[12px] leading-relaxed text-charcoal-body">
              <p className="caps mb-1 text-[11px] font-semibold text-black">Note</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Give finished garment measurements, not body measurements: what the stitched piece should measure, laid flat.</li>
                <li>Choose your nearest size, then fill in only the measurements you want changed. Everything else follows that size.</li>
                <li>Changes to a custom-stitched order are accepted within 3 days of placing it, once the atelier confirms.</li>
                <li>All measurements in inches.</li>
              </ul>
            </div>

            <div className="mt-5">
              <p className="caps mb-2 text-[12px] text-neutral-600">
                Nearest size <span aria-hidden>*</span>
              </p>
              <div role="radiogroup" aria-label="Nearest size" className="flex flex-wrap gap-2">
                {sizes.map((value) => (
                  <label
                    key={value}
                    className="relative flex h-9 min-w-11 cursor-pointer items-center justify-center border border-neutral-200 px-2.5 transition-colors hover:border-black has-checked:border-black has-checked:bg-black has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black"
                  >
                    <input
                      type="radio"
                      name="base"
                      value={value}
                      required
                      checked={base === value}
                      onChange={() => {
                        setBase(value);
                        setErrors((prev) => ({ ...prev, base: undefined }));
                      }}
                      className="sr-only"
                    />
                    <span className="caps text-[13px]">{value}</span>
                  </label>
                ))}
              </div>
              {errors.base && (
                <p role="alert" className="mt-2 text-[13px] text-red-700">
                  Choose the standard size closest to you.
                </p>
              )}
            </div>

            {groups.map((group) => {
              const Diagram = diagrams[group];
              return (
                <div key={group} className="mt-6">
                  <p className="caps mb-3 text-[12px] text-neutral-600">{groupTitles[group]}</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:gap-3">
                    <Diagram className="mx-auto h-auto w-full max-w-[220px] text-black" />
                    <div className="space-y-2">
                      {measurementFields
                        .filter((f) => f.group === group)
                        .map((f) => (
                          <label key={f.key} className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-x-2">
                            <span className="caps text-[11px] leading-tight text-black">{f.label}</span>
                            <input
                              type="number"
                              name={f.key}
                              inputMode="decimal"
                              step="0.25"
                              min={f.min}
                              max={f.max}
                              placeholder={f.placeholder}
                              value={measurements[f.key] ?? ""}
                              onChange={(e) => {
                                setMeasurements((m) => ({ ...m, [f.key]: e.target.value }));
                                setErrors((prev) => ({ ...prev, [f.key]: undefined }));
                              }}
                              aria-describedby={errors[f.key] ? `${f.key}-error` : undefined}
                              aria-invalid={!!errors[f.key]}
                              className={`${field} h-9 py-0 text-center`}
                            />
                            {errors[f.key] && (
                              <span id={`${f.key}-error`} role="alert" className="col-span-2 text-[12px] text-red-700">
                                Between {f.min} and {f.max} inches.
                              </span>
                            )}
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <label className="mt-5 block">
              <span className={fieldLabel}>Notes (optional)</span>
              <textarea
                name="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Modest neckline, full sleeve lining, extra flare..."
                className={field}
              />
            </label>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between">
          <p className="caps text-[15px] text-neutral-600">Quantity</p>
          <div className="flex items-center border border-neutral-200">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-neutral-600 hover:text-black"
            >
              −
            </button>
            <span className="min-w-8 text-center text-black">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(5, q + 1))}
              className="px-3 py-2 text-neutral-600 hover:text-black"
            >
              +
            </button>
          </div>
        </div>
      </fieldset>

      <button type="submit" disabled={pending} className="btn-black w-full disabled:opacity-60">
        {pending ? "Adding…" : submitLabel}
      </button>
    </form>
  );
}
