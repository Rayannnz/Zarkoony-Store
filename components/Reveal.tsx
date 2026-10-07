"use client";

import { useEffect, useRef, type ComponentProps, type CSSProperties } from "react";

/**
 * Fades its content up once it scrolls into view. The hidden state lives in globals.css and only
 * applies when scripts run and motion is allowed, so nothing can stay invisible.
 * `index` staggers siblings by 80ms each.
 */
export function Reveal({ index = 0, style, ...props }: ComponentProps<"div"> & { index?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.setAttribute("data-inview", "");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      style={{ ...style, "--i": index } as CSSProperties}
      {...props}
    />
  );
}
