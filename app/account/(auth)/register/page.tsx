import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/AuthForms";
import { headingClass } from "@/components/shop/Listing";

export const metadata: Metadata = { title: "Create account" };

export default function Page() {
  return (
    <>
      <h1 className={`${headingClass} text-center`}>Create account</h1>
      <p className="mb-8 mt-3 text-center text-[13px] text-neutral-500">Save your measurements and follow every commission.</p>
      <RegisterForm />
    </>
  );
}
