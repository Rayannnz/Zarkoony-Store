import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Section } from "./Section";

type Props = { id: string; title: string; subtitle?: string; subtitleHref?: string; products: Product[] };

export function ProductGrid({ id, title, subtitle, subtitleHref, products }: Props) {
  return (
    <Section id={id} title={title} subtitle={subtitle} subtitleHref={subtitleHref} className="pt-8 pb-16 md:pt-14 md:pb-24">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </Section>
  );
}
