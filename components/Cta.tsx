import type { Cta as CtaData } from "@/lib/home";
import { Trigger } from "./Overlays";

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
