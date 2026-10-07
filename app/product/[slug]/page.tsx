import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductAccordions } from "@/components/product/ProductAccordions";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductGallery } from "@/components/product/ProductGallery";
import { categoryBySlug, collectionBySlug, productBySlug, relatedProducts } from "@/lib/catalog";
import { formatPrice, products, stitchingLabel } from "@/lib/products";

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

const assurances = (stitching: string) => [
  "Made to order",
  `Stitched in ${stitching}`,
  "Custom measurements included",
  "Complimentary alterations",
];

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const category = categoryBySlug(product.category);
  const collection = product.collection ? collectionBySlug(product.collection) : undefined;

  return (
    // Baroque's product page is a centred 1260px container, not the full-width shell.
    <div className="mx-auto max-w-[1376px] px-4 md:px-10 lg:px-14">
      <div className="py-4">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* 413px info column 80px from the image, as measured on Baroque. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_413px] lg:gap-20">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="caps text-[11px] text-neutral-500">
            {category?.name}
            {collection && ` · ${collection.name}`}
          </p>
          <h1 className="caps mt-2 text-[15px] font-normal leading-[1.7] text-black">{product.name}</h1>
          <p className="caps mt-3 text-[15px] font-bold text-black">
            {product.compareAtPrice && (
              <span className="mr-3 font-normal text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {formatPrice(product.price)}
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">
            {product.id.toUpperCase()} · {product.pieces.length}{" "}
            {product.pieces.length === 1 ? "piece" : "pieces"}
          </p>

          <ul className="caps my-6 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-neutral-200 py-3 text-[10px] text-neutral-600">
            {assurances(stitchingLabel(product)).map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>

          {product.availability === "limited" && (
            <p className="mb-6 bg-ivory-base p-4 text-[13px] text-neutral-700">
              Limited commissions this season. A bridal salon consultation is booked with you after
              ordering, and two fittings are included.
            </p>
          )}

          <ProductForm product={product} />

          <div className="mt-8">
            <ProductAccordions product={product} />
          </div>
        </div>
      </div>

      <ProductGrid id="related" title="You may also like" products={relatedProducts(product)} />
    </div>
  );
}
