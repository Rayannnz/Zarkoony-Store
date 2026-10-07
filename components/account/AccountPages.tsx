"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatDate, orderStages, provinces, sampleOrders, type Address, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { Field, fieldClass, fieldLabelClass, invalidFields } from "../Field";
import { LineItem, OrderTimeline, Totals } from "../orders/OrderParts";
import { sessionActions, useOrders, useSession } from "../Store";

const title = "caps text-[13px] font-bold text-black";

/** Orders placed on this device plus the seeded samples, newest first. */
function useAllOrders(): Order[] {
  const placed = useOrders();
  return [...placed, ...sampleOrders].sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

const statusLabel = (order: Order) => orderStages.find((s) => s.key === order.status)?.label ?? order.status;

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <table className="w-full text-[13px]">
      <thead className="caps text-[10px] text-neutral-500">
        <tr className="border-b border-neutral-200 text-left">
          <th className="py-2 font-normal">Order</th>
          <th className="hidden py-2 font-normal sm:table-cell">Date</th>
          <th className="py-2 font-normal">Status</th>
          <th className="py-2 text-right font-normal">Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-neutral-200">
            <td className="py-3">
              <Link href={`/account/orders/${order.id}`} className="link-underline caps text-[11px] text-black">
                {order.id}
              </Link>
              <span className="mt-1 block text-neutral-500 sm:hidden">{formatDate(order.placedAt)}</span>
            </td>
            <td className="hidden py-3 text-neutral-600 sm:table-cell">{formatDate(order.placedAt)}</td>
            <td className="py-3 text-neutral-600">{statusLabel(order)}</td>
            <td className="py-3 text-right text-black">{formatPrice(order.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AccountOverview() {
  const session = useSession();
  const orders = useAllOrders();
  if (!session) return null;
  const address = session.addresses[0];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl text-black">Welcome back, {session.name.split(" ")[0]}.</h1>
        <p className="mt-2 text-[13px] text-neutral-500">
          Your commissions, measurements and delivery details in one place.
        </p>
      </div>
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className={title}>Recent orders</h2>
          <Link href="/account/orders" className="link-underline caps text-[10px] text-neutral-500">
            View all
          </Link>
        </div>
        <OrdersTable orders={orders.slice(0, 3)} />
      </section>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <section className="text-[13px] text-neutral-600">
          <h2 className={`${title} mb-3`}>Account details</h2>
          <p className="text-black">{session.name}</p>
          <p>{session.email}</p>
          <Link href="/account/profile" className="link-underline caps mt-3 inline-block text-[10px] text-neutral-500">
            Edit
          </Link>
        </section>
        <section className="text-[13px] text-neutral-600">
          <h2 className={`${title} mb-3`}>Primary address</h2>
          {address ? (
            <address className="not-italic">
              {address.fullName}
              <br />
              {address.line1}
              <br />
              {address.city}, {address.province}
            </address>
          ) : (
            <p>No address saved yet.</p>
          )}
          <Link href="/account/addresses" className="link-underline caps mt-3 inline-block text-[10px] text-neutral-500">
            Manage addresses
          </Link>
        </section>
      </div>
    </div>
  );
}

export function OrdersList() {
  const orders = useAllOrders();
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-black">Orders</h1>
      {orders.length ? (
        <OrdersTable orders={orders} />
      ) : (
        <div className="py-12 text-center">
          <p className="caps text-[11px] text-black">No orders yet</p>
          <Link href="/shop" className="btn-black mt-6">
            Start a commission
          </Link>
        </div>
      )}
    </div>
  );
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const order = useAllOrders().find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="caps text-[11px] text-black">Order not found</p>
        <p className="mt-3 text-[13px] text-neutral-500">
          {orderId} is not stored on this device. The concierge can look it up for you.
        </p>
        <Link href="/account/orders" className="btn-black mt-6">
          All orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <Link href="/account/orders" className="link-underline caps text-[10px] text-neutral-500">
          All orders
        </Link>
        <h1 className="caps mt-3 text-xl text-black">{order.id}</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Placed {formatDate(order.placedAt)} · {statusLabel(order)}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
        <section>
          <h2 className={`${title} mb-6`}>Progress</h2>
          <OrderTimeline order={order} />
        </section>
        <aside className="space-y-6">
          <div className="border border-neutral-200 p-6">
            <h2 className={title}>Pieces</h2>
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
            <h2 className={title}>Delivering to</h2>
            <address className="mt-3 not-italic">
              {order.address.fullName}
              <br />
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.province}
              <br />
              {order.address.phone}
            </address>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function ProfileForm() {
  const session = useSession();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  if (!session) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = invalidFields(event.currentTarget);
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    const data = new FormData(event.currentTarget);
    sessionActions.update({ name: String(data.get("name")).trim(), email: String(data.get("email")).trim() });
    setSaved(true);
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-md space-y-4">
      <h1 className="font-serif text-2xl text-black">Profile</h1>
      <Field label="Name" name="name" required autoComplete="name" defaultValue={session.name} error={errors.name} />
      <Field label="E-mail" name="email" type="email" required autoComplete="email" defaultValue={session.email} error={errors.email} />
      <button type="submit" className="btn-black">
        Save changes
      </button>
      {saved && (
        <p role="status" className="text-[13px] text-neutral-600">
          Profile updated.
        </p>
      )}
    </form>
  );
}

export function AddressBook() {
  const session = useSession();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);
  if (!session) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = invalidFields(form);
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const address: Address = {
      fullName: text("fullName"),
      phone: text("phone"),
      line1: text("line1"),
      line2: text("line2") || undefined,
      city: text("city"),
      province: text("province"),
      postcode: text("postcode") || undefined,
    };
    sessionActions.update({ addresses: [...session.addresses, address] });
    setAdding(false);
  };

  const remove = (index: number) =>
    sessionActions.update({ addresses: session.addresses.filter((_, i) => i !== index) });

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-2xl text-black">Addresses</h1>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="link-underline caps text-[10px] text-black">
            Add address
          </button>
        )}
      </div>

      {session.addresses.length === 0 && !adding && (
        <p className="text-[13px] text-neutral-500">No addresses saved. Add one to speed up checkout.</p>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {session.addresses.map((address, index) => (
          <li key={`${address.line1}-${index}`} className="border border-neutral-200 p-5 text-[13px] text-neutral-600">
            {index === 0 && <span className="caps mb-2 block text-[10px] text-champagne-gold">Primary</span>}
            <address className="not-italic">
              <span className="text-black">{address.fullName}</span>
              <br />
              {address.line1}
              {address.line2 && (
                <>
                  <br />
                  {address.line2}
                </>
              )}
              <br />
              {address.city}, {address.province} {address.postcode}
              <br />
              {address.phone}
            </address>
            <button type="button" onClick={() => remove(index)} className="link-underline caps mt-3 text-[10px] text-neutral-500">
              Remove
            </button>
          </li>
        ))}
      </ul>

      {adding && (
        <form onSubmit={submit} noValidate className="max-w-xl space-y-4 border-t border-neutral-200 pt-6">
          <h2 className={title}>New address</h2>
          <Field label="Full name" name="fullName" required autoComplete="name" defaultValue={session.name} error={errors.fullName} />
          <Field label="Phone" name="phone" type="tel" required autoComplete="tel" error={errors.phone} />
          <Field label="Address" name="line1" required autoComplete="address-line1" error={errors.line1} />
          <Field label="Apartment, floor, landmark (optional)" name="line2" autoComplete="address-line2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="City" name="city" required autoComplete="address-level2" error={errors.city} />
            <label className="block">
              <span className={fieldLabelClass}>Province</span>
              <select name="province" required defaultValue="" className={`${fieldClass} cursor-pointer`}>
                <option value="" disabled>
                  Select
                </option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && (
                <span role="alert" className="mt-1 block text-[12px] text-red-700">
                  {errors.province}
                </span>
              )}
            </label>
            <Field label="Postcode (optional)" name="postcode" inputMode="numeric" autoComplete="postal-code" />
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" className="btn-black">
              Save address
            </button>
            <button type="button" onClick={() => setAdding(false)} className="link-underline caps text-[10px] text-neutral-500">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
