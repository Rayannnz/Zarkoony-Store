import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listing } from "@/components/shop/Listing";
import { collectionBySlug, productsInCollection } from "@/lib/catalog";
import { collections } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const collection = collectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    openGraph: { images: [{ url: collection.image, alt: collection.name }] },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const collection = collectionBySlug(slug);
  if (!collection) notFound();

  return (
    <Listing
      title={collection.name}
      subtitle={collection.tagline}
      intro={collection.description}
      banner={{ image: collection.image, alt: collection.name, focus: collection.focus }}
      products={productsInCollection(collection.slug)}
      searchParams={searchParams}
      basePath={`/collections/${slug}`}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Collections", href: "/collections" },
        { label: collection.name },
      ]}
    />
  );
}
