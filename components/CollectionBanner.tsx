import Image from "next/image";
import Link from "next/link";
import type { BannerCta } from "@/lib/home";
import { Cta } from "./Cta";
import { Section } from "./Section";

type Props = {
  id: string;
  title: string;
  image: string;
  alt: string;
  /** Where the photo leads (the collection or category it shows). */
  href: string;
  /** CSS object-position for the campaign image. */
  focus: string;
  align: "left" | "right";
  ctas: BannerCta[];
};

export function CollectionBanner({ id, title, image, alt, href, focus, align, ctas }: Props) {
  return (
    <Section id={id} title={title}>
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 md:aspect-[2.1/1]">
        <Link
          href={href}
          aria-label={alt}
          className="absolute inset-0 block focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            style={{ objectPosition: focus }}
            className="object-cover brightness-[0.98]"
          />
        </Link>
        {/* Smaller text and padding below `sm` so two long labels stay on one line on phones. */}
        <div
          className={`absolute bottom-4 z-20 flex items-center gap-1 sm:bottom-6 md:bottom-10 ${
            align === "left" ? "left-4 sm:left-6 md:left-12" : "right-4 sm:right-6 md:right-12"
          }`}
        >
          {ctas.map((cta) => (
            <Cta
              key={cta.label}
              cta={cta}
              className={`${cta.variant === "black" ? "btn-black" : "btn-white"} max-sm:px-3 max-sm:text-[11px] max-sm:tracking-[0.12em]`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
