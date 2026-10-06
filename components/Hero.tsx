import Image from "next/image";
import { hero } from "@/lib/home";
import { Cta } from "./Cta";

export function Hero() {
  return (
    <section
      data-transparent-header
      className="relative w-full overflow-hidden bg-neutral-900 leading-none"
    >
      {/* The design has no visible page title, so the h1 is for search engines and screen readers. */}
      <h1 className="sr-only">{hero.heading}</h1>
      <div className="relative aspect-video max-h-[920px] min-h-[520px] w-full md:aspect-[2.1/1]">
        <Image
          src={hero.image}
          alt={hero.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[center_28%] brightness-[0.98]"
        />
        <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3 md:bottom-12 md:gap-4">
          {hero.ctas.map((cta) => (
            <Cta key={cta.label} cta={cta} className="btn-white" />
          ))}
        </div>
      </div>
    </section>
  );
}
