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
import { Search, X } from "lucide-react";
import {
  formatPrice,
  measurementFields,
  standardSizes,
  type MeasureItem,
} from "@/lib/products";
import { mobileNavItems, popularSearches, site } from "@/lib/site";

type OverlayApi = {
  openMenu: () => void;
  openSearch: () => void;
  openCart: () => void;
  openMeasure: (item?: MeasureItem) => void;
  cart: MeasureItem[];
  addToCart: (item: MeasureItem) => void;
  removeFromCart: (index: number) => void;
};

const OverlayContext = createContext<OverlayApi | null>(null);

function useOverlays() {
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

/** The dot on the cart icon; scales in once the cart has something in it. */
export function CartDot() {
  const { cart } = useOverlays();
  return (
    <span
      aria-hidden
      className={`absolute right-1.5 top-2 size-2 rounded-full bg-current ring-2 ring-(--header-bg) transition-transform duration-200 ${
        cart.length ? "scale-100" : "scale-0"
      }`}
    />
  );
}

export function Overlays({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDialogElement>(null);
  const cartDialog = useRef<HTMLDialogElement>(null);
  const measure = useRef<HTMLDialogElement>(null);
  // `visit` remounts the form so every opening starts from a clean state.
  const [commission, setCommission] = useState({ item: defaultItem, visit: 0 });
  const [cart, setCart] = useState<MeasureItem[]>([]);

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
    cart,
    addToCart: (item) => setCart((items) => [...items, item]),
    removeFromCart: (index) => setCart((items) => items.filter((_, i) => i !== index)),
  };

  return (
    <OverlayContext value={api}>
      {children}

      <Overlay ref={menu} aria-label="Navigation menu" className="inset-0 size-full">
        <div className="flex h-full w-4/5 max-w-sm flex-col justify-between overflow-y-auto bg-white p-6 transition-transform duration-500 ease-out starting:-translate-x-full motion-reduce:transition-none">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <span className="caps text-[13px] font-bold">Zarkoony Atelier</span>
              <button type="button" aria-label="Close menu" className="-m-1 p-1" onClick={closeDialog}>
                {closeIcon}
              </button>
            </div>
            <nav aria-label="Mobile" className="caps flex flex-col gap-4 pt-6 text-[13px] leading-[1.7]">
              {mobileNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeDialog}
                  className={`py-1 ${item.emphasis ? "text-champagne-gold" : "hover:text-champagne-gold"}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="caps space-y-2 border-t border-neutral-200 pt-6 text-[11px] text-neutral-500">
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
        <div className="bg-white transition-transform duration-300 ease-out starting:-translate-y-full motion-reduce:transition-none">
          <div className="mx-auto flex h-20 max-w-[1920px] items-center gap-5 px-4 sm:px-8 lg:px-14">
            <Search size={24} strokeWidth={1.5} aria-hidden className="shrink-0" />
            <input
              type="text"
              enterKeyHint="search"
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
          </div>
          <div className="caps mx-auto flex max-w-[1920px] flex-wrap gap-x-4 gap-y-2 border-t border-neutral-200 px-4 py-3 text-[11px] text-neutral-500 sm:px-8 lg:px-14">
            <span>Popular:</span>
            {popularSearches.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeDialog}
                className="link-underline text-black"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
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
        <MeasureForm key={commission.visit} item={commission.item} />
      </Overlay>
    </OverlayContext>
  );
}

function CartPanel() {
  const { cart, removeFromCart } = useOverlays();
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex h-full w-full max-w-[450px] flex-col bg-white transition-transform duration-500 ease-out starting:translate-x-full motion-reduce:transition-none">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
        <h2 className="caps text-[13px] font-bold text-black">Cart</h2>
        <button type="button" aria-label="Close cart" className="-m-1 p-1" onClick={closeDialog}>
          {closeIcon}
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="caps flex flex-1 items-center justify-center text-[11px] text-black">
          Your cart is empty
        </p>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto px-6">
            {cart.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="flex items-start justify-between gap-4 border-b border-neutral-200 py-4"
              >
                <div>
                  <p className="font-serif text-[15px] text-black">{item.title}</p>
                  <p className="caps mt-1 text-[11px] text-neutral-500">Made to order</p>
                </div>
                <div className="text-right">
                  <p className="caps text-[13px] font-bold text-black">{formatPrice(item.price)}</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    className="link-underline mt-1 text-[13px] text-neutral-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-neutral-200 px-6 py-5">
            <div className="caps flex items-center justify-between text-[13px] font-bold text-black">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-[13px] text-neutral-500">
              Checkout isn&apos;t available yet. Our atelier confirms every commission on WhatsApp.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const tabClass = (active: boolean) =>
  `caps flex-1 border-b-2 py-3 text-[11px] transition-colors ${
    active ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
  }`;

const fieldLabelClass = "caps mb-1 block text-[11px] text-neutral-600";

// 16px on phones so iOS doesn't zoom the page on focus.
const fieldClass =
  "w-full bg-transparent text-base text-black outline-hidden focus:border-black sm:text-[15px]";

function MeasureForm({ item }: { item: MeasureItem }) {
  const { addToCart } = useOverlays();
  const [tab, setTab] = useState<"custom" | "standard">("custom");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addToCart(item);
        setConfirmed(true);
      }}
      className="flex h-full w-full max-w-xl flex-col justify-between overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-500 ease-out starting:translate-x-full motion-reduce:transition-none md:p-10"
    >
      <div>
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <div>
            <span className="caps mb-1 block text-[11px] text-neutral-500">Zarkoony Atelier</span>
            <h2 className="font-serif text-xl font-normal text-black md:text-2xl">{item.title}</h2>
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

        <div className="my-6 flex items-center justify-between gap-4 border border-neutral-200 bg-[#F8F7F4] p-4">
          <div>
            <span className="caps block text-[11px] text-neutral-500">Estimated Atelier Cost</span>
            <span className="caps text-sm font-bold text-black">{formatPrice(item.price)}</span>
          </div>
          <div className="text-right">
            <span className="caps block text-[11px] text-black">7–14 Working Days</span>
            <span className="text-[13px] text-neutral-500">Hand-cut &amp; Bespoke Stitched</span>
          </div>
        </div>

        <div role="tablist" className="mb-6 flex border-b border-neutral-200">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "custom"}
            className={tabClass(tab === "custom")}
            onClick={() => setTab("custom")}
          >
            Custom Measurements (Inches)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "standard"}
            className={tabClass(tab === "standard")}
            onClick={() => setTab("standard")}
          >
            Standard Atelier Sizes
          </button>
        </div>

        <div role="tabpanel" hidden={tab !== "custom"} className="space-y-4">
          <p className="mb-4 text-[13px] text-neutral-600">
            Enter your bespoke body specifications. Master cutting masters calibrate silhouette
            flare, neckline depth, and lining.
          </p>
          {/* `items-end` keeps the inputs level when one label wraps and its neighbour doesn't. */}
          <div className="grid grid-cols-2 items-end gap-4">
            {measurementFields.map((field) => (
              <label key={field.label} className="block">
                <span className={fieldLabelClass}>{field.label}</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  inputMode="decimal"
                  placeholder={field.placeholder}
                  className={`${fieldClass} border-b border-neutral-300 px-1 py-2`}
                />
              </label>
            ))}
          </div>
          <label className="mt-4 block">
            <span className={fieldLabelClass}>Custom Styling Notes</span>
            <textarea
              rows={2}
              placeholder="e.g. Modest neckline, full sleeve lining, specific flare requirements..."
              className={`${fieldClass} block border border-neutral-200 p-3`}
            />
          </label>
        </div>

        <div role="tabpanel" hidden={tab !== "standard"} className="space-y-4">
          <p className="mb-4 text-[13px] text-neutral-600">
            Select standard Pakistani luxury atelier silhouette:
          </p>
          <div role="radiogroup" aria-label="Standard atelier size" className="grid grid-cols-3 gap-3">
            {standardSizes.map(({ size, note }, index) => (
              <label
                key={size}
                className="relative cursor-pointer border border-neutral-200 p-3 text-center transition-all hover:border-black has-checked:bg-black has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black"
              >
                <input
                  type="radio"
                  name="standard-size"
                  value={size}
                  defaultChecked={index === 0}
                  className="sr-only"
                />
                <span className="caps block text-[13px] font-bold">{size}</span>
                <span className="block text-[11px] opacity-70">{note}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6">
        {confirmed ? (
          <>
            <p role="status" className="text-center text-[13px] text-neutral-600">
              Added to your cart. Our Master Karigar will contact you via WhatsApp for final sleeve
              &amp; margin verification.
            </p>
            <button type="button" className="btn-black w-full" onClick={closeDialog}>
              Close
            </button>
          </>
        ) : (
          <button type="submit" className="btn-black w-full">
            Confirm Bespoke Commission
          </button>
        )}
        <p className="caps text-center text-[10px] text-neutral-400">
          Complimentary post-stitch adjustments by ZARKOONY master karigars
        </p>
      </div>
    </form>
  );
}
