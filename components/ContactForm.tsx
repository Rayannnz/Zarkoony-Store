"use client";

import { useState, type FormEvent } from "react";
import { Field, fieldClass, fieldLabelClass, invalidFields } from "./Field";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = invalidFields(event.currentTarget);
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    event.currentTarget.reset();
    setSent(true);
  };

  if (sent) {
    return (
      <p role="status" className="border border-neutral-200 bg-ivory-base p-6 text-[13px] text-neutral-600">
        Thank you. The concierge replies within one working day, Monday to Saturday.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" error={errors.name} />
        <Field label="E-mail" name="email" type="email" required autoComplete="email" error={errors.email} />
      </div>
      <label className="block">
        <span className={fieldLabelClass}>Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          aria-invalid={!!errors.message || undefined}
          className={fieldClass}
          placeholder="An occasion, a date, a fabric you have in mind..."
        />
        {errors.message && (
          <span role="alert" className="mt-1 block text-[12px] text-red-700">
            {errors.message}
          </span>
        )}
      </label>
      <button type="submit" className="btn-black">
        Send message
      </button>
    </form>
  );
}
