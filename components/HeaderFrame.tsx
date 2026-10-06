"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The header is `data-solid` once the 1px sentinel above it (the announcement bar's bottom edge)
 * has scrolled out of view, which is when the sticky header is actually stuck.
 */
export function HeaderFrame({ className, children }: { className: string; children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      header.current?.toggleAttribute("data-solid", !entry.isIntersecting);
    });
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="-mb-px h-px" />
      <header ref={header} className={className}>
        {children}
      </header>
    </>
  );
}
