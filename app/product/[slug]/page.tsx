import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductAccordions } from "@/components/product/ProductAccordions";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductGallery } from "@/components/product/ProductGallery";
import { StickyColumn } from "@/components/product/StickyColumn";
import { productBySlug, relatedProducts } from "@/lib/catalog";
import { formatPrice, products } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = productBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [{ url: product.images[0], alt: product.name }] },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = productBySlug(slug);
  if (!product) notFound();

  return (
    // Baroque's product page: a centred 1260px container, the gallery and a 413px info column
    // holding only title, price, SKU, the size row, quantity, add to cart and four accordions.
    <div className="mx-auto max-w-[1376px] px-4 pt-6 md:px-10 md:pt-10 lg:px-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_413px] lg:gap-20">
        <ProductGallery images={product.images} name={product.name} />

        <StickyColumn>
          <h1 className="caps text-product font-normal text-[#818589]">{product.name}</h1>
          <p className="caps mt-3 text-[13px] font-bold text-black">
            {product.compareAtPrice && (
              <span className="mr-3 font-normal text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {formatPrice(product.price)}
          </p>
          <p className="caps mt-1 border-b border-neutral-200 pb-5 text-[10px] text-neutral-500">
            {product.id} · {product.pieces.length} {product.pieces.length === 1 ? "piece" : "pieces"}
          </p>

          <div className="mt-6">
            <ProductForm product={product} />
          </div>

          <div className="mt-8">
            <ProductAccordions product={product} />
          </div>
        </StickyColumn>
      </div>

      <ProductGrid id="related" title="You may also like" products={relatedProducts(product)} />
    </div>
  );
}
