"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { productBySlug } from "@/lib/catalog";
import {
  formatPrice,
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
};

type Step = "size" | "measure" | "review";
type Choice = Size | "Custom";

const stepLabels: Record<Step, string> = { size: "Size", measure: "Measurements", review: "Review" };

const fieldLabel = "caps mb-1 block text-[11px] text-neutral-600";
// 16px on phones so iOS doesn't zoom the page on focus.
const field =
  "w-full border border-neutral-300 bg-white px-3 py-2.5 text-base text-black outline-hidden transition-colors focus:border-black user-invalid:border-red-700 sm:text-[15px]";

/**
 * Size → (measurements) → review → confirm. Only the current step is rendered, so a hidden
 * `required` field can never block the submit, and each step validates itself before moving on.
 */
export function MeasureForm({ item, onConfirm, submitLabel = "Add to cart" }: Props) {
  const product = item.slug ? productBySlug(item.slug) : undefined;
  const sizes = product?.sizes ?? sizeOrder;

  const [step, setStep] = useState<Step>("size");
  const [size, setSize] = useState<Choice | "">("");
  const [measurements, setMeasurements] = useState<Partial<Record<MeasurementKey, string>>>({});
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [pending, setPending] = useState(false);
  const panel = useRef<HTMLFieldSetElement>(null);

  const steps: Step[] = size === "Custom" ? ["size", "measure", "review"] : ["size", "review"];

  /** Native validation of the current step; focuses the first invalid control. */
  const validateStep = () => {
    const controls = [...(panel.current?.elements ?? [])] as HTMLInputElement[];
    const invalid = controls.filter((c) => "checkValidity" in c && !c.checkValidity());
    const next: Record<string, string> = {};
    for (const control of invalid) next[control.name] = control.validity.valueMissing ? "missing" : "range";
    setErrors(next);
    invalid[0]?.focus();
    return invalid.length === 0;
  };

  const advance = () => {
    if (!validateStep()) return;
    const index = steps.indexOf(step);
    setStep(steps[index + 1]);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (step !== "review") return advance();
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
      setStep("size");
    }, 350);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <ol className="caps flex items-center gap-3 text-[11px] text-neutral-400">
        {steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 ${s === step ? "text-black" : ""}`}>
            {i > 0 && <span aria-hidden className="h-px w-5 bg-neutral-300" />}
            <span>
              {i + 1}. {stepLabels[s]}
            </span>
          </li>
        ))}
      </ol>

      {/* Keyed on the step so the panel remounts and @starting-style runs the entrance. */}
      <fieldset
        key={step}
        ref={panel}
        aria-label={stepLabels[step]}
        className="min-w-0 transition-[opacity,translate] duration-300 ease-out starting:translate-x-3 starting:opacity-0 motion-reduce:transition-none"
      >
        {step === "size" && (
          <>
            <div className="mb-4 flex items-baseline justify-between">
              <p className="caps text-[11px] text-neutral-600">Select size</p>
              <Link
                href="/made-to-order/size-guide"
                className="link-underline caps text-[11px] text-black"
              >
                Size guide
              </Link>
            </div>
            {/* Baroque's row of 44px boxes; the bust-per-size detail lives in the size guide. */}
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
                    <span className="caps text-[13px]">{value}</span>
                  </label>
                ))}
            </div>
            {errors.size && (
              <p role="alert" className="mt-3 text-[13px] text-red-700">
                Please choose a standard size or custom measurements.
              </p>
            )}
            <p className="mt-4 text-[13px] text-neutral-600">
              {size === "Custom"
                ? "Enter your measurements on the next step. Our master karigar drafts the pattern to them, and post-stitch adjustments are complimentary."
                : "Standard sizes follow the atelier block in the size guide. Choose Custom to have the pattern drafted to your own measurements at no extra cost."}
            </p>
          </>
        )}

        {step === "measure" && (
          <>
            <p className="caps mb-1 text-[11px] text-neutral-600">
              Your measurements (inches)
            </p>
            <p className="mb-5 text-[13px] text-neutral-600">
              Measure over light clothing with the tape level and relaxed.{" "}
              <Link href="/made-to-order/measurement-guide" className="link-underline text-black">
                How to measure
              </Link>
            </p>
            {/* `items-start` keeps the inputs level when one hint wraps and its neighbour doesn't. */}
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
                    aria-describedby={`${f.key}-hint`}
                    aria-invalid={!!errors[f.key]}
                    className={field}
                  />
                  <span id={`${f.key}-hint`} className="mt-1 block text-[12px] text-neutral-500">
                    {errors[f.key] ? (
                      <span role="alert" className="text-red-700">
                        {errors[f.key] === "missing"
                          ? `Enter your ${f.label.toLowerCase()}.`
                          : `Between ${f.min} and ${f.max} inches.`}
                      </span>
                    ) : (
                      f.hint
                    )}
                  </span>
                </label>
              ))}
            </div>
            <label className="mt-5 block">
              <span className={fieldLabel}>Styling notes (optional)</span>
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

        {step === "review" && (
          <>
            <p className="caps mb-4 text-[11px] text-neutral-600">Review your commission</p>
            <dl className="divide-y divide-neutral-200 border-y border-neutral-200 text-[13px]">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="caps text-[11px] text-neutral-500">Garment</dt>
                <dd className="font-serif text-[15px] text-black">{item.title}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="caps text-[11px] text-neutral-500">Size</dt>
                <dd className="flex items-center gap-3">
                  <span className="caps text-[13px] font-bold text-black">{size}</span>
                  <button
                    type="button"
                    onClick={() => setStep("size")}
                    className="link-underline text-neutral-500"
                  >
                    Edit
                  </button>
                </dd>
              </div>
              {size === "Custom" && (
                <div className="py-3">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="caps text-[11px] text-neutral-500">Measurements</dt>
                    <button
                      type="button"
                      onClick={() => setStep("measure")}
                      className="link-underline text-neutral-500"
                    >
                      Edit
                    </button>
                  </div>
                  <dd className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-neutral-700 sm:grid-cols-4">
                    {measurementFields.map((f) => (
                      <span key={f.key} className="flex justify-between gap-2">
                        <span className="text-neutral-500">{f.label}</span>
                        <span className="text-black">{measurements[f.key]}&quot;</span>
                      </span>
                    ))}
                  </dd>
                  {notes.trim() && <dd className="mt-2 text-neutral-700">Notes: {notes.trim()}</dd>}
                </div>
              )}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="caps text-[11px] text-neutral-500">Quantity</dt>
                <dd className="flex items-center border border-neutral-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-black">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(5, q + 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black"
                  >
                    +
                  </button>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="caps text-[11px] text-neutral-500">Total</dt>
                <dd className="caps text-[13px] font-bold text-black">{formatPrice(item.price * qty)}</dd>
              </div>
            </dl>
          </>
        )}
      </fieldset>

      <div className="space-y-3">
        {step !== "size" && (
          <button
            type="button"
            onClick={() => setStep(steps[steps.indexOf(step) - 1])}
            className="caps block text-[11px] text-neutral-500 hover:text-black"
          >
            Back
          </button>
        )}
        <button type="submit" disabled={pending} className="btn-black w-full disabled:opacity-60">
          {step === "review" ? (pending ? "Adding…" : submitLabel) : "Continue"}
        </button>
      </div>
    </form>
  );
}
