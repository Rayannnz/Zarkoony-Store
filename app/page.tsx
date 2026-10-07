import { CategorySection } from "@/components/CategorySection";
import { CollectionBanner } from "@/components/CollectionBanner";
import { Hero } from "@/components/Hero";
import { MadeToOrder } from "@/components/MadeToOrder";
import { ProductGrid } from "@/components/ProductGrid";
import { essentials, formals, newArrivals, ownYourLook, signature } from "@/lib/home";
import { productsInCategory } from "@/lib/catalog";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection {...ownYourLook} eager className="pt-14 pb-12 md:pt-20 md:pb-16" />
      <CollectionBanner {...signature} />
      <CategorySection {...formals} />
      <CollectionBanner {...essentials} />
      <ProductGrid {...newArrivals} products={productsInCategory("new-arrivals").slice(0, 4)} />
      <MadeToOrder />
    </>
  );
}
