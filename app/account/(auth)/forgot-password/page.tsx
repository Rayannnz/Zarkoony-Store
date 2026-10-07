import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/AuthForms";
import { headingClass } from "@/components/shop/Listing";

export const metadata: Metadata = { title: "Reset password" };

export default function Page() {
  return (
    <>
      <h1 className={`${headingClass} text-center`}>Reset password</h1>
      <p className="mb-8 mt-3 text-center text-[13px] text-neutral-500">Enter your e-mail and we will send a reset link.</p>
      <ForgotPasswordForm />
    </>
  );
}
