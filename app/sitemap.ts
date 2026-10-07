import type { MetadataRoute } from "next";
import { categories, collections, products } from "@/lib/products";
import { site } from "@/lib/site";

const staticPaths = [
  "/",
  "/shop",
  "/shop/new-arrivals",
  "/collections",
  "/made-to-order",
  "/made-to-order/measurement-guide",
  "/made-to-order/size-guide",
  "/about",
  "/contact",
  "/faq",
  "/shipping",
  "/returns",
  "/policies/privacy",
  "/policies/refund",
  "/policies/shipping",
  "/policies/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
  });

  return [
    ...staticPaths.map((path) => entry(path)),
    ...categories.map((c) => entry(`/shop/${c.slug}`)),
    ...collections.map((c) => entry(`/collections/${c.slug}`)),
    ...products.map((p) => entry(`/product/${p.slug}`, p.createdAt)),
  ];
}
