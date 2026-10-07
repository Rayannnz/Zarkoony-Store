import type { ComponentProps, ReactNode } from "react";

export const fieldClass =
  "w-full border border-neutral-200 bg-white px-3 py-2.5 text-base text-black outline-hidden transition-colors duration-(--duration-fast) focus:border-black user-invalid:border-red-700 aria-invalid:border-red-700 sm:text-[15px]";

export const fieldLabelClass = "caps mb-1 block text-[11px] text-neutral-600";

/** Which controls in `form` fail native validation, keyed by name, with a readable reason. */
export function invalidFields(form: HTMLFormElement) {
  const errors: Record<string, string> = {};
  let first: HTMLElement | undefined;
  for (const element of form.elements) {
    const control = element as HTMLInputElement;
    if (!control.name || typeof control.checkValidity !== "function" || control.checkValidity()) continue;
    const v = control.validity;
    errors[control.name] = v.valueMissing
      ? "This field is required."
      : v.typeMismatch && control.type === "email"
        ? "Enter a valid e-mail address."
        : v.patternMismatch || v.typeMismatch
          ? "Check the format of this field."
          : v.tooShort
            ? `At least ${control.minLength} characters.`
            : control.validationMessage;
    first ??= control;
  }
  first?.focus();
  return errors;
}

type Props = Omit<ComponentProps<"input">, "className"> & {
  label: string;
  name: string;
  error?: string;
  hint?: ReactNode;
};

/** Label, input and inline error; validation itself is the browser's. */
export function Field({ label, name, error, hint, ...input }: Props) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input
        name={name}
        aria-invalid={!!error || undefined}
        aria-describedby={error || hint ? `${name}-note` : undefined}
        className={`${fieldClass} h-12`}
        {...input}
      />
      {(error || hint) && (
        <span id={`${name}-note`} role={error ? "alert" : undefined} className={`mt-1 block text-[12px] ${error ? "text-red-700" : "text-neutral-500"}`}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
}
