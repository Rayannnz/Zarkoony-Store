import type { BannerCta, Cta as CtaData } from "@/lib/home";
import { Trigger } from "./Overlays";

/** Button classes for each CTA variant (globals.css): filled black, filled white, or white outline. */
export const variantClass: Record<BannerCta["variant"], string> = {
  black: "btn-black",
  white: "btn-white",
  outline: "btn-white btn-outline",
};

/** Smaller text and padding below `sm`, so two long labels stay side by side on phones. */
export const phoneCompact = "max-sm:px-3 max-sm:text-[11px]";

export function Cta({ cta, className }: { cta: CtaData; className?: string }) {
  return "href" in cta ? (
    <a href={cta.href} className={className}>
      {cta.label}
    </a>
  ) : (
    <Trigger opens="measure" item={cta.item} className={className}>
      {cta.label}
    </Trigger>
  );
}
