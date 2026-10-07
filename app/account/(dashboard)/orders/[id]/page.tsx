import type { Metadata } from "next";
import { OrderDetail } from "@/components/account/AccountPages";

export const metadata: Metadata = { title: "Order" };

// Orders live in the browser's storage, so every id renders and the client reports "not found".
export default async function OrderPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = await props.params;
  return <OrderDetail orderId={id} />;
}
