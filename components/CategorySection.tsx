import Image from "next/image";
import Link from "next/link";
import type { CategoryCard } from "@/lib/home";
import { Cta } from "./Cta";
import { Section } from "./Section";

type Props = {
  id: string;
  title: string;
  cards: CategoryCard[];
  className?: string;
  /** Set on the section right under the hero, where the cards can be the LCP element. */
  eager?: boolean;
};

export function CategorySection({ id, title, cards, className, eager }: Props) {
  return (
    <Section id={id} title={title} className={className}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
        {cards.map((card) => (
          <div
            key={card.image}
            className="group relative aspect-[3/4] overflow-hidden bg-[#F6F5F2] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5.2]"
          >
            {/* The photo leads to its category; the button on top keeps its own destination. */}
            <Link
              href={card.href}
              aria-label={card.alt}
              className="absolute inset-0 block focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src={card.image}
                alt=""
                fill
                loading={eager ? "eager" : "lazy"}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-[8s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-120"
              />
            </Link>
            <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center md:bottom-8">
              <Cta cta={card.cta} className="btn-white" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
