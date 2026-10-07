import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { headingClass } from "@/components/shop/Listing";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1920px] px-4 pb-16 md:px-10 md:pb-24 lg:px-14">
      <div className="py-4">
        <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      </div>
      <h1 className={`${headingClass} pb-8 text-center md:pb-10`}>Wishlist</h1>
      <WishlistView />
    </div>
  );
}
