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
import { X } from "lucide-react";
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
  openMeasure: (item?: MeasureItem) => void;
};

const OverlayContext = createContext<OverlayApi | null>(null);

const defaultItem: MeasureItem = { title: "Bespoke Tailoring Specification", price: 28500 };

const closeDialog = (event: MouseEvent<HTMLElement>) =>
  event.currentTarget.closest("dialog")?.close();

// The dialog element is the dimmed area itself, so a click that lands on it missed the panel.
const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
};

function Overlay({ className, ...props }: ComponentProps<"dialog">) {
  return (
    <dialog
      onClick={closeOnBackdrop}
      className={`fixed inset-0 size-full max-h-none max-w-none text-charcoal-body backdrop-blur-xs backdrop:bg-transparent ${className}`}
      {...props}
    />
  );
}

type TriggerProps = Omit<ComponentProps<"button">, "onClick" | "type"> & {
  opens: "menu" | "search" | "measure";
  item?: MeasureItem;
};

/** A button that opens one of the site overlays. Usable from server components. */
export function Trigger({ opens, item, ...props }: TriggerProps) {
  const overlays = useContext(OverlayContext);
  if (!overlays) throw new Error("<Trigger> must be rendered inside <Overlays>");

  const open = {
    menu: overlays.openMenu,
    search: overlays.openSearch,
    measure: () => overlays.openMeasure(item),
  }[opens];

  return <button type="button" {...props} onClick={open} />;
}

export function Overlays({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDialogElement>(null);
  const measure = useRef<HTMLDialogElement>(null);
  // `visit` remounts the form so every opening starts from a clean state.
  const [commission, setCommission] = useState({ item: defaultItem, visit: 0 });

  const api: OverlayApi = {
    openMenu: () => menu.current?.showModal(),
    openSearch: () => search.current?.showModal(),
    openMeasure: (item = defaultItem) => {
      setCommission(({ visit }) => ({ item, visit: visit + 1 }));
      measure.current?.showModal();
    },
  };

  return (
    <OverlayContext value={api}>
      {children}

      <Overlay ref={menu} aria-label="Navigation menu" className="bg-black/60">
        <div className="flex h-full w-4/5 max-w-sm flex-col justify-between overflow-y-auto bg-white p-6 transition-transform duration-500 ease-out starting:-translate-x-full motion-reduce:transition-none">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <span className="caps text-[13px] font-bold">Zarkoony Atelier</span>
              <button type="button" aria-label="Close menu" className="p-1" onClick={closeDialog}>
                <X size={20} strokeWidth={1.25} aria-hidden />
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

      <Overlay
        ref={search}
        aria-label="Search"
        className="items-start justify-center bg-black/60 pt-24 open:flex"
      >
        <div className="mx-4 w-full max-w-2xl bg-white p-6 shadow-2xl transition-[transform,opacity] duration-500 ease-out starting:-translate-y-3 starting:opacity-0 motion-reduce:transition-none">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-4">
            <input
              type="text"
              enterKeyHint="search"
              aria-label="Search the couture archive"
              placeholder="Search couture archive..."
              className="caps w-full bg-transparent px-3 py-2 text-base text-black outline-hidden placeholder:text-neutral-400 sm:text-xl"
            />
            <button
              type="button"
              aria-label="Close search"
              className="p-1 text-black"
              onClick={closeDialog}
            >
              <X size={20} strokeWidth={1.25} aria-hidden />
            </button>
          </div>
          <div className="caps flex flex-wrap gap-x-4 gap-y-2 pt-4 text-[11px] text-neutral-500">
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
        ref={measure}
        aria-label="Bespoke measurements"
        className="items-center justify-end bg-black/70 open:flex"
      >
        <MeasureForm key={commission.visit} item={commission.item} />
      </Overlay>
    </OverlayContext>
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
  const [tab, setTab] = useState<"custom" | "standard">("custom");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
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
            <X size={20} strokeWidth={1.25} aria-hidden />
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
              Your bespoke tailoring specification has been logged. Our Master Karigar will contact
              you via WhatsApp for final sleeve &amp; margin verification.
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
