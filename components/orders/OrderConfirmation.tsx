"use client";

import Link from "next/link";
import { facts } from "@/lib/content";
import { formatDate, paymentMethods, sampleOrders } from "@/lib/orders";
import { site } from "@/lib/site";
import { LineItem, OrderTimeline, Totals } from "./OrderParts";
import { useHydrated, useOrders } from "../Store";

/** Reads the order from this device's storage; the server only knows the id. */
export function OrderConfirmation({ orderId }: { orderId: string }) {
  const orders = useOrders();
  const hydrated = useHydrated();
  const order = [...orders, ...sampleOrders].find((o) => o.id === orderId);

  if (!hydrated) {
    return <div aria-busy="true" className="skeleton mx-auto h-80 max-w-3xl" />;
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="caps text-[11px] text-black">Order not found</p>
        <p className="mx-auto mt-3 max-w-md text-[13px] text-neutral-500">
          {orderId ? `We could not find order ${orderId} on this device.` : "No order was specified."}{" "}
          Orders are listed in your account, or the concierge can look one up for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/orders" className="btn-black">
            My orders
          </Link>
          <Link href="/contact" className="btn-white !border-black !text-black">
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  const payment = paymentMethods.find((m) => m.value === order.payment);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b border-neutral-200 pb-8 text-center">
        <p className="caps text-[11px] text-champagne-gold">Commission confirmed</p>
        <h1 className="mt-3 caps text-title font-normal text-black">Thank you, {order.address.fullName.split(" ")[0]}.</h1>
        <p className="mt-3 text-[13px] text-neutral-600">
          Order <span className="caps font-bold text-black">{order.id}</span> · placed {formatDate(order.placedAt)}.
          A confirmation is on its way to {order.email}.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="space-y-10">
          <section>
            <h2 className="caps mb-6 text-label font-bold text-black">What happens next</h2>
            <OrderTimeline order={order} />
          </section>

          <section className="space-y-3 border-t border-neutral-200 pt-8 text-[13px] text-neutral-600">
            <h2 className="caps text-label font-bold text-black">{payment?.label}</h2>
            <p>{payment?.detail}</p>
            {order.express && (
              <p>Priority stitching is on: your piece ships within {facts.express.days} working days.</p>
            )}
            <p>
              {facts.changes} Questions? {site.whatsapp.label}:{" "}
              <a href={site.whatsapp.href} className="link-underline text-black">
                {site.concierge.label}
              </a>
              .
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="border border-neutral-200 p-6">
            <h2 className="caps text-label font-bold text-black">Your commission</h2>
            <div className="mt-2 divide-y divide-neutral-200">
              {order.lines.map((line) => (
                <LineItem key={line.id} line={line} />
              ))}
            </div>
            <div className="mt-2 border-t border-neutral-200 pt-2">
              <Totals subtotal={order.subtotal} delivery={order.delivery} expressFee={order.expressFee} total={order.total} />
            </div>
          </div>
          <div className="border border-neutral-200 p-6 text-[13px] text-neutral-600">
            <h2 className="caps text-label font-bold text-black">Delivering to</h2>
            <address className="mt-3 not-italic">
              {order.address.fullName}
              <br />
              {order.address.line1}
              {order.address.line2 && (
                <>
                  <br />
                  {order.address.line2}
                </>
              )}
              <br />
              {order.address.city}, {order.address.province} {order.address.postcode}
              <br />
              {order.address.phone}
            </address>
          </div>
          <Link href={`/account/orders/${order.id}`} className="btn-black w-full">
            Track in your account
          </Link>
        </aside>
      </div>
    </div>
  );
}
