import Image from "next/image";
import { formatPrice, type Product } from "@/lib/products";
import { Trigger } from "./Overlays";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-[#F7F6F3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover object-top"
        />
        <span className="caps absolute left-2.5 top-2.5 bg-white px-2 py-1 text-[10px] text-black">
          {product.badge}
        </span>
      </div>
      <div className="space-y-1 text-center">
        <h3 className="font-serif text-[14px] font-normal tracking-wide text-neutral-900 transition-colors group-hover:text-champagne-gold md:text-[15px]">
          {/* The ::after stretches the button over the whole card. */}
          <Trigger
            opens="measure"
            item={{ title: product.name, price: product.price }}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Trigger>
        </h3>
        <p className="caps text-[13px] font-bold text-black">{formatPrice(product.price)}</p>
        <span className="caps inline-block text-[10px] text-neutral-400">
          Dispatch: {product.dispatch}
        </span>
      </div>
    </article>
  );
}
