"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { standardSizes } from "@/lib/products";
import { Field, fieldClass, fieldLabelClass, invalidFields } from "./Field";

const MIN_PICTURES = 2;
const MAX_PICTURES = 3;
const MAX_BYTES = 10 * 1024 * 1024;

const timeFrames = [
  "Within 2 weeks (priority stitching)",
  "3 to 4 weeks",
  "5 to 8 weeks",
  "2 to 3 months",
  "Flexible",
];

/**
 * The quote request for a design the customer brings in. Pictures are previewed from object URLs
 * and mirrored into the file input (via DataTransfer) so the browser's own validation covers them;
 * like the contact form, a valid submit only shows the confirmation (nothing is sent anywhere).
 */
export function CustomOrderForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [pictures, setPictures] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => pictures.map((file) => URL.createObjectURL(file)), [pictures]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  /** Keeps the input's FileList and validity in step with the previews. */
  const syncInput = (files: File[]) => {
    const input = fileInput.current;
    if (!input) return;
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
    input.setCustomValidity(
      files.length < MIN_PICTURES || files.length > MAX_PICTURES
        ? "Add two or three pictures."
        : files.some((file) => file.size > MAX_BYTES)
          ? "Each picture must be under 10 MB."
          : "",
    );
  };
  useEffect(() => syncInput([]), []);

  const addPictures = (list: FileList | null) => {
    const next = [...pictures, ...Array.from(list ?? [])]
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, MAX_PICTURES);
    setPictures(next);
    syncInput(next);
    setErrors((prev) => ({ ...prev, pictures: "" }));
  };

  const removePicture = (index: number) => {
    const next = pictures.filter((_, i) => i !== index);
    setPictures(next);
    syncInput(next);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = invalidFields(event.currentTarget);
    if (invalid.size) invalid.size = "Choose a size, or Custom.";
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    event.currentTarget.reset();
    setPictures([]);
    setSent(true);
  };

  if (sent) {
    return (
      <p role="status" className="border border-neutral-200 bg-ivory-base p-6 text-[13px] text-neutral-600">
        Quote request received. The concierge replies within one working day with a price, fabric
        options and a stitching timeline.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <span className={fieldLabelClass}>Pictures of the design (2 to 3)</span>
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            addPictures(event.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-8 text-center transition-colors hover:border-black has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black ${
            errors.pictures ? "border-red-700" : "border-neutral-300"
          } ${pictures.length >= MAX_PICTURES ? "hidden" : ""}`}
        >
          <ImagePlus size={22} strokeWidth={1.5} aria-hidden className="text-neutral-500" />
          <span className="text-[13px] text-neutral-600">
            Add pictures: the front, the back and a close-up of the work
          </span>
          <span className="caps text-[10px] text-neutral-400">JPG or PNG, up to 10 MB each</span>
          <input
            ref={fileInput}
            type="file"
            name="pictures"
            accept="image/*"
            multiple
            aria-describedby="pictures-note"
            aria-invalid={!!errors.pictures || undefined}
            onChange={(event) => addPictures(event.target.files)}
            className="sr-only"
          />
        </label>
        {pictures.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-3">
            {pictures.map((file, index) => (
              <li key={previews[index]} className="relative aspect-[3/4] overflow-hidden bg-ivory-base">
                <Image src={previews[index]} alt={file.name} fill unoptimized className="object-cover" />
                <button
                  type="button"
                  aria-label={`Remove picture ${index + 1}`}
                  onClick={() => removePicture(index)}
                  className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center bg-black text-white hover:bg-neutral-800"
                >
                  <X size={14} strokeWidth={1.5} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
        <span
          id="pictures-note"
          role={errors.pictures ? "alert" : undefined}
          className={`mt-1 block text-[12px] ${errors.pictures ? "text-red-700" : "text-neutral-500"}`}
        >
          {errors.pictures || `${pictures.length} of ${MAX_PICTURES} added`}
        </span>
      </div>

      <div>
        <span className={fieldLabelClass}>Size</span>
        <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2.5">
          {standardSizes.map(({ size }) => (
            <label
              key={size}
              className="relative flex h-11 min-w-12 cursor-pointer items-center justify-center border border-neutral-200 px-3 transition-colors hover:border-black has-checked:border-black has-checked:bg-black has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black"
            >
              <input
                type="radio"
                name="size"
                value={size}
                required
                onChange={() => setErrors((prev) => ({ ...prev, size: "" }))}
                className="sr-only"
              />
              <span className="caps text-label">{size}</span>
            </label>
          ))}
        </div>
        <span role={errors.size ? "alert" : undefined} className={`mt-1 block text-[12px] ${errors.size ? "text-red-700" : "text-neutral-500"}`}>
          {errors.size || "Choose Custom and measurements are taken after the quote, at no extra cost."}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" error={errors.name} />
        <Field
          label="Contact number"
          name="phone"
          type="tel"
          inputMode="tel"
          required
          minLength={7}
          pattern="[0-9+\s()-]{7,}"
          autoComplete="tel"
          placeholder="+92 3xx xxxxxxx"
          error={errors.phone}
        />
        <Field label="E-mail" name="email" type="email" required autoComplete="email" error={errors.email} />
        <label className="block">
          <span className={fieldLabelClass}>Time frame</span>
          <select
            name="timeFrame"
            required
            defaultValue=""
            aria-invalid={!!errors.timeFrame || undefined}
            onChange={() => setErrors((prev) => ({ ...prev, timeFrame: "" }))}
            className={`${fieldClass} h-12`}
          >
            <option value="" disabled>
              When do you need it?
            </option>
            {timeFrames.map((frame) => (
              <option key={frame} value={frame}>
                {frame}
              </option>
            ))}
          </select>
          {errors.timeFrame && (
            <span role="alert" className="mt-1 block text-[12px] text-red-700">
              {errors.timeFrame}
            </span>
          )}
        </label>
      </div>

      <label className="block">
        <span className={fieldLabelClass}>Address</span>
        <textarea
          name="address"
          required
          minLength={10}
          rows={2}
          autoComplete="street-address"
          aria-invalid={!!errors.address || undefined}
          className={fieldClass}
          placeholder="House, street, city"
        />
        {errors.address && (
          <span role="alert" className="mt-1 block text-[12px] text-red-700">
            {errors.address}
          </span>
        )}
      </label>

      <label className="block">
        <span className={fieldLabelClass}>Notes (optional)</span>
        <textarea
          name="notes"
          rows={3}
          className={fieldClass}
          placeholder="Fabric, colour, budget, the occasion..."
        />
      </label>

      <button type="submit" className="btn-black w-full">
        Get a Quote
      </button>
    </form>
  );
}
