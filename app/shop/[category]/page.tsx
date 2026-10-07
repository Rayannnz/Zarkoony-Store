import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listing, shopPills } from "@/components/shop/Listing";
import { categoryBySlug, productsInCategory } from "@/lib/catalog";
import { categories } from "@/lib/products";

const newArrivals = {
  slug: "new-arrivals",
  name: "New Arrivals",
  description: "The latest silhouettes to leave the atelier, each one stitched to order.",
  image: categories[0].image,
};

const resolve = (slug: string) => (slug === newArrivals.slug ? newArrivals : categoryBySlug(slug));

export const dynamicParams = false;

export function generateStaticParams() {
  return [newArrivals.slug, ...categories.map((c) => c.slug)].map((category) => ({ category }));
}

export async function generateMetadata(props: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const data = resolve(category);
  if (!data) return {};
  return {
    title: data.name,
    description: data.description,
    openGraph: { images: [{ url: data.image, alt: data.name }] },
  };
}

export default async function CategoryPage(props: PageProps<"/shop/[category]">) {
  const [{ category }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const data = resolve(category);
  if (!data) notFound();

  return (
    <Listing
      title={data.name}
      subtitle="Custom stitched · Made to order"
      intro={data.description}
      pills={shopPills(category)}
      products={productsInCategory(category as Parameters<typeof productsInCategory>[0])}
      searchParams={searchParams}
      basePath={`/shop/${category}`}
      crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: data.name }]}
    />
  );
}
