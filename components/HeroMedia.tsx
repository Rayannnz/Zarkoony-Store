"use client";

import Image from "next/image";
import { useCallback, useState, type ReactNode } from "react";

type Props = { src: string; alt: string; focus: string; children: ReactNode };

/**
 * Baroque's hero reveal: once the image has loaded it fades in while settling from 1.1 to 1
 * (0.8s, ease-out cubic), then the buttons fade in over the next 0.8s.
 */
export function HeroMedia({ src, alt, focus, children }: Props) {
  const [loaded, setLoaded] = useState(false);

  // A plain load listener: next/image's onLoad waits on img.decode(), which Chrome never
  // resolves for an already-cached image, so the reveal would skip on repeat visits.
  const watchLoad = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.complete) setLoaded(true);
    else img.addEventListener("load", () => setLoaded(true), { once: true });
  }, []);

  return (
    <>
      <Image
        ref={watchLoad}
        src={src}
        alt={alt}
        fill
        preload
        sizes="100vw"
        style={{ objectPosition: focus }}
        className={`object-cover brightness-[0.98] transition-[opacity,scale] duration-800 ease-[cubic-bezier(0.215,0.61,0.355,1)] motion-reduce:transition-none ${
          loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
      />
      {/* Scrim so the white header text and logo read over a bright ceiling. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 to-transparent" />
      <div
        className={`absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3 transition-opacity delay-800 duration-800 motion-reduce:transition-none md:bottom-12 md:gap-4 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
