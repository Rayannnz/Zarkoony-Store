"use client"; // Error boundaries must be client components.

import Link from "next/link";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center md:py-36">
      <p className="caps text-[11px] text-neutral-500">Something went wrong</p>
      <h1 className="caps mt-3 text-[clamp(1.375rem,1.18rem+0.86vw,2rem)] leading-[1.4] text-black">
        A thread came loose
      </h1>
      <p className="mt-4 text-[15px] text-neutral-600">
        The page could not be shown. Try again, or return to the shop; your cart is safe.
      </p>
      {error.digest && <p className="caps mt-2 text-[10px] text-neutral-400">Ref {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn-black">
          Try again
        </button>
        <Link href="/shop" className="btn-white !border-black !text-black">
          Shop all
        </Link>
      </div>
    </section>
  );
}
