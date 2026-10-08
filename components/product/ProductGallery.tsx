"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

/**
 * One image at a time: a horizontal scroll-snap strip (swipeable on phones, peeking the next
 * photo) that the sticky thumbnail rail slides from the tablet breakpoint up. Proportions follow
 * Baroque: a 56px rail, 80px gap, 2:3 images. Clicking a photo opens the full-screen viewer.
 */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const id = (index: number) => `media-${index + 1}`;
  const [open, setOpen] = useState<number | null>(null);

  const show = (index: number) =>
    document.getElementById(id(index))?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });

  return (
    <div className="md:grid md:grid-cols-[56px_1fr] md:gap-10 lg:gap-20">
      <ol
        aria-label="Gallery thumbnails"
        className="hidden md:sticky md:top-24 md:flex md:flex-col md:gap-5 md:self-start"
      >
        {images.map((src, index) => (
          <li key={src + index}>
            {/* The href keeps the thumbnails working without JS; the handler avoids the page jump. */}
            <a
              href={`#${id(index)}`}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              onClick={(event) => {
                event.preventDefault();
                show(index);
              }}
              className="relative block aspect-[2/3] overflow-hidden border border-transparent bg-ivory-base transition-colors duration-(--duration-fast) hover:border-black focus-visible:border-black"
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover object-top" />
            </a>
          </li>
        ))}
      </ol>

      <ol
        aria-label={`${name} images`}
        className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:gap-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, index) => (
          <li
            key={src + index}
            id={id(index)}
            className="relative aspect-[3/4] w-[85vw] shrink-0 snap-center overflow-hidden bg-ivory-base md:aspect-[2/3] md:w-full md:snap-start"
          >
            <button
              type="button"
              aria-label={`Open image ${index + 1} of ${images.length} full screen`}
              onClick={() => setOpen(index)}
              className="cursor-magnify absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black"
            >
              <Image
                src={src}
                alt={index === 0 ? name : `${name}, view ${index + 1}`}
                fill
                preload={index === 0}
                sizes="(min-width: 1024px) 640px, 85vw"
                className="object-cover object-top"
              />
            </button>
          </li>
        ))}
      </ol>

      <Lightbox images={images} name={name} index={open} onClose={() => setOpen(null)} />
    </div>
  );
}
