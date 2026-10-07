"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, invalidFields } from "../Field";
import { sessionActions, useSession } from "../Store";

const note = (
  <p className="caps mt-6 text-center text-[10px] text-neutral-400">
    Demo account: any e-mail and password sign you in on this device only. Nothing is sent anywhere.
  </p>
);

function useValidated(onValid: (data: FormData) => void) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = invalidFields(event.currentTarget);
    setErrors(invalid);
    if (!Object.keys(invalid).length) onValid(new FormData(event.currentTarget));
  };
  return { errors, submit };
}

function SignedIn() {
  const session = useSession();
  if (!session) return null;
  return (
    <p className="mb-6 border border-neutral-200 bg-ivory-base p-4 text-center text-[13px] text-neutral-600">
      You are signed in as {session.email}.{" "}
      <Link href="/account" className="link-underline text-black">
        Go to your account
      </Link>
    </p>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { errors, submit } = useValidated((data) => {
    const email = String(data.get("email")).trim();
    sessionActions.signIn({ name: email.split("@")[0], email, addresses: [] });
    router.push("/account");
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <SignedIn />
      <Field label="E-mail" name="email" type="email" required autoComplete="email" error={errors.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        error={errors.password}
      />
      <div className="flex items-center justify-between">
        <Link href="/account/forgot-password" className="link-underline text-[13px] text-neutral-500">
          Forgot your password?
        </Link>
      </div>
      <button type="submit" className="btn-black w-full">
        Sign in
      </button>
      <p className="text-center text-[13px] text-neutral-500">
        New to ZARKOONY?{" "}
        <Link href="/account/register" className="link-underline text-black">
          Create an account
        </Link>
      </p>
      {note}
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { errors, submit } = useValidated((data) => {
    const name = `${String(data.get("firstName")).trim()} ${String(data.get("lastName")).trim()}`.trim();
    sessionActions.signIn({ name, email: String(data.get("email")).trim(), addresses: [] });
    router.push("/account");
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <SignedIn />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" required autoComplete="given-name" error={errors.firstName} />
        <Field label="Last name" name="lastName" required autoComplete="family-name" error={errors.lastName} />
      </div>
      <Field label="E-mail" name="email" type="email" required autoComplete="email" error={errors.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        error={errors.password}
        hint="At least 8 characters."
      />
      <button type="submit" className="btn-black w-full">
        Create account
      </button>
      <p className="text-center text-[13px] text-neutral-500">
        Already have an account?{" "}
        <Link href="/account/login" className="link-underline text-black">
          Sign in
        </Link>
      </p>
      {note}
    </form>
  );
}

export function ForgotPasswordForm() {
  const [sent, setSent] = useState<string | null>(null);
  const { errors, submit } = useValidated((data) => setSent(String(data.get("email")).trim()));

  if (sent) {
    return (
      <p role="status" className="border border-neutral-200 bg-ivory-base p-6 text-center text-[13px] text-neutral-600">
        If an account exists for {sent}, a reset link is on its way. Check your junk folder too.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="E-mail" name="email" type="email" required autoComplete="email" error={errors.email} />
      <button type="submit" className="btn-black w-full">
        Send reset link
      </button>
      <p className="text-center text-[13px] text-neutral-500">
        <Link href="/account/login" className="link-underline text-black">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
