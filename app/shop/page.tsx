import type { Metadata } from "next";
import { Listing, shopPills } from "@/components/shop/Listing";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Every ZARKOONY piece, custom stitched and made to order: formals, bridal, festive and luxury prêt, cut to your measurements.",
};

export default async function ShopPage(props: PageProps<"/shop">) {
  const searchParams = await props.searchParams;
  return (
    <Listing
      title="Shop All"
      subtitle="Custom stitched · Made to order"
      pills={shopPills()}
      products={products}
      searchParams={searchParams}
      basePath="/shop"
      crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
    />
  );
}
