# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build (also the type-check that matters; `npx tsc --noEmit` for a quicker one)
- `npm run lint` — ESLint (`eslint-config-next`)
- There is no test suite. Verification is visual: run the dev server and check the page in a browser at 1280px and 390px.

Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, `lucide-react`. Read `node_modules/next/dist/docs/` before using a Next API from memory; this Next version differs from older training data (`params` are Promises, `priority` on `<Image>` is deprecated in favour of `preload`, `data-scroll-behavior="smooth"` is required on `<html>` for smooth anchor scrolling).

## What this is

ZARKOONY, a luxury Pakistani womenswear store where everything is custom stitched and made to order. Only the homepage exists so far (`app/page.tsx`); `/shop`, `/collections`, `/product/[slug]`, `/made-to-order`, `/about` and `/contact` are planned but wait for their designs.

Design sources, in order of authority:
1. The Google Stitch project "ZARKOONY Luxury Fashion Store" — layout, sections, copy, images. Its `DESIGN.md` ("Haute Couture Atelier") holds the colour tokens, component rules and the made-to-order drawer spec.
2. baroque.pk — the owner wants its typography and interactions matched exactly. Current values were measured from the live site: Cabin for uppercase labels/headings, Figtree for body and buttons, one tracking value (0.18em) everywhere, section headings 22–30px fluid, buttons 46px tall with the wipe-out hover, transparent header over the hero, 8-second image creep on category cards.

Zero border radius everywhere (the only round thing is the 8px cart dot). Never use `rounded-*`.

## Architecture

**Data lives in `lib/`, markup in `components/`, and the homepage composes them.**
- `lib/site.ts` — brand strings, contact numbers (placeholders from the mock, still unconfirmed), drawer nav, footer columns, social SVG paths, `site.url` from `NEXT_PUBLIC_SITE_URL`.
- `lib/products.ts` — `Product`, the four homepage products, `MeasureItem`, measurement fields, standard sizes, `formatPrice` (fixed `en-US` locale so server and client render the same string).
- `lib/home.ts` — hero, category sections, banners and strip copy. A `Cta` is either `{ href }` or `{ item: MeasureItem }`; `components/Cta.tsx` renders the first as a link and the second as a drawer trigger.

**Server by default; three client files.**
- `components/Overlays.tsx` holds a context and the four native `<dialog>`s: mobile menu, the search bar (positioned under the header via `--search-top`, set on open), the cart drawer, and the bespoke-measurement drawer (`MeasureForm`, remounted via a `visit` counter so each opening starts clean). Cart items live in that context, in memory only; confirming a commission adds one, and `<CartDot />` scales in when there is something to show. Server components open overlays through the exported `<Trigger opens="menu|search|cart|measure" item={…}>` button; nothing else needs `"use client"` to trigger one. Dialogs close on Esc, backdrop click (`closeOnBackdrop`) or any inner element via `closeDialog` (`closest("dialog").close()`).
- `components/HeaderFrame.tsx` toggles `data-solid` on the header with an IntersectionObserver on a 1px sentinel above it.
- `components/NewsletterForm.tsx` shows an inline success message.

**Header states are CSS, not React.** `.site-header` in `app/globals.css`: white by default; transparent with white text and a CSS-inverted logo when `body:has([data-transparent-header])` (set on the Hero) and the header is neither hovered nor `[data-solid]`. The header's negative `margin-bottom: calc(-1 * var(--header-height))` is what pulls the hero underneath it; `--header-height` must match the header's real height per breakpoint.

**Global styling conventions in `app/globals.css`:**
- `@theme` holds the Stitch colour tokens, `--tracking-label`, and the announcement `marquee` keyframes.
- `caps` utility = Cabin + uppercase + 0.18em tracking; pair it with a text size. `link-underline` = the retracting 1px underline.
- `.btn-white` / `.btn-black` implement Baroque's two-gradient-layer hover wipe (`--fill` / `--ink`); use these classes on both `<a>` and `<button>` rather than restyling buttons.
- Inputs are 16px on phones (`text-base sm:text-[15px]`) so iOS doesn't zoom on focus.

**Images** are the Stitch assets in `public/images/{brand,hero,categories,collections,products}` (1376×768 or 896×1200; `brand/logo.png` is black-on-transparent, trimmed to its ink so it centres). Always `next/image` with `fill` + `sizes`; the hero uses `preload`, the first category section `loading="eager"`.

## Known mock leftovers

Nothing is submitted anywhere: "Confirm Bespoke Commission" only adds the item to the in-memory cart (lost on reload, no checkout) and the newsletter only shows a message. Search has no results. Nav and footer links point to in-page anchors or `#`. The currency selector is display-only. All of these are waiting on the inner pages and a backend.
