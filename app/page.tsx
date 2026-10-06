import { CategorySection } from "@/components/CategorySection";
import { CollectionBanner } from "@/components/CollectionBanner";
import { Hero } from "@/components/Hero";
import { MadeToOrder } from "@/components/MadeToOrder";
import { ProductGrid } from "@/components/ProductGrid";
import { essentials, formals, newArrivals, ownYourLook, signature } from "@/lib/home";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection {...ownYourLook} eager className="pt-14 pb-12 md:pt-20 md:pb-16" />
      <CollectionBanner {...signature} />
      <CategorySection {...formals} />
      <CollectionBanner {...essentials} />
      <ProductGrid {...newArrivals} products={products} />
      <MadeToOrder />
    </>
  );
}
