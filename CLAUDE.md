# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build (also the type-check that matters)
- `npx next typegen && npx tsc --noEmit` — quicker type-check. The global `PageProps<"/route">` / `LayoutProps` types only exist after typegen (or dev/build) has run, so run it after adding a route.
- `npm run lint` — ESLint (`eslint-config-next`, react-hooks 7: `setState` inside `useEffect` is an error, hence the `useSyncExternalStore` store).
- There is no test suite. Verification is visual: run the dev server and check pages in a browser at 1280px and 390px.

Read `node_modules/next/dist/docs/` before using a Next API from memory; this Next version differs from older training data (`params`/`searchParams` are Promises and repeated query keys arrive as arrays; `priority` on `<Image>` is deprecated in favour of `preload`; `error.tsx` receives `{ error, retry }`; `next/form` scrolls to the top unless `scroll={false}`; `data-scroll-behavior="smooth"` is required on `<html>` for smooth anchor scrolling).

## What this is

ZARKOONY, a luxury Pakistani womenswear store where everything is custom stitched and made to order. The whole storefront exists as a frontend with mock data: home, shop + occasion categories, named collections, product pages with the measurement flow, search, cart, mock checkout + confirmation, wishlist, a mock account (login/register/orders/profile/addresses), made-to-order guides, a custom-orders quote page (`/custom-orders`), about, contact, FAQ, shipping, returns and four policies. There is no backend: see "Mock state" below.

Design sources, in order of authority:
1. The Google Stitch project "ZARKOONY Luxury Fashion Store" — homepage layout, sections, copy, images. Its `DESIGN.md` ("Haute Couture Atelier") holds the colour tokens, component rules and the made-to-order drawer spec.
2. baroque.pk — its *interactions* and site *structure* (navigation, listing, product, cart, account, customer-care pages) were the benchmark for the inner pages: body text `#1c1c1c`, inputs 48px tall, buttons 46px tall with the wipe-out hover, transparent header over the hero, 8-second image creep on category and collection cards, second-image cross-fade on product cards, thumbnail rail that slides a one-image-at-a-time horizontal gallery. Typography mostly follows the owner's typography guide (October 2026): Manrope for body and UI and Allura for one script accent; the big headings keep Cabin in uppercase at Baroque's scale, because two serifs (the guide's Bodoni Moda, then Cormorant Garamond) were tried on them and the owner asked for the committed look back both times. See the Typography bullet under "Global styling conventions". The product page follows Baroque's scale: a centred 1264px container, a 56px thumbnail rail 80px from 2:3 images about 631px wide, a 413px info column, a 16px title, 44px size boxes in a row and a full-width add-to-cart button. The info column carries only what Baroque's does: title, price, SKU line, size row with the size chart, quantity, add to cart and four short accordions (details, delivery, description, exchanges); no breadcrumbs, badges or explanatory copy.

Zero border radius everywhere (the only round things are the 8px header dots and the floating WhatsApp button, round and WhatsApp green at the owner's request). Never use `rounded-*` elsewhere. No Baroque names, images, copy or code.

## Architecture

**Data lives in `lib/`, markup in `components/`, routes in `app/` compose them.**
- `lib/products.ts` — `formatPrice` uses a fixed `en-US` locale so server and client agree.
- `lib/site.ts` — `site.url` comes from `NEXT_PUBLIC_SITE_URL`.

**Routes.** `/checkout/confirmation` reads `?order=` on the server and passes the id to a client component, deliberately avoiding `useSearchParams`.

**Mock state — `components/Store.tsx`.** Cart, wishlist, session and placed orders each live in a `localStorage` key (`zarkoony:*`) behind `useSyncExternalStore` with an empty server snapshot, so SSR and hydration agree. Hooks: `useCart/useWishlist/useSession/useOrders/useHydrated`; actions are plain functions (`cartActions`, `wishlistActions`, `sessionActions`, `orderActions`), no provider. Standard-size lines merge by slug + size; custom-measured lines are always separate. Any view that depends on stored state renders a skeleton until `useHydrated()` is true.

**Server by default.** Server components open overlays through `<Trigger opens="menu|search|cart|measure" item={…}>`. Gotchas in the client files: `HeroMedia.tsx` listens for `load` via a ref because `next/image`'s `onLoad` waits on `img.decode()`, which never resolves for cached images; `Reveal.tsx` keeps its hidden state only under `@media (scripting: enabled)` and no reduced motion; `shop/FilterForm.tsx` is keyed on the URL state so chip links reset it.

**Region and currency.** The visitor is "PK" or "US": `proxy.ts` sets the `zarkoony-region` cookie from Vercel's `x-vercel-ip-country` on the first request, an inline script in `app/layout.tsx` sets `<html data-region>` before first paint (cookie, else `Asia/Karachi` time zone → PK, else US), and the header chooser (`RegionChooser`, `regionActions`/`useRegion` in `Store.tsx`) overrides both. Prices are PKR in the data; `components/Price.tsx` renders `<Price value>` as both `PKR 18,500` and `$67` (`formatUsd`, `USD_RATE` placeholder) and `Regional` does the same for any copy, with `app/globals.css` showing the matching span, so server components stay static and nothing flashes. Checkout defaults its country to the region and sets the region when the country changes.

**Forms.** `components/Field.tsx`: `Field` (label + input + inline error) and `invalidFields(form)` (native constraint validation → messages keyed by name, focuses the first). Forms are `noValidate` and call it on submit.

**Header states are CSS, not React.** `.site-header` in `app/globals.css`: white by default; transparent with white text and a CSS-inverted logo when `body:has([data-transparent-header])` (set on the Hero) and the header is neither hovered nor `[data-solid]`. The header's negative `margin-bottom: calc(-1 * var(--header-height))` pulls the hero underneath it; `--header-height` must match the header's real height per breakpoint. The country chooser is a native `popover` (`#country-menu`, opened by `popoverTarget` buttons in the header, drawer and footer).

**Global styling conventions in `app/globals.css`:**
- `@theme` holds the Stitch colour tokens, `--tracking-label`, the motion tokens (`--duration-fast/medium/slow` = 200/400/800ms, `--ease-standard`, `--ease-wipe`) and the announcement `marquee` keyframes. Use `duration-(--duration-fast)` etc. in classes.
- **Typography** (the owner's guide; fonts load in `app/layout.tsx`, tokens in `@theme inline`): Cabin 400 for the big headings, Manrope (variable, used at 400/500/600 only; `font-semibold` is the heaviest weight in use, no `font-bold`) for body and UI, Allura 400 for one script accent. Do not put a serif or mixed case on the big headings: Bodoni Moda and then Cormorant Garamond were both tried and reverted at the owner's request. `heading` utility = Cabin, 400, uppercase, 0.18em; pair it with `text-title` (Baroque's 22–30.8px fluid page and section titles, line-height 1.4). `caps` utility = Manrope 500 + uppercase + 0.1em (`--tracking-label`); pair it with a text size (`text-label` 13px for nav, facet and accordion labels, sub-headings and footer headings; `text-[11px] font-semibold` eyebrows; `text-[10px]` badges and meta). Product names are mixed case Manrope 500 (`text-sm` on cards, `text-product` 16px on the product page and in the measurement drawer); prices are Manrope 600 `text-sm`, not uppercase. Buttons are Manrope 600 uppercase. `font-script text-script` = the Allura accent (24–38px), used once, on the Made-to-Order strip. `text-hero` (36–76px) is reserved for a visible hero headline, which does not exist yet. Body is 15px on phones and 16px from 700px, line-height 1.6. `link-underline` = the retracting 1px underline. `.skeleton` = loading shimmer.
- `.btn-white` / `.btn-black` implement Baroque's two-gradient-layer hover wipe; use these classes on both `<a>` and `<button>` rather than restyling buttons (`!border-black !text-black` turns `btn-white` into an outline button on white).
- Accordions are native `<details>`; `::details-content` + `interpolate-size` animate them where supported. Dialogs and popovers use `@starting-style` / `starting:` for entrances; everything is `motion-reduce`-safe.
- Inputs are 16px on phones (`text-base sm:text-[15px]`) so iOS doesn't zoom on focus.

**Images** are 1080×1920 (9:16) JPEGs in `public/images/products/<outfit>/1.jpg`: nineteen outfits from the owner's Gen AI set, one product each via `shot()` in `lib/products.ts`, plus `hero/marble-courtyard.jpg` (1920×1080, the ivory gown in the sunlit courtyard) and four 2688×1200 collection triptychs in `collections/` (three product images side by side, composed with `sharp`) for the wide banners. `brand/logo.png` is black-on-transparent, trimmed to its ink so it centres. Always `next/image` with `fill` + `sizes`; the hero and the first gallery image use `preload`, above-the-fold cards `loading="eager"`.

## Mock state and known leftovers

Nothing is sent anywhere. Orders, the session (any e-mail + password "signs in" on this device; passwords are never stored), cart and wishlist exist only in the browser's localStorage. Checkout takes no payment. The delivery country chooses the flow: Pakistan offers cash on delivery or bank transfer (the atelier account is shown and the customer enters their transfer details and attaches a receipt, whose name alone is stored); the United States offers card or ACH "via Stripe", which is explained on the page and, until keys and a route handler exist, lands on the confirmation like any other order (see the `ponytail:` note in `Checkout.tsx`). The contact and newsletter forms only show a success message. Business facts in `lib/content.ts` and contact details in `lib/site.ts` are placeholders modelled on Baroque's terms and marked `TODO confirm`. Social links are `#`. `site.internationalUrl` is no longer linked from the storefront (the US is served here) but still defined.
