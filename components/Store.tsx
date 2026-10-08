"use client";

import { useSyncExternalStore } from "react";
import type { Address, CartLine, Country, Order } from "@/lib/orders";

/**
 * Client state that survives a reload: cart, wishlist, the mock session and placed orders, each in
 * its own localStorage key. Built on useSyncExternalStore so the server render (empty) and the
 * first client render agree, and so nothing is set inside an effect.
 */

export type Session = { name: string; email: string; addresses: Address[] };

/** Products per row on the listing; phones and desktops remember their own choice. */
export type View = { mobile: 1 | 2; desktop: 2 | 3 | 4 };

type LocalStore<T> = {
  get: () => T;
  getServer: () => T;
  subscribe: (listener: () => void) => () => void;
  set: (update: (prev: T) => T) => void;
};

function createLocalStore<T>(key: string, initial: T): LocalStore<T> {
  let cached = initial;
  let cachedRaw: string | null | undefined;
  const listeners = new Set<() => void>();

  const get = () => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      // Storage blocked (private mode, iframe): behave as empty.
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cached = raw ? (JSON.parse(raw) as T) : initial;
      } catch {
        cached = initial;
      }
    }
    return cached;
  };

  return {
    get,
    getServer: () => initial,
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === key) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    set(update) {
      cached = update(get());
      cachedRaw = JSON.stringify(cached);
      try {
        localStorage.setItem(key, cachedRaw);
      } catch {
        // Keep the in-memory value; it just won't survive a reload.
      }
      listeners.forEach((listener) => listener());
    },
  };
}

const stores = {
  cart: createLocalStore<CartLine[]>("zarkoony:cart", []),
  wishlist: createLocalStore<string[]>("zarkoony:wishlist", []),
  session: createLocalStore<Session | null>("zarkoony:session", null),
  orders: createLocalStore<Order[]>("zarkoony:orders", []),
  view: createLocalStore<View>("zarkoony:view", { mobile: 2, desktop: 2 }),
};

const useLocal = <T,>(store: LocalStore<T>) =>
  useSyncExternalStore(store.subscribe, store.get, store.getServer);

const noSubscribe = () => () => {};

/** False during SSR and hydration, true once the client can read localStorage. */
export const useHydrated = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const useCart = () => useLocal(stores.cart);

export const cartActions = {
  /** Standard sizes merge into an existing line; custom-measured pieces are always their own line. */
  add(line: Omit<CartLine, "id">) {
    stores.cart.set((lines) => {
      if (line.size !== "Custom") {
        const existing = lines.find((l) => l.slug === line.slug && l.size === line.size);
        if (existing) {
          return lines.map((l) => (l === existing ? { ...l, qty: l.qty + line.qty } : l));
        }
      }
      return [...lines, { ...line, id: newId() }];
    });
  },
  setQty(id: string, qty: number) {
    stores.cart.set((lines) =>
      qty < 1 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  },
  remove(id: string) {
    stores.cart.set((lines) => lines.filter((l) => l.id !== id));
  },
  clear() {
    stores.cart.set(() => []);
  },
};

export const useWishlist = () => useLocal(stores.wishlist);

export const wishlistActions = {
  toggle(slug: string) {
    stores.wishlist.set((slugs) =>
      slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug],
    );
  },
  remove(slug: string) {
    stores.wishlist.set((slugs) => slugs.filter((s) => s !== slug));
  },
};

export const useSession = () => useLocal(stores.session);

export const sessionActions = {
  signIn(session: Session) {
    stores.session.set(() => session);
  },
  update(patch: Partial<Session>) {
    stores.session.set((session) => (session ? { ...session, ...patch } : session));
  },
  signOut() {
    stores.session.set(() => null);
  },
};

export const useOrders = () => useLocal(stores.orders);

export const orderActions = {
  place(order: Order) {
    stores.orders.set((orders) => [order, ...orders]);
  },
};

export const useView = () => useLocal(stores.view);

export const viewActions = {
  set(patch: Partial<View>) {
    stores.view.set((view) => ({ ...view, ...patch }));
  },
};

/**
 * The visitor's region, "PK" or "US", read from `<html data-region>`: the inline script in
 * app/layout.tsx sets it before first paint from the region cookie (geo via proxy.ts, else the
 * time zone). Setting it here updates the attribute and the cookie, so the CSS-switched prices
 * (components/Price.tsx) and React views agree.
 */
const regionListeners = new Set<() => void>();

export const useRegion = () =>
  useSyncExternalStore(
    (listener) => {
      regionListeners.add(listener);
      return () => regionListeners.delete(listener);
    },
    () => (document.documentElement.dataset.region === "US" ? "US" : "PK") as Country,
    () => "PK" as Country,
  );

export const regionActions = {
  set(region: Country) {
    document.documentElement.dataset.region = region;
    document.cookie = `zarkoony-region=${region}; path=/; max-age=31536000; samesite=lax`;
    regionListeners.forEach((listener) => listener());
  },
};
