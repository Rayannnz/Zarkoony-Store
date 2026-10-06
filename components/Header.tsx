import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { HeaderFrame } from "./HeaderFrame";
import { Trigger } from "./Overlays";

const icon = { size: 24, strokeWidth: 1.5, "aria-hidden": true } as const;

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
          <div className="caps hidden items-center gap-1 text-[11px] lg:flex">
            <span>Pakistan</span>
            <span className="opacity-60">PKR</span>
            <ChevronDown size={15} strokeWidth={1.5} className="-mr-1" aria-hidden />
          </div>
          <a href="#account" aria-label="Account" className={iconButton}>
            <User {...icon} />
          </a>
          <Trigger opens="search" aria-label="Search" className={iconButton}>
            <Search {...icon} />
          </Trigger>
          <Trigger
            opens="measure"
            item={{ title: "Custom Atelier Order", price: 28500 }}
            aria-label="Shopping bag, 1 item"
            className={`relative ${iconButton}`}
          >
            <ShoppingBag {...icon} />
            <span
              aria-hidden
              className="absolute right-1.5 top-2 size-2 rounded-full bg-current ring-2 ring-(--header-bg) transition-transform duration-200"
            />
          </Trigger>
          <a href="#wishlist" aria-label="Wishlist" className={`hidden sm:inline-flex ${iconButton}`}>
            <Heart {...icon} />
          </a>
        </div>
      </div>
    </HeaderFrame>
  );
}
