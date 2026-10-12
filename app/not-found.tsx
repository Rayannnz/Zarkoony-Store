import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center md:py-36">
      <p className="caps text-[11px] font-semibold text-neutral-500">404</p>
      <h1 className="heading mt-3 text-title text-black">
        Page not found
      </h1>
      <p className="mt-4 text-[15px] text-neutral-600">
        The page you were looking for has moved or never existed. Everything we make is still here.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-black">
          Shop all
        </Link>
        <Link href="/" className="btn-white !border-black !text-black">
          Home
        </Link>
      </div>
    </section>
  );
}
