"use client";

import { Heart } from "lucide-react";
import { useWishlist, wishlistActions } from "./Store";

export function WishlistButton({
  slug,
  name,
  className = "",
  size = 20,
}: {
  slug: string;
  name: string;
  className?: string;
  size?: number;
}) {
  const active = useWishlist().includes(slug);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      onClick={() => wishlistActions.toggle(slug)}
      className={`transition-colors duration-(--duration-fast) hover:text-black ${
        active ? "text-black" : "text-neutral-500"
      } ${className}`}
    >
      <Heart size={size} strokeWidth={1.5} aria-hidden fill={active ? "currentColor" : "none"} />
    </button>
  );
}
