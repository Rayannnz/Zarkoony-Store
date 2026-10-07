"use client";

import { useEffect, useRef, type ReactNode } from "react";

const HEADER_GAP = 96; // sticky header (80px) + 16px
const BOTTOM_GAP = 24;

/**
 * The product info column sticks under the header while the gallery scrolls. When the column is
 * taller than the viewport (short laptops, the measurements step, open accordions) a plain
 * `top` offset would hide its lower part until the gallery ends, so the offset is lowered until
 * the column's bottom sits just above the viewport's bottom instead: scrolling down reveals the
 * whole column and then holds it there.
 */
export function StickyColumn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const top = Math.min(HEADER_GAP, window.innerHeight - element.offsetHeight - BOTTOM_GAP);
      element.style.setProperty("--sticky-top", `${top}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="lg:sticky lg:top-(--sticky-top,6rem) lg:self-start">
      {children}
    </div>
  );
}
