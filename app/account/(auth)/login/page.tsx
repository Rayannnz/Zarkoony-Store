import type { Metadata } from "next";
import { LoginForm } from "@/components/account/AuthForms";
import { headingClass } from "@/components/shop/Listing";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return (
    <>
      <h1 className={`${headingClass} text-center`}>Sign in</h1>
      <p className="mb-8 mt-3 text-center text-[13px] text-neutral-500">Welcome back to the atelier.</p>
      <LoginForm />
    </>
  );
}
