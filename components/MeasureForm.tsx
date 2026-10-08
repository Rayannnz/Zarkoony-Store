"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { productBySlug } from "@/lib/catalog";
import {
  measurementFields,
  sizeOrder,
  standardSizes,
  type MeasureItem,
  type MeasurementKey,
  type Size,
} from "@/lib/products";
import type { CartLine } from "@/lib/orders";

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
 * Baroque's size row and quantity, then add to cart. Choosing Custom adds one step for the
 * measurements. Only the current step is rendered, so a hidden `required` field can never block
 * the submit, and each step validates itself natively before moving on.
 */
export function MeasureForm({ item, onConfirm, submitLabel = "Add to cart", sizeGuide }: Props) {
  const product = item.slug ? productBySlug(item.slug) : undefined;
  const sizes = product?.sizes ?? sizeOrder;

  const [measuring, setMeasuring] = useState(false);
  const [size, setSize] = useState<Choice | "">("");
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
    if (size === "Custom" && !measuring) return setMeasuring(true);
    setPending(true);
    const numbers = Object.fromEntries(
      Object.entries(measurements).map(([k, v]) => [k, Number(v)]),
    ) as Record<string, number>;
    const line = {
      slug: item.slug ?? "bespoke",
      name: item.title,
      image: product?.images[0] ?? "",
      price: item.price,
      size: size as Choice,
      measurements: size === "Custom" ? numbers : undefined,
      notes: notes.trim() || undefined,
      qty,
    };
    // A beat of "Adding…" so the button acknowledges the click, then the host takes over
    // (opens the cart) and the form is ready for another commission.
    setTimeout(() => {
      onConfirm(line);
      setPending(false);
      setMeasuring(false);
    }, 350);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {/* Keyed on the step so the panel remounts and @starting-style runs the entrance. */}
      <fieldset
        key={measuring ? "measure" : "size"}
        ref={panel}
        aria-label={measuring ? "Measurements" : "Size"}
        className="min-w-0 transition-[opacity,translate] duration-300 ease-out starting:translate-x-3 starting:opacity-0 motion-reduce:transition-none"
      >
        {!measuring ? (
          <>
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
          </>
        ) : (
          <>
            <div className="mb-4 flex items-baseline justify-between">
              <p className="caps text-[15px] text-neutral-600">Your measurements (inches)</p>
              <Link
                href="/made-to-order/measurement-guide"
                className="link-underline caps text-[13px] text-black"
              >
                How to measure
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {measurementFields.map((f) => (
                <label key={f.key} className="block">
                  <span className={fieldLabel}>{f.label}</span>
                  <input
                    type="number"
                    name={f.key}
                    inputMode="decimal"
                    step="0.25"
                    min={f.min}
                    max={f.max}
                    required
                    placeholder={f.placeholder}
                    value={measurements[f.key] ?? ""}
                    onChange={(e) => {
                      setMeasurements((m) => ({ ...m, [f.key]: e.target.value }));
                      setErrors((prev) => ({ ...prev, [f.key]: undefined }));
                    }}
                    aria-describedby={errors[f.key] ? `${f.key}-error` : undefined}
                    aria-invalid={!!errors[f.key]}
                    className={field}
                  />
                  {errors[f.key] && (
                    <span id={`${f.key}-error`} role="alert" className="mt-1 block text-[12px] text-red-700">
                      {errors[f.key] === "missing"
                        ? `Enter your ${f.label.toLowerCase()}.`
                        : `Between ${f.min} and ${f.max} inches.`}
                    </span>
                  )}
                </label>
              ))}
            </div>
            <label className="mt-4 block">
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
          </>
        )}
      </fieldset>

      <div className="space-y-3">
        {measuring && (
          <button
            type="button"
            onClick={() => setMeasuring(false)}
            className="caps block text-[13px] text-neutral-500 hover:text-black"
          >
            Back
          </button>
        )}
        <button type="submit" disabled={pending} className="btn-black w-full disabled:opacity-60">
          {pending ? "Adding…" : size === "Custom" && !measuring ? "Continue" : submitLabel}
        </button>
      </div>
    </form>
  );
}
