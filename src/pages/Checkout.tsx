import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Landmark,
  Lock,
  QrCode,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import { useCart, BOOKING_FEE, type CartLine } from "@/store/cart";
import { TicketStub, type StubData } from "@/components/TicketStub";
import { EVENTS, getEvent } from "@/data/events";
import { zar } from "@/lib/format";
import { usePageTitle } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

type PaymentId = "card" | "ozow" | "snapscan" | "payflex";

const PAYMENTS: { id: PaymentId; label: string; sub: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Card", sub: "Visa · Mastercard · Amex", icon: CreditCard },
  { id: "ozow", label: "Instant EFT", sub: "Ozow · all SA banks", icon: Landmark },
  { id: "snapscan", label: "SnapScan / Zapper", sub: "Scan to pay", icon: QrCode },
  { id: "payflex", label: "PayFlex", sub: "4 interest-free payments", icon: Wallet },
];

const PROMOS: Record<string, { type: "percent" | "flat"; value: number; label: string }> = {
  OPEN10: { type: "percent", value: 10, label: "10% loyalty discount" },
  WELCOME50: { type: "flat", value: 50, label: "R50 off your first order" },
};

function orderRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `OT-${s}`;
}

export default function Checkout() {
  const { lines, setQty, remove, clear, subtotal, fees, total } = useCart();
  const [step, setStep] = useState<"form" | "done">("form");
  /** Snapshot of the order at payment time — survives clearing the live cart. */
  const [placed, setPlaced] = useState<CartLine[]>([]);
  const [paidTotal, setPaidTotal] = useState(0);
  const [payment, setPayment] = useState<PaymentId>("card");
  const [delivery, setDelivery] = useState<"eticket" | "boxoffice">("eticket");
  const [reference, setReference] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; label: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "Thabo Mokoena",
    email: "thabo@opentickets.co.za",
    mobile: "082 555 0134",
    cardName: "T MOKOENA",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  usePageTitle(step === "done" ? "Booking confirmed" : "Secure checkout");

  const discount = promo
    ? (() => {
        const def = PROMOS[promo.code];
        if (!def) return 0;
        return def.type === "percent" ? Math.round((subtotal * def.value) / 100) : def.value;
      })()
    : 0;
  const grandTotal = Math.max(0, total - discount);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: "" }));
  };

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMOS[code]) {
      setPromo({ code, label: PROMOS[code].label });
      setPromoError("");
      setPromoInput("");
    } else {
      setPromo(null);
      setPromoError("That code isn't valid or has expired.");
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter the name on your ID";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.mobile.replace(/\D/g, "").length < 10) next.mobile = "Enter a valid SA mobile number";
    if (payment === "card") {
      if (form.cardNumber.replace(/\s/g, "").length < 15) next.cardNumber = "Enter your 16-digit card number";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) next.expiry = "MM/YY";
      if (form.cvv.replace(/\D/g, "").length < 3) next.cvv = "3 digits";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setReference(orderRef());
    setPaidTotal(grandTotal);
    setPlaced(lines);
    clear();
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------ Confirmation ------------------------------ */
  if (step === "done") {
    const stubs: StubData[] = placed.map((l, i) => {
      const ev = getEvent(l.eventSlug);
      return {
        key: `${l.key}-${i}`,
        title: l.eventTitle,
        image: l.image,
        date: l.date,
        venue: l.venue,
        city: l.city,
        tier: l.tierName,
        doors: ev?.doors,
        seats: l.seats,
        qty: l.qty,
        price: l.price,
        reference: `${reference}-${i + 1}`,
        status: "pending" as const,
      };
    });

    return (
      <div className="shell py-20 pt-[calc(var(--header-h)+3rem)]">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-jade-400/35 bg-jade-400/12 text-jade-400">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </span>
            <h1 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-tight">
              Booked. See you there.
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mist-400">
              Order <span className="font-mono text-gold-300">{reference}</span> confirmed for{" "}
              <span className="text-mist-200">{form.email}</span>. Your e-tickets are{" "}
              <span className="text-gold-300">pending activation</span> and will go live in your wallet 48 hours before
              doors open. An SMS is on its way.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {stubs.map((s) => (
              <TicketStub key={s.key} stub={s} />
            ))}
          </div>

          <div className="mt-8 grid gap-3 rounded-[var(--radius-card)] border border-white/8 bg-white/[0.02] p-5 sm:grid-cols-3">
            <div className="flex items-center justify-between gap-3 sm:block">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">Paid</span>
              <span className="block font-display text-2xl font-extrabold text-mist-100">{zar(paidTotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 sm:block">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">Method</span>
              <span className="block font-display text-base font-bold text-mist-100">
                {PAYMENTS.find((p) => p.id === payment)?.label} · {delivery === "eticket" ? "E-ticket" : "Box office"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 sm:block">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">Tickets</span>
              <span className="block font-display text-base font-bold text-mist-100">
                {placed.reduce((n, l) => n + l.qty, 0)} across {placed.length} events
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/account" className="btn btn-gold h-12 px-6 text-sm">
              Open my wallet <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/events"
              onClick={clear}
              className="btn btn-ghost h-12 px-6 text-sm"
            >
              Find another event
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------- Empty --------------------------------- */
  if (lines.length === 0) {
    const picks = [...EVENTS].sort((a, b) => b.soldPercent - a.soldPercent).slice(0, 3);
    return (
      <div className="shell py-24 pt-[calc(var(--header-h)+4rem)] text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-mist-500">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">Your cart is empty</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-mist-400">
          Add tickets from any event page and they'll appear here. These three are moving fastest this week:
        </p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {picks.map((e) => (
            <Link
              key={e.id}
              to={`/event/${e.slug}`}
              className="group rounded-2xl border border-white/8 bg-white/[0.02] p-3 text-left transition-all hover:-translate-y-1 hover:border-gold-400/35"
            >
              <img src={e.image} alt="" loading="lazy" className="aspect-[16/10] w-full rounded-xl object-cover" />
              <p className="mt-3 line-clamp-2 font-display text-sm font-bold text-mist-100 group-hover:text-gold-200">
                {e.title}
              </p>
              <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-mist-500">
                from {zar(e.priceFrom)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------------------------- Form --------------------------------- */
  const input =
    "h-12 w-full rounded-xl border bg-white/[0.03] px-4 text-sm text-mist-100 placeholder:text-mist-600 transition-colors focus:outline-none";

  return (
    <div className="pt-[calc(var(--header-h)+1.5rem)]">
      <div className="shell border-b border-white/8 pb-7 pt-6">
        <nav className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist-600">
          <Link to="/" className="hover:text-gold-300">Home</Link>
          <span>/</span>
          <span className="text-mist-400">Secure checkout</span>
        </nav>
        <h1 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-none">
          Secure checkout
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          {["Your details", "Delivery", "Payment"].map((s, i) => (
            <span key={s} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full font-mono text-[0.6rem]",
                  i === 2 ? "bg-gold-400 text-ink-900" : "border border-white/15 text-mist-400",
                )}
              >
                {i + 1}
              </span>
              <span className={cn("text-sm", i === 2 ? "font-semibold text-mist-100" : "text-mist-500")}>{s}</span>
              {i < 2 && <span className="hidden h-px w-10 bg-white/12 sm:block" />}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-jade-400">
            <Lock className="h-3.5 w-3.5" /> TLS 1.3 · PCI-DSS L1
          </span>
        </div>
      </div>

      <form id="checkout-form" onSubmit={submit} className="shell grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-8">
          {/* Contact */}
          <section className="rounded-[var(--radius-card)] border border-white/8 bg-ink-850/60 p-5 sm:p-6">
            <h2 className="font-display text-xl font-extrabold text-mist-100">1 · Your details</h2>
            <p className="mt-1.5 text-sm text-mist-500">Tickets are issued to this name and must match a photo ID at the gate.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name} className="sm:col-span-2">
                <input value={form.name} onChange={set("name")} placeholder="As per your ID document"
                  className={cn(input, errors.name ? "border-coral-500" : "border-white/10 focus:border-gold-400/60")} />
              </Field>
              <Field label="Email address" error={errors.email}>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.co.za"
                  className={cn(input, errors.email ? "border-coral-500" : "border-white/10 focus:border-gold-400/60")} />
              </Field>
              <Field label="Mobile number" error={errors.mobile}>
                <input value={form.mobile} onChange={set("mobile")} placeholder="082 000 0000"
                  className={cn(input, errors.mobile ? "border-coral-500" : "border-white/10 focus:border-gold-400/60")} />
              </Field>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-[var(--radius-card)] border border-white/8 bg-ink-850/60 p-5 sm:p-6">
            <h2 className="font-display text-xl font-extrabold text-mist-100">2 · Delivery</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { id: "eticket" as const, label: "Mobile e-ticket", sub: "Free · rotating barcode in your wallet", icon: Smartphone },
                { id: "boxoffice" as const, label: "Collect at box office", sub: "R0 · bring your ID and order reference", icon: QrCode },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDelivery(d.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300",
                    delivery === d.id
                      ? "border-gold-400/55 bg-gold-400/[0.08] shadow-gold"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25",
                  )}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-gold-300">
                    <d.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-mist-100">{d.label}</span>
                    <span className="mt-0.5 block text-xs text-mist-500">{d.sub}</span>
                  </span>
                  <span
                    className={cn(
                      "ml-auto mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border transition-colors",
                      delivery === d.id ? "border-gold-400 bg-gold-400 text-ink-900" : "border-white/25",
                    )}
                  >
                    {delivery === d.id && <Check className="h-3 w-3" strokeWidth={4} />}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-[var(--radius-card)] border border-white/8 bg-ink-850/60 p-5 sm:p-6">
            <h2 className="font-display text-xl font-extrabold text-mist-100">3 · Payment</h2>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {PAYMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayment(p.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300",
                    payment === p.id
                      ? "border-gold-400/55 bg-gold-400/[0.08]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25",
                  )}
                >
                  <p.icon className={cn("h-4.5 w-4.5 shrink-0", payment === p.id ? "text-gold-300" : "text-mist-400")} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-mist-100">{p.label}</span>
                    <span className="block truncate text-xs text-mist-500">{p.sub}</span>
                  </span>
                </button>
              ))}
            </div>

            {payment === "card" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Name on card" className="sm:col-span-2">
                  <input value={form.cardName} onChange={set("cardName")}
                    className={cn(input, "border-white/10 font-mono uppercase focus:border-gold-400/60")} />
                </Field>
                <Field label="Card number" error={errors.cardNumber} className="sm:col-span-2">
                  <input
                    value={form.cardNumber}
                    inputMode="numeric"
                    placeholder="4000 0000 0000 0000"
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setForm((f) => ({ ...f, cardNumber: digits.replace(/(.{4})/g, "$1 ").trim() }));
                      setErrors((x) => ({ ...x, cardNumber: "" }));
                    }}
                    className={cn(input, "font-mono tracking-wider", errors.cardNumber ? "border-coral-500" : "border-white/10 focus:border-gold-400/60")}
                  />
                </Field>
                <Field label="Expiry" error={errors.expiry}>
                  <input
                    value={form.expiry}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setForm((f) => ({ ...f, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                      setErrors((x) => ({ ...x, expiry: "" }));
                    }}
                    className={cn(input, "font-mono", errors.expiry ? "border-coral-500" : "border-white/10 focus:border-gold-400/60")}
                  />
                </Field>
                <Field label="CVV" error={errors.cvv}>
                  <input value={form.cvv} inputMode="numeric" placeholder="123"
                    onChange={(e) => {
                      setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }));
                      setErrors((x) => ({ ...x, cvv: "" }));
                    }}
                    className={cn(input, "font-mono", errors.cvv ? "border-coral-500" : "border-white/10 focus:border-gold-400/60")} />
                </Field>
              </div>
            )}

            {payment !== "card" && (
              <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-xs leading-relaxed text-mist-400">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {payment === "ozow" && "You'll be redirected to your bank to authorise the instant EFT. No card details are stored and the payment confirms in under 30 seconds."}
                {payment === "snapscan" && "A QR code appears after you tap Pay — scan it with your SnapScan or Zapper app to complete the payment."}
                {payment === "payflex" && "Pay 25% today and the balance over three interest-free fortnightly instalments. Your tickets are issued immediately."}
              </p>
            )}

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-jade-400/20 bg-jade-400/[0.06] p-4">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-jade-400" />
              <p className="text-xs leading-relaxed text-mist-300">
                Card details are tokenised by our PCI-DSS Level 1 gateway and never stored on OpenTickets servers.
                3-D Secure verification applies to all South African issuers.
              </p>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h-sm)+1.5rem)] lg:self-start">
          <div className="glass overflow-hidden rounded-[var(--radius-card)] shadow-lift">
            <h2 className="border-b border-white/8 px-5 py-4 font-display text-lg font-extrabold text-mist-100">
              Order summary
            </h2>
            <ul className="max-h-[38vh] space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-3">
                  <img src={l.image} alt="" loading="lazy" className="h-16 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-mist-100">{l.eventTitle}</p>
                    <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-wider text-mist-500">
                      {l.tierName}
                      {l.seats && l.seats.length > 0 ? ` · ${l.seats.join(", ")}` : ""}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-0.5 rounded-full border border-white/10 p-0.5">
                        <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease"
                          className="grid h-5 w-5 place-items-center rounded-full text-mist-400 hover:bg-white/10 hover:text-mist-100">
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-mono text-[0.66rem] tabular-nums text-mist-100">{l.qty}</span>
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase"
                          className="grid h-5 w-5 place-items-center rounded-full text-mist-400 hover:bg-white/10 hover:text-mist-100">
                          <span className="text-sm leading-none">+</span>
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(l.key)} aria-label="Remove line"
                        className="text-mist-600 transition-colors hover:text-coral-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-auto font-display text-sm font-bold text-mist-100">{zar(l.price * l.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/8 px-5 py-4">
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError("");
                  }}
                  placeholder="Promo code"
                  className="h-10 flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 font-mono text-xs uppercase tracking-wider text-mist-100 placeholder:normal-case placeholder:tracking-normal placeholder:text-mist-600 focus:border-gold-400/60 focus:outline-none"
                />
                <button type="button" onClick={applyPromo} className="btn btn-ghost h-10 px-4 text-xs">
                  Apply
                </button>
              </div>
              {promoError && <p className="mt-2 text-xs text-coral-400">{promoError}</p>}
              {promo && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-jade-400">
                  <Check className="h-3.5 w-3.5" /> {promo.code} applied — {promo.label}
                </p>
              )}
              <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-wider text-mist-600">
                Try OPEN10 or WELCOME50
              </p>
            </div>

            <dl className="space-y-1.5 border-t border-white/8 px-5 py-4 text-sm">
              <div className="flex justify-between text-mist-400">
                <dt>Subtotal</dt>
                <dd className="tabular-nums text-mist-200">{zar(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-mist-400">
                <dt>Booking fee ({lines.length} × {zar(BOOKING_FEE)})</dt>
                <dd className="tabular-nums text-mist-200">{zar(fees)}</dd>
              </div>
              <div className="flex justify-between text-mist-400">
                <dt>Delivery</dt>
                <dd className="text-jade-400">Free</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-jade-400">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">− {zar(discount)}</dd>
                </div>
              )}
              <div className="mt-2 flex items-end justify-between border-t border-white/8 pt-3">
                <dt className="font-display text-base font-bold text-mist-100">Total due</dt>
                <dd className="font-display text-3xl font-extrabold tabular-nums text-gold-300">{zar(grandTotal)}</dd>
              </div>
            </dl>

            <div className="px-5 pb-5">
              <button type="submit" className="btn btn-gold h-13 w-full text-[0.95rem]">
                <Lock className="h-4 w-4" /> Pay {zar(grandTotal)}
              </button>
              <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-mist-600">
                By paying you accept the{" "}
                <Link to="/faqs?category=ticketing" className="text-gold-400 underline decoration-gold-400/40 underline-offset-2">
                  booking terms
                </Link>{" "}
                of each event's organiser.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist-500">
        {label}
        {error && <span className="normal-case tracking-normal text-coral-400">{error}</span>}
      </span>
      {children}
    </label>
  );
}
