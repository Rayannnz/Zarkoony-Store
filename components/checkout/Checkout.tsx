"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { facts } from "@/lib/content";
import {
  cartSubtotal,
  countryName,
  createOrder,
  deliveryFee,
  paymentMethodsFor,
  provinces,
  stitchingWindow,
  type Address,
  type PaymentMethod,
} from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { Field, fieldClass, fieldLabelClass, invalidFields } from "../Field";
import { LineItem, Totals } from "../orders/OrderParts";
import { Price } from "../Price";
import { cartActions, orderActions, sessionActions, useCart, useHydrated, useRegion, useSession } from "../Store";

const section = "space-y-4 border-t border-neutral-200 pt-6";
const sectionTitle = "caps text-label font-bold text-black";
const checkbox =
  "mt-0.5 size-4 shrink-0 appearance-none border border-neutral-400 bg-white checked:border-black checked:bg-black";
const radio =
  "mt-0.5 size-4 shrink-0 appearance-none border border-neutral-400 bg-white checked:border-4 checked:border-black";
/** A selectable card: the border darkens with the radio inside it, so the choice reads at a glance. */
const choice =
  "flex cursor-pointer items-start gap-3 border border-neutral-200 p-4 transition-colors duration-(--duration-fast) has-checked:border-black";
const step = "caps text-[11px] text-black";
const MAX_PROOF_BYTES = 5 * 1024 * 1024;

/**
 * Mock checkout: validates with the browser, builds an order, stores it on this device and hands
 * off to the confirmation page. The country decides the address fields, the delivery charge and
 * the payment methods: Pakistan pays on delivery or by bank transfer with the receipt attached
 * here; the United States pays in advance through Stripe. Card and bank details are never
 * requested on this page. Nobody has to sign in; creating an account is an opt-in checkbox.
 */
export function Checkout() {
  const cart = useCart();
  const hydrated = useHydrated();
  const session = useSession();
  const router = useRouter();
  const region = useRegion();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [express, setExpress] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  // The region (detected, or picked in the header chooser) is the delivery country; it decides the method.
  const [paymentChoice, setPaymentChoice] = useState<PaymentMethod | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [pending, setPending] = useState(false);

  // Preview for an image receipt; a PDF just shows its name.
  const proofUrl = useMemo(() => (proof?.type.startsWith("image/") ? URL.createObjectURL(proof) : null), [proof]);
  useEffect(() => () => void (proofUrl && URL.revokeObjectURL(proofUrl)), [proofUrl]);

  if (!hydrated) {
    return (
      <div aria-busy="true" className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="skeleton h-96" />
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (cart.length === 0 && !pending) {
    return (
      <div className="py-16 text-center">
        <p className="caps text-[11px] text-black">Your cart is empty</p>
        <p className="mt-3 text-[13px] text-neutral-500">Add a piece before checking out.</p>
        <Link href="/shop" className="btn-black mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  const country = region;
  const subtotal = cartSubtotal(cart);
  const delivery = deliveryFee(country);
  const expressFee = express ? facts.express.fee : 0;
  const total = subtotal + delivery + expressFee;
  const window = express ? [facts.express.days, facts.express.days] : stitchingWindow(cart);
  const savedAddress = session?.addresses[0];
  const methods = paymentMethodsFor(country);
  const payment = paymentChoice && methods.some((m) => m.value === paymentChoice) ? paymentChoice : methods[0].value;
  const viaStripe = methods.find((m) => m.value === payment)?.via === "stripe";

  const chooseProof = (input: HTMLInputElement) => {
    const file = input.files?.[0] ?? null;
    input.setCustomValidity(file && file.size > MAX_PROOF_BYTES ? "Keep the receipt under 5 MB." : "");
    setProof(file);
    setErrors((prev) => ({ ...prev, proof: "" }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = invalidFields(form);
    setErrors(invalid);
    if (Object.keys(invalid).length) return;

    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const address: Address = {
      fullName: text("fullName"),
      phone: text("phone"),
      line1: text("line1"),
      line2: text("line2") || undefined,
      city: text("city"),
      province: text("province"),
      postcode: text("postcode") || undefined,
      country,
    };
    const order = createOrder(cart, {
      email: text("email"),
      address,
      payment,
      express,
      // The receipt file itself stays on the customer's device: this store has nowhere to send it.
      transfer:
        payment === "bank"
          ? {
              accountName: text("transferName"),
              bank: text("transferBank"),
              reference: text("transferRef"),
              proofName: proof?.name ?? "",
            }
          : undefined,
    });

    setPending(true);
    orderActions.place(order);
    if (!session && createAccount) {
      // The register flow's sign-in, with the delivery details saved for next time.
      sessionActions.signIn({ name: address.fullName, email: order.email, addresses: [address] });
    }
    // ponytail: US methods are advance payments. A real integration posts the order to a route
    // handler that creates a Stripe Checkout Session and redirects to its URL, with the
    // confirmation page as the success_url. Until keys exist, the order lands there directly.
    router.push(`/checkout/confirmation?order=${order.id}`);
    cartActions.clear();
  };

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className={sectionTitle}>Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="E-mail"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={session?.email}
              error={errors.email}
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder={country === "PK" ? "+92 3XX XXXXXXX" : "+1 (555) 000-0000"}
              defaultValue={savedAddress?.phone}
              error={errors.phone}
              hint="For fitting questions and delivery updates on WhatsApp."
            />
          </div>
          {!session && (
            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-3 text-[13px] text-neutral-700">
                <input
                  type="checkbox"
                  name="createAccount"
                  checked={createAccount}
                  onChange={(event) => setCreateAccount(event.target.checked)}
                  className={checkbox}
                />
                <span>
                  <span className="caps block text-[11px] text-black">Create an account (optional)</span>
                  Save these details for future orders and track this commission in your account.
                </span>
              </label>
              {/* Only rendered when ticked, so a hidden required field can never block a guest order. */}
              {createAccount && (
                <Field
                  label="Password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  error={errors.password}
                  hint="At least 8 characters. Demo account: nothing is sent or stored."
                />
              )}
            </div>
          )}
        </section>

        <section className={section}>
          <h2 className={sectionTitle}>Delivery address</h2>
          <p className="text-[13px] text-neutral-600">
            Delivering to <span className="text-black">{countryName(country)}</span>.{" "}
            <button type="button" popoverTarget="country-menu" className="link-underline text-black">
              Change
            </button>
          </p>
          <Field
            label="Full name"
            name="fullName"
            required
            autoComplete="name"
            defaultValue={savedAddress?.fullName ?? session?.name}
            error={errors.fullName}
          />
          <Field
            label="Address"
            name="line1"
            required
            autoComplete="address-line1"
            defaultValue={savedAddress?.line1}
            error={errors.line1}
          />
          <Field
            label={country === "PK" ? "Apartment, floor, landmark (optional)" : "Apartment, suite, unit (optional)"}
            name="line2"
            autoComplete="address-line2"
            defaultValue={savedAddress?.line2}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              label="City"
              name="city"
              required
              autoComplete="address-level2"
              defaultValue={savedAddress?.city}
              error={errors.city}
            />
            {country === "PK" ? (
              <label className="block">
                <span className={fieldLabelClass}>Province</span>
                <select
                  name="province"
                  required
                  defaultValue={savedAddress?.province ?? ""}
                  aria-invalid={!!errors.province || undefined}
                  className={`${fieldClass} cursor-pointer`}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <span role="alert" className="mt-1 block text-[12px] text-red-700">
                    {errors.province}
                  </span>
                )}
              </label>
            ) : (
              <Field
                label="State"
                name="province"
                required
                autoComplete="address-level1"
                placeholder="e.g. NY"
                error={errors.province}
              />
            )}
            <Field
              label={country === "PK" ? "Postcode (optional)" : "ZIP code"}
              name="postcode"
              required={country === "US"}
              inputMode="numeric"
              autoComplete="postal-code"
              defaultValue={savedAddress?.postcode}
              error={errors.postcode}
            />
          </div>
        </section>

        <section className={section}>
          <h2 className={sectionTitle}>Stitching</h2>
          <p className="text-[13px] text-neutral-600">
            Standard window for this order: {stitchingWindow(cart)[0]}–{stitchingWindow(cart)[1]}{" "}
            working days. {facts.stitchingNote}
          </p>
          <label className={choice}>
            <input
              type="checkbox"
              name="express"
              checked={express}
              onChange={(event) => setExpress(event.target.checked)}
              className={checkbox}
            />
            <span className="text-[13px] text-neutral-700">
              <span className="caps block text-[11px] text-black">
                Priority stitching · <Price value={facts.express.fee} />
              </span>
              Your commission moves to the front of the atelier and ships within {facts.express.days}{" "}
              working days.
            </span>
          </label>
        </section>

        <section className={section}>
          <h2 className={sectionTitle}>Payment</h2>
          <p className="text-[13px] text-neutral-600">
            {country === "PK"
              ? "Pay the courier when your piece arrives, or transfer in advance and attach the receipt here."
              : "Orders to the United States are paid in advance through Stripe. Prices are in PKR; Stripe charges the equivalent in USD at the rate on the day."}
          </p>
          <div role="radiogroup" aria-label="Payment method" className="space-y-3">
            {methods.map((m) => (
              <label key={m.value} className={choice}>
                <input
                  type="radio"
                  name="payment"
                  value={m.value}
                  checked={payment === m.value}
                  onChange={() => setPaymentChoice(m.value)}
                  className={radio}
                />
                <span className="text-[13px] text-neutral-700">
                  <span className="caps block text-[11px] text-black">
                    {m.label}
                    {m.via === "stripe" && <span className="ml-2 text-neutral-400">via Stripe</span>}
                  </span>
                  {m.detail}
                </span>
              </label>
            ))}
          </div>

          {/* Only the chosen method's requirements are shown, so nothing hidden can block the order. */}
          {payment === "bank" && (
            <div className="space-y-5 border border-neutral-200 p-4 sm:p-5">
              <div>
                <p className={step}>1 · Transfer {formatPrice(total)} to</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[13px] text-neutral-600">
                  <dt>Bank</dt>
                  <dd className="text-black">{facts.bankAccount.bank}</dd>
                  <dt>Account title</dt>
                  <dd className="text-black">{facts.bankAccount.title}</dd>
                  <dt>IBAN</dt>
                  <dd className="select-all text-black">{facts.bankAccount.iban}</dd>
                </dl>
              </div>
              <div className="space-y-4">
                <p className={step}>2 · Your transfer details</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Account holder"
                    name="transferName"
                    required
                    autoComplete="off"
                    error={errors.transferName}
                    hint="The name on the account you paid from."
                  />
                  <Field label="Bank" name="transferBank" required autoComplete="off" error={errors.transferBank} />
                </div>
                <Field
                  label="Transaction reference"
                  name="transferRef"
                  required
                  autoComplete="off"
                  error={errors.transferRef}
                  hint="The transaction or reference ID printed on your receipt."
                />
              </div>
              <div>
                <p className={step}>3 · Attach the receipt</p>
                <label className="mt-2 flex cursor-pointer items-center gap-4 border border-dashed border-neutral-300 p-4 transition-colors duration-(--duration-fast) hover:border-black has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-black">
                  <input
                    type="file"
                    name="proof"
                    accept="image/*,.pdf"
                    required
                    onChange={(event) => chooseProof(event.currentTarget)}
                    aria-invalid={!!errors.proof || undefined}
                    aria-describedby="proof-note"
                    className="sr-only"
                  />
                  {proofUrl ? (
                    <Image src={proofUrl} alt="" width={56} height={56} unoptimized className="size-14 shrink-0 object-cover" />
                  ) : (
                    <span className="flex size-14 shrink-0 items-center justify-center bg-ivory-base text-neutral-500">
                      <Upload size={20} strokeWidth={1.5} aria-hidden />
                    </span>
                  )}
                  <span className="min-w-0 text-[13px] text-neutral-700">
                    <span className="caps block truncate text-[11px] text-black">
                      {proof ? proof.name : "Upload payment screenshot"}
                    </span>
                    {proof ? "Choose another file to replace it." : "A screenshot or PDF of the transfer, up to 5 MB."}
                  </span>
                </label>
                <p
                  id="proof-note"
                  role={errors.proof ? "alert" : undefined}
                  className={`mt-1 text-[12px] ${errors.proof ? "text-red-700" : "text-neutral-500"}`}
                >
                  {errors.proof || "The concierge matches it to your order and confirms within one working day."}
                </p>
              </div>
            </div>
          )}

          {viaStripe && (
            <div className="space-y-3 border border-neutral-200 p-4 text-[13px] text-neutral-600 sm:p-5">
              <p className={step}>How payment works</p>
              <ol className="list-decimal space-y-1.5 pl-5">
                <li>Place the order and you are taken to Stripe&apos;s secure checkout.</li>
                <li>
                  {payment === "card"
                    ? "Enter your card there. Visa, Mastercard, American Express and Discover are accepted."
                    : "Connect your US bank account there. ACH transfers settle in 1 to 3 business days."}
                </li>
                <li>Stitching begins once Stripe confirms the payment, and Stripe e-mails you the receipt.</li>
              </ol>
              <p className="text-[12px] text-neutral-500">
                Card and bank details are entered on Stripe only; ZARKOONY never sees or stores them.
              </p>
            </div>
          )}
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-neutral-200 p-6">
          <h2 className={sectionTitle}>Your commission</h2>
          <div className="mt-2 divide-y divide-neutral-200">
            {cart.map((line) => (
              <LineItem key={line.id} line={line} />
            ))}
          </div>
          <div className="mt-2 border-t border-neutral-200 pt-2">
            <Totals subtotal={subtotal} delivery={delivery} expressFee={expressFee} total={total} />
          </div>
          <p className="mt-4 text-[13px] text-neutral-500">
            Stitching {window[0]}–{window[1]} working days, then{" "}
            {(country === "PK" ? facts.deliveryPakistan : facts.internationalDelivery.note).toLowerCase()}
          </p>
          <button type="submit" disabled={pending} className="btn-black mt-6 w-full disabled:opacity-60">
            {pending ? (viaStripe ? "Opening Stripe…" : "Placing order…") : viaStripe ? "Continue to Stripe" : "Place order"}
          </button>
          <p className="mt-4 text-[12px] text-neutral-500">
            By placing an order you agree to our{" "}
            <Link href="/policies/terms" className="link-underline text-black">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/policies/refund" className="link-underline text-black">
              refund policy
            </Link>
            .
          </p>
        </div>
      </aside>
    </form>
  );
}
