"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { ChevronDown, Minus, Plus, Search, X } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import { cartCount, cartSubtotal, lineTotal, stitchingWindow } from "@/lib/orders";
import { formatPrice, type MeasureItem } from "@/lib/products";
import { nav, popularSearches, site } from "@/lib/site";
import { MeasureForm } from "./MeasureForm";
import { cartActions, useCart, useWishlist } from "./Store";

type OverlayApi = {
  openMenu: () => void;
  openSearch: () => void;
  openCart: () => void;
  openMeasure: (item?: MeasureItem) => void;
  /** Adds to the cart and opens the cart drawer. */
  addToCart: Parameters<typeof cartActions.add>[0] extends infer L ? (line: L) => void : never;
};

const OverlayContext = createContext<OverlayApi | null>(null);

export function useOverlays() {
  const overlays = useContext(OverlayContext);
  if (!overlays) throw new Error("Overlay components must be rendered inside <Overlays>");
  return overlays;
}

const defaultItem: MeasureItem = { title: "Bespoke Tailoring Specification", price: 28500 };

const closeDialog = (event: MouseEvent<HTMLElement>) =>
  event.currentTarget.closest("dialog")?.close();

// The dialog element is the dimmed area itself, so a click that lands on it missed the panel.
const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
};

const closeIcon = <X size={24} strokeWidth={1.5} aria-hidden />;

function Overlay({ className, ...props }: ComponentProps<"dialog">) {
  return (
    <dialog
      onClick={closeOnBackdrop}
      className={`fixed max-h-none max-w-none bg-black/40 text-charcoal-body backdrop:bg-transparent ${className}`}
      {...props}
    />
  );
}

type TriggerProps = Omit<ComponentProps<"button">, "onClick" | "type"> & {
  opens: "menu" | "search" | "cart" | "measure";
  item?: MeasureItem;
};

/** A button that opens one of the site overlays. Usable from server components. */
export function Trigger({ opens, item, ...props }: TriggerProps) {
  const overlays = useOverlays();

  const open = {
    menu: overlays.openMenu,
    search: overlays.openSearch,
    cart: overlays.openCart,
    measure: () => overlays.openMeasure(item),
  }[opens];

  return <button type="button" {...props} onClick={open} />;
}

const dot = (show: boolean) =>
  `absolute right-1.5 top-2 size-2 rounded-full bg-current ring-2 ring-(--header-bg) transition-transform duration-200 ${
    show ? "scale-100" : "scale-0"
  }`;

/** The dot on the cart icon; scales in once the cart has something in it. */
export function CartDot() {
  const cart = useCart();
  return <span aria-hidden className={dot(cart.length > 0)} />;
}

export function WishlistDot() {
  const wishlist = useWishlist();
  return <span aria-hidden className={dot(wishlist.length > 0)} />;
}

export function Overlays({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDialogElement>(null);
  const cartDialog = useRef<HTMLDialogElement>(null);
  const measure = useRef<HTMLDialogElement>(null);
  // `visit` remounts the form so every opening starts from a clean state.
  const [commission, setCommission] = useState({ item: defaultItem, visit: 0 });

  const api: OverlayApi = {
    openMenu: () => menu.current?.showModal(),
    openSearch: () => {
      // The bar hangs from the header's bottom edge, wherever the header currently is.
      const header = document.querySelector(".site-header");
      const top = header ? header.getBoundingClientRect().bottom : 0;
      search.current?.style.setProperty("--search-top", `${top}px`);
      search.current?.showModal();
    },
    openCart: () => cartDialog.current?.showModal(),
    openMeasure: (item = defaultItem) => {
      setCommission(({ visit }) => ({ item, visit: visit + 1 }));
      measure.current?.showModal();
    },
    addToCart: (line) => {
      cartActions.add(line);
      measure.current?.close();
      cartDialog.current?.showModal();
    },
  };

  return (
    <OverlayContext value={api}>
      {children}

      <Overlay ref={menu} aria-label="Navigation menu" className="inset-0 size-full">
        <div className="flex h-full w-4/5 max-w-sm flex-col justify-between overflow-y-auto bg-white p-6 transition-transform duration-500 ease-out starting:-translate-x-full motion-reduce:transition-none">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <span className="caps text-label font-bold">Zarkoony Atelier</span>
              <button type="button" aria-label="Close menu" className="-m-1 p-1" onClick={closeDialog}>
                {closeIcon}
              </button>
            </div>
            <MenuTree />
          </div>
          <div className="caps space-y-3 border-t border-neutral-200 pt-6 text-[11px] text-neutral-500">
            <nav aria-label="Account" className="flex flex-col gap-3 text-black">
              <Link href="/account" onClick={closeDialog}>
                Account
              </Link>
              <Link href="/wishlist" onClick={closeDialog}>
                Wishlist
              </Link>
              <button type="button" popoverTarget="country-menu" className="flex items-center gap-1 text-left">
                Pakistan <span className="text-neutral-500">PKR</span>
                <ChevronDown size={14} strokeWidth={1.5} aria-hidden />
              </button>
            </nav>
            <div>{site.uan.label}</div>
            <div>Concierge: {site.concierge.label}</div>
          </div>
        </div>
      </Overlay>

      {/* Full-width bar under the header, like Baroque's. The panel slides out from under it. */}
      <Overlay
        ref={search}
        data-search
        aria-label="Search"
        className="inset-x-0 bottom-0 top-(--search-top,0px) h-auto w-full overflow-hidden"
      >
        <SearchPanel />
      </Overlay>

      <Overlay
        ref={cartDialog}
        aria-label="Cart"
        className="inset-0 size-full items-center justify-end open:flex"
      >
        <CartPanel />
      </Overlay>

      <Overlay
        ref={measure}
        aria-label="Bespoke measurements"
        className="inset-0 size-full items-center justify-end open:flex"
      >
        <MeasurePanel key={commission.visit} item={commission.item} onConfirm={api.addToCart} />
      </Overlay>
    </OverlayContext>
  );
}

/** Two-level navigation; the second level is a native accordion. */
function MenuTree() {
  return (
    <nav aria-label="Main" className="caps flex flex-col pt-2 text-label leading-[1.7]">
      {nav.map((item) =>
        item.children ? (
          <details key={item.label} className="group border-b border-neutral-100">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3 transition-colors hover:text-champagne-gold [&::-webkit-details-marker]:hidden">
              {item.label}
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                aria-hidden
                className="transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <ul className="space-y-2.5 pb-4 pl-4 text-[12px] text-neutral-600">
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link href={child.href} onClick={closeDialog} className="transition-colors hover:text-black">
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            onClick={closeDialog}
            className="border-b border-neutral-100 py-3 transition-colors hover:text-champagne-gold"
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}

function SearchPanel() {
  const [query, setQuery] = useState("");
  const q = query.trim();
  const matches = q ? searchProducts(q).slice(0, 4) : [];

  return (
    <div className="max-h-full overflow-y-auto bg-white transition-transform duration-300 ease-out starting:-translate-y-full motion-reduce:transition-none">
      <Form
        action="/search"
        onSubmit={(event) => event.currentTarget.closest("dialog")?.close()}
        className="mx-auto flex h-20 max-w-[1920px] items-center gap-5 px-4 sm:px-8 lg:px-14"
      >
        <Search size={24} strokeWidth={1.5} aria-hidden className="shrink-0" />
        <input
          type="text"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          enterKeyHint="search"
          autoComplete="off"
          aria-label="Search the couture archive"
          placeholder="Search for..."
          className="caps min-w-0 flex-1 bg-transparent text-xl text-black outline-hidden placeholder:text-neutral-400 sm:text-2xl"
        />
        <button
          type="button"
          aria-label="Close search"
          className="-m-1 shrink-0 p-2 text-black"
          onClick={closeDialog}
        >
          {closeIcon}
        </button>
      </Form>

      <div className="mx-auto max-w-[1920px] border-t border-neutral-200 px-4 py-4 sm:px-8 lg:px-14">
        {!q ? (
          <div className="caps flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-neutral-500">
            <span>Popular:</span>
            {popularSearches.map((item) => (
              <Link key={item.label} href={item.href} onClick={closeDialog} className="link-underline text-black">
                {item.label}
              </Link>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <p className="py-4 text-[13px] text-neutral-500">
            Nothing in the archive matches &ldquo;{q}&rdquo;. Try a fabric, colour or occasion, or
            browse{" "}
            <Link href="/shop" onClick={closeDialog} className="link-underline text-black">
              everything
            </Link>
            .
          </p>
        ) : (
          <div>
            <p className="caps mb-4 text-[11px] text-neutral-500">Products</p>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {matches.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeDialog}
                    className="group block transition-[opacity,translate] duration-300 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
                  >
                    <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-ivory-base">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover object-top"
                      />
                    </div>
                    <p className="caps text-[11px] text-black group-hover:text-champagne-gold">
                      {product.name}
                    </p>
                    <p className="caps mt-1 text-[11px] font-bold text-black">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/search?q=${encodeURIComponent(q)}`}
              onClick={closeDialog}
              className="link-underline caps mt-5 inline-block text-[11px] text-black"
            >
              View all results
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const panelClass =
  "flex h-full w-full flex-col bg-white transition-transform duration-500 ease-out starting:translate-x-full motion-reduce:transition-none";

function CartPanel() {
  const cart = useCart();
  const count = cartCount(cart);
  const window = stitchingWindow(cart);

  return (
    <div className={`${panelClass} max-w-[450px]`}>
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
        <h2 className="caps text-label font-bold text-black">
          Cart {count > 0 && <span className="font-normal text-neutral-500">({count})</span>}
        </h2>
        <button type="button" aria-label="Close cart" className="-m-1 p-1" onClick={closeDialog}>
          {closeIcon}
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="caps text-[11px] text-black">Your cart is empty</p>
          <Link href="/shop" onClick={closeDialog} className="btn-black">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto px-6">
            {cart.map((line) => (
              <li key={line.id} className="flex gap-4 border-b border-neutral-200 py-4">
                {line.image && (
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={closeDialog}
                    className="relative block w-20 shrink-0 bg-ivory-base"
                    style={{ aspectRatio: "3 / 4" }}
                  >
                    <Image src={line.image} alt="" fill sizes="80px" className="object-cover object-top" />
                  </Link>
                )}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="caps text-[12px] text-black">{line.name}</p>
                  <p className="caps mt-1 text-[11px] text-neutral-500">
                    {line.size === "Custom" ? "Custom measurements" : `Size ${line.size}`} · Made to
                    order
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <Stepper
                      qty={line.qty}
                      onChange={(qty) => cartActions.setQty(line.id, qty)}
                      disabled={line.size === "Custom"}
                    />
                    <button
                      type="button"
                      onClick={() => cartActions.remove(line.id)}
                      className="link-underline text-[13px] text-neutral-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="caps shrink-0 text-[13px] font-bold text-black">
                  {formatPrice(lineTotal(line))}
                </p>
              </li>
            ))}
          </ul>
          <div className="space-y-4 border-t border-neutral-200 px-6 py-5">
            <div className="caps flex items-center justify-between text-[13px] font-bold text-black">
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal(cart))}</span>
            </div>
            <p className="text-[13px] text-neutral-500">
              Stitching begins once your commission is confirmed: {window[0]}–{window[1]} working
              days, then complimentary delivery across Pakistan.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/cart" onClick={closeDialog} className="btn-white !border-black !text-black">
                View cart
              </Link>
              <Link href="/checkout" onClick={closeDialog} className="btn-black">
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Quantity control; custom-measured lines stay at one since each is drafted individually. */
export function Stepper({
  qty,
  onChange,
  disabled,
}: {
  qty: number;
  onChange: (qty: number) => void;
  disabled?: boolean;
}) {
  const button = "p-2 text-neutral-600 transition-colors hover:text-black disabled:opacity-30 disabled:hover:text-neutral-600";
  return (
    <div className="flex items-center border border-neutral-300">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || qty <= 1}
        onClick={() => onChange(qty - 1)}
        className={button}
      >
        <Minus size={14} strokeWidth={1.5} aria-hidden />
      </button>
      <span className="min-w-7 text-center text-[13px] text-black">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || qty >= 5}
        onClick={() => onChange(qty + 1)}
        className={button}
      >
        <Plus size={14} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}

function MeasurePanel({ item, onConfirm }: { item: MeasureItem; onConfirm: OverlayApi["addToCart"] }) {
  return (
    <div className={`${panelClass} max-w-xl overflow-y-auto p-6 shadow-2xl md:p-10`}>
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <span className="caps mb-1 block text-[11px] text-neutral-500">Zarkoony Atelier</span>
          <h2 className="caps text-product font-normal text-black">{item.title}</h2>
        </div>
        <button
          type="button"
          aria-label="Close"
          className="p-2 text-neutral-500 hover:text-black"
          onClick={closeDialog}
        >
          {closeIcon}
        </button>
      </div>

      <div className="my-6 flex items-center justify-between gap-4 border border-neutral-200 bg-ivory-base p-4">
        <div>
          <span className="caps block text-[11px] text-neutral-500">Estimated Atelier Cost</span>
          <span className="caps text-sm font-bold text-black">{formatPrice(item.price)}</span>
        </div>
        <div className="text-right">
          <span className="caps block text-[11px] text-black">Made to order</span>
          <span className="text-[13px] text-neutral-500">Hand-cut &amp; bespoke stitched</span>
        </div>
      </div>

      <MeasureForm item={item} onConfirm={onConfirm} />

      <p className="caps mt-6 text-center text-[10px] text-neutral-400">
        Complimentary post-stitch adjustments by ZARKOONY master karigars
      </p>
    </div>
  );
}
