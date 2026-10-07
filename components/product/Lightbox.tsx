"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  images: string[];
  name: string;
  /** Slide to open on, or null when closed. */
  index: number | null;
  onClose: () => void;
};

/**
 * Baroque's full-screen viewer, natively: a modal <dialog> holding a scroll-snap strip. Arrow
 * buttons and keys scroll one slide; swiping does the same on touch. Clicking a photo doubles it
 * and lets you pan by dragging; clicking the white margin or pressing Escape closes.
 */
export function Lightbox({ images, name, index, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element || index === null) return;
    element.showModal();
    strip.current?.scrollTo({ left: index * strip.current.clientWidth, behavior: "instant" });
    setCurrent(index);
  }, [index]);

  const goTo = (i: number) => {
    const el = strip.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, i));
    setZoomed(null);
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") goTo(current + 1);
    if (event.key === "ArrowLeft") goTo(current - 1);
  };

  /** Where the contained photo actually sits inside its box (the <img> box includes the margins). */
  const onPhoto = (event: MouseEvent<HTMLDivElement>) => {
    const img = event.currentTarget.querySelector("img");
    if (!img?.naturalWidth) return true;
    const box = img.getBoundingClientRect();
    const scale = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const left = box.left + (box.width - w) / 2;
    const top = box.top + (box.height - h) / 2;
    const { clientX: x, clientY: y } = event;
    return x >= left && x <= left + w && y >= top && y <= top + h;
  };

  /** Photo click: zoom in around the point, or back out. Margin click: close. A drag is neither. */
  const onClick = (event: MouseEvent<HTMLDivElement>, i: number) => {
    if (drag.current?.moved) return;
    if (zoomed === i) return setZoomed(null);
    if (!onPhoto(event)) return dialog.current?.close();
    const slide = event.currentTarget.parentElement!;
    const rect = slide.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setZoomed(i);
    // Once the scale applies, keep the clicked point under the cursor.
    requestAnimationFrame(() => slide.scrollTo({ left: x, top: y, behavior: "instant" }));
  };

  return (
    <dialog
      ref={dialog}
      aria-label={`${name} photos`}
      onClose={() => {
        setZoomed(null);
        onClose();
      }}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-white text-black"
    >
      <ol
        ref={strip}
        onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <li
            key={src + i}
            className={`relative h-full w-screen shrink-0 snap-center ${
              zoomed === i ? "overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "overflow-hidden"
            }`}
          >
            <div
              onClick={(event) => onClick(event, i)}
              onPointerDown={(event) => {
                // Mouse drag pans the zoomed photo; touch keeps the native scroll.
                if (zoomed !== i || event.pointerType === "touch") return;
                const slide = event.currentTarget.parentElement!;
                drag.current = { x: event.clientX, y: event.clientY, left: slide.scrollLeft, top: slide.scrollTop, moved: false };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const d = drag.current;
                if (!d) return;
                const dx = event.clientX - d.x;
                const dy = event.clientY - d.y;
                if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
                event.currentTarget.parentElement!.scrollTo({ left: d.left - dx, top: d.top - dy, behavior: "instant" });
              }}
              onPointerUp={() => {
                // The click handler reads `moved` first; the drag is forgotten right after.
                setTimeout(() => (drag.current = null), 0);
              }}
              className={`relative h-full w-full ${
                zoomed === i ? "cursor-magnify-out origin-top-left scale-200 select-none" : "cursor-magnify"
              }`}
            >
              <Image
                src={src}
                alt={i === 0 ? name : `${name}, view ${i + 1}`}
                fill
                sizes="100vw"
                draggable={false}
                className="object-contain"
              />
            </div>
          </li>
        ))}
      </ol>

      <p className="caps absolute left-4 top-4 text-[11px] text-neutral-500" aria-live="polite">
        {current + 1} / {images.length}
      </p>

      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous photo"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
          className="flex size-11 items-center justify-center border border-neutral-300 bg-white text-black transition-colors hover:border-black disabled:opacity-30"
        >
          <ChevronLeft size={18} strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Close gallery"
          onClick={() => dialog.current?.close()}
          className="flex size-14 items-center justify-center bg-black text-white transition-colors hover:bg-neutral-800"
        >
          <X size={20} strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          disabled={current === images.length - 1}
          onClick={() => goTo(current + 1)}
          className="flex size-11 items-center justify-center border border-neutral-300 bg-white text-black transition-colors hover:border-black disabled:opacity-30"
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </dialog>
  );
}
