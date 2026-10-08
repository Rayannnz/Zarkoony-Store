"use client";

import { countries } from "@/lib/orders";
import { regionActions, useRegion } from "./Store";

/** The buttons in the header's country popover: the choice is remembered in the region cookie. */
export function RegionChooser() {
  const region = useRegion();
  return (
    <div className="mt-6 grid gap-3">
      {countries.map((c) => (
        <button
          key={c.code}
          type="button"
          popoverTarget="country-menu"
          popoverTargetAction="hide"
          aria-pressed={region === c.code}
          onClick={() => regionActions.set(c.code)}
          className={region === c.code ? "btn-black" : "btn-white !border-black !text-black"}
        >
          {c.label} · {c.currency}
        </button>
      ))}
    </div>
  );
}
