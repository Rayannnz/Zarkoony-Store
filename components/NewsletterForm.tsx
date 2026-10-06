"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <form
      className="space-y-3 pt-1"
      onSubmit={(event) => {
        event.preventDefault();
        event.currentTarget.reset();
        setSubscribed(true);
      }}
    >
      {/* 16px on phones so iOS doesn't zoom the page on focus. */}
      <input
        type="email"
        required
        autoComplete="email"
        aria-label="E-mail address"
        placeholder="E-mail"
        className="w-full border border-neutral-800 bg-[#181818] px-4 py-3 text-base leading-6 text-white outline-hidden transition-colors placeholder:text-neutral-500 focus:border-white sm:text-[15px]"
      />
      <button type="submit" className="btn-white w-full">
        Subscribe
      </button>
      {subscribed && (
        <p role="status" className="text-neutral-400">
          Subscribed to ZARKOONY Atelier.
        </p>
      )}
    </form>
  );
}
