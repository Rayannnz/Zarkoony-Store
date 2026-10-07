import { hero } from "@/lib/home";
import { Cta } from "./Cta";
import { HeroMedia } from "./HeroMedia";

export function Hero() {
  return (
    <section
      data-transparent-header
      className="relative w-full overflow-hidden bg-neutral-900 leading-none"
    >
      {/* The design has no visible page title, so the h1 is for search engines and screen readers. */}
      <h1 className="sr-only">{hero.heading}</h1>
      <div className="relative aspect-video max-h-[920px] min-h-[520px] w-full md:aspect-[2.1/1]">
        <HeroMedia src={hero.image} alt={hero.alt} focus={hero.focus}>
          {hero.ctas.map((cta) => (
            <Cta key={cta.label} cta={cta} className="btn-white" />
          ))}
        </HeroMedia>
      </div>
    </section>
  );
}
