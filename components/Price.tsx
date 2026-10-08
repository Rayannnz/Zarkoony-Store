import type { ReactNode } from "react";
import { formatPrice, formatUsd } from "@/lib/products";

/**
 * Region-dependent content without client state: both versions are in the HTML and
 * app/globals.css shows the one matching `<html data-region>`, which the inline script in
 * app/layout.tsx sets before first paint (region cookie from proxy.ts or the header chooser,
 * else the time zone). Server components can use it, and nothing flashes on load.
 */
export function Regional({ pk, us }: { pk: ReactNode; us: ReactNode }) {
  return (
    <>
      <span className="region-pk">{pk}</span>
      <span className="region-us">{us}</span>
    </>
  );
}

/** A PKR amount, shown in USD to the United States. */
export const Price = ({ value }: { value: number }) => <Regional pk={formatPrice(value)} us={formatUsd(value)} />;
