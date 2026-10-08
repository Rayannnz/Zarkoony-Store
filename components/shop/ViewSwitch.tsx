"use client";

import type { ReactNode } from "react";
import { useView, viewActions, type View } from "../Store";

/** An n×n grid of filled squares in an 18px box: the listing's view icons. */
function Squares({ n }: { n: number }) {
  const gap = 2;
  const size = (18 - gap * (n - 1)) / n;
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      {Array.from({ length: n * n }, (_, i) => (
        <rect
          key={i}
          x={(i % n) * (size + gap)}
          y={Math.floor(i / n) * (size + gap)}
          width={size}
          height={size}
        />
      ))}
    </svg>
  );
}

function Group({
  className,
  current,
  options,
  onPick,
}: {
  className: string;
  current: number;
  options: readonly number[];
  onPick: (n: number) => void;
}) {
  return (
    <div className={`items-center ${className}`}>
      {options.map((n) => (
        <button
          key={n}
          type="button"
          aria-pressed={current === n}
          aria-label={`${n} per row`}
          onClick={() => onPick(n)}
          className={`p-2 transition-colors duration-(--duration-fast) ${
            current === n ? "text-black" : "text-neutral-400 hover:text-black"
          }`}
        >
          <Squares n={n} />
        </button>
      ))}
    </div>
  );
}

/** Baroque's layout switch: 1 or 2 per row on phones, 2, 3 or 4 from the sidebar breakpoint. */
export function ViewSwitch() {
  const view = useView();
  return (
    <>
      <Group
        className="flex lg:hidden"
        current={view.mobile}
        options={[1, 2]}
        onPick={(n) => viewActions.set({ mobile: n as View["mobile"] })}
      />
      <Group
        className="hidden lg:flex"
        current={view.desktop}
        options={[2, 3, 4]}
        onPick={(n) => viewActions.set({ desktop: n as View["desktop"] })}
      />
    </>
  );
}

// Literal class names so Tailwind generates them.
const mobileClass = { 1: "grid-cols-1", 2: "grid-cols-2" } as const;
const desktopClass = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;

/** The product grid; its column count follows the switch. Children are the server-rendered cards. */
export function ViewGrid({ children }: { children: ReactNode }) {
  const view = useView();
  return (
    <div
      className={`grid gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 ${mobileClass[view.mobile]} ${desktopClass[view.desktop]}`}
    >
      {children}
    </div>
  );
}
