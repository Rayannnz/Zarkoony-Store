import Image from "next/image";
import Link from "next/link";
import { formatPrice, stitchingLabel, type Product } from "@/lib/products";
import { WishlistButton } from "./WishlistButton";

type Props = {
  product: Product;
  sizes?: string;
  /** For cards that can be the LCP element. */
  eager?: boolean;
};

export function ProductCard({ product, sizes = "(min-width: 1024px) 33vw, 50vw", eager }: Props) {
  const [primary, secondary] = product.images;

  return (
    <article className="group relative flex flex-col">
      <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-ivory-base">
        <Image
          src={primary}
          alt={product.name}
          fill
          sizes={sizes}
          loading={eager ? "eager" : undefined}
          className="object-cover object-top"
        />
        {/* Baroque's second-image cross-fade; `group-hover` only applies on devices that hover. */}
        {secondary && (
          <Image
            src={secondary}
            alt=""
            fill
            sizes={sizes}
            className="object-cover object-top opacity-0 transition-opacity duration-(--duration-slow) group-hover:opacity-100 motion-reduce:transition-none"
          />
        )}
        <span className="caps absolute left-2.5 top-2.5 bg-white px-2 py-1 text-[10px] text-black">
          {product.badge}
        </span>
        <WishlistButton
          slug={product.slug}
          name={product.name}
          className="absolute right-1.5 top-1.5 z-10 p-1.5"
        />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="font-serif text-[14px] font-normal tracking-wide text-neutral-900 transition-colors duration-(--duration-fast) group-hover:text-champagne-gold md:text-[15px]">
          {/* The ::after stretches the link over the whole card. */}
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="caps text-[13px] font-bold text-black">
          {product.compareAtPrice && (
            <span className="mr-2 font-normal text-neutral-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          {formatPrice(product.price)}
        </p>
        <span className="caps inline-block text-[10px] text-neutral-400">
          Made to order · {stitchingLabel(product)}
        </span>
      </div>
    </article>
  );
}
