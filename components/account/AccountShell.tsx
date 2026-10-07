"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sessionActions, useHydrated, useSession } from "../Store";

const links = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Profile", href: "/account/profile" },
  { label: "Addresses", href: "/account/addresses" },
];

/** Gate for the signed-in pages: skeleton until storage is readable, sign-in prompt without a session. */
export function AccountShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const hydrated = useHydrated();
  const pathname = usePathname();
  const router = useRouter();

  if (!hydrated) {
    return <div aria-busy="true" className="skeleton h-72" />;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <p className="caps text-[11px] text-black">Sign in to continue</p>
        <p className="mt-3 text-[13px] text-neutral-500">
          Your orders, measurements and addresses live in your account.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/login" className="btn-black">
            Sign in
          </Link>
          <Link href="/account/register" className="btn-white !border-black !text-black">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
      <nav aria-label="Account" className="caps flex flex-wrap gap-x-6 gap-y-3 border-b border-neutral-200 pb-4 text-[11px] lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
        {links.map((link) => {
          const active = link.href === "/account" ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`transition-colors duration-(--duration-fast) ${active ? "text-black" : "text-neutral-500 hover:text-black"}`}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => {
            sessionActions.signOut();
            router.push("/");
          }}
          className="caps text-left text-neutral-500 transition-colors duration-(--duration-fast) hover:text-black"
        >
          Sign out
        </button>
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
