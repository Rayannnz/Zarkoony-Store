import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/orders/OrderConfirmation";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function ConfirmationPage(props: PageProps<"/checkout/confirmation">) {
  const { order } = await props.searchParams;
  // Read on the server and passed down, so no useSearchParams Suspense boundary is needed.
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-10 md:py-20">
      <OrderConfirmation orderId={typeof order === "string" ? order : ""} />
    </div>
  );
}
