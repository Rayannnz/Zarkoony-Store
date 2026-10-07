import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart, Menu, Search, User } from "lucide-react";
import { site } from "@/lib/site";
import { HeaderFrame } from "./HeaderFrame";
import { CartDot, Trigger, WishlistDot } from "./Overlays";

const icon = { size: 24, strokeWidth: 1.5, "aria-hidden": true } as const;

/** The paper shopping bag the owner chose: a tall looped handle over a tapered body, drawn to match the lucide stroke. */
function BagIcon({ size, strokeWidth }: { size: number; strokeWidth: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 8h10a1 1 0 0 1 1 .9l.8 11.6a1.5 1.5 0 0 1-1.5 1.5H6.7a1.5 1.5 0 0 1-1.5-1.5L6 8.9A1 1 0 0 1 7 8z" />
      <path d="M9 12V7.5a3 3 0 0 1 6 0V12" />
    </svg>
  );
}

// Padding plus an equal negative margin: a 40px tap target with no change in layout.
const iconButton = "-m-1 p-2";

export function Header() {
  return (
    // Colours come from `.site-header` in globals.css: white, or transparent over the hero.
    <HeaderFrame className="site-header sticky top-0 z-50 border-b border-(--header-line)">
      {/* Equal side columns keep the logo centred; it shrinks before the icons can overlap it. */}
      <div className="mx-auto grid h-16 max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center gap-x-3 px-4 sm:px-8 md:h-20 lg:px-14">
        <div className="flex min-w-23 items-center">
          <Trigger opens="menu" aria-label="Open navigation menu" className="-ml-2 p-2">
            <Menu {...icon} />
          </Trigger>
        </div>

        <Link href="/" className="block min-w-0 py-1">
          <Image
            src="/images/brand/logo.png"
            alt="ZARKOONY Custom Stitched Couture"
            width={720}
            height={120}
            loading="eager"
            className="mx-auto h-9 w-auto max-w-full object-contain transition-[filter] duration-200 [filter:var(--logo-filter)] md:h-10"
          />
        </Link>

        <div className="flex items-center justify-end gap-2 sm:gap-4 md:gap-5">
          <button
            type="button"
            popoverTarget="country-menu"
            className="caps hidden items-center gap-1 text-[11px] lg:flex"
          >
            <span>Pakistan</span>
            <span className="opacity-60">PKR</span>
            <ChevronDown size={15} strokeWidth={1.5} className="-mr-1" aria-hidden />
          </button>
          <Link href="/account" aria-label="Account" className={iconButton}>
            <User {...icon} />
          </Link>
          <Trigger opens="search" aria-label="Search" className={iconButton}>
            <Search {...icon} />
          </Trigger>
          <Trigger opens="cart" aria-label="Shopping bag" className={`relative ${iconButton}`}>
            <BagIcon size={icon.size} strokeWidth={icon.strokeWidth} />
            <CartDot />
          </Trigger>
          <Link href="/wishlist" aria-label="Wishlist" className={`relative hidden sm:inline-flex ${iconButton}`}>
            <Heart {...icon} />
            <WishlistDot />
          </Link>
        </div>
      </div>

      {/* Baroque's "Are you in the right place?" country chooser, as a native popover: Esc and
          click-outside close it, and any button on the page can open it by id. */}
      <div
        id="country-menu"
        popover="auto"
        className="w-[calc(100%-2rem)] max-w-sm bg-white p-8 text-charcoal-body shadow-2xl"
      >
        <h2 className="caps text-label font-bold text-black">Are you in the right place?</h2>
        <p className="mt-2 text-[13px] text-neutral-600">
          Choose your shipping country. We stitch for both, but delivery and currency differ.
        </p>
        <div className="mt-6 grid gap-3">
          <button type="button" popoverTarget="country-menu" popoverTargetAction="hide" className="btn-black">
            Pakistan · PKR
          </button>
          <a href={site.internationalUrl} className="btn-white !border-black !text-black">
            International
          </a>
        </div>
      </div>
    </HeaderFrame>
  );
}
