import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "./Brand";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { CATEGORIES, CITIES } from "@/data/events";
import { cn } from "@/utils/cn";

const PAYMENT_METHODS = ["VISA", "Mastercard", "AMEX", "Ozow", "SnapScan", "PayFlex"];

function Social({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist-400 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:text-gold-300"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  function submit(e: FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setState(ok ? "done" : "error");
    if (ok) setEmail("");
  }

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/8 bg-ink-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rule-gold" />
      <div className="pointer-events-none absolute -left-40 top-0 h-72 w-72 rounded-full bg-gold-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-coral-500/8 blur-[110px]" />

      <div className="shell relative py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_2fr]">
          {/* Brand + newsletter */}
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist-400">
              South Africa's premium ticketing platform. Official agent for 40+ venues and festivals —
              from Amapiano arena nights in Menlyn to the opera house on the Foreshore.
            </p>

            <form onSubmit={submit} className="mt-8 max-w-md">
              <label htmlFor="nl" className="eyebrow block">
                Never miss an on-sale
              </label>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  id="nl"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setState("idle");
                  }}
                  placeholder="you@email.co.za"
                  className={cn(
                    "h-12 w-full rounded-full border bg-white/[0.04] px-5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:outline-none",
                    state === "error"
                      ? "border-coral-500"
                      : "border-white/12 focus:border-gold-400/70",
                  )}
                />
                <button
                  type="submit"
                  className="btn btn-gold h-12 shrink-0 px-6 text-sm"
                >
                  {state === "done" ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {state === "done" ? "Subscribed" : "Subscribe"}
                  {state !== "done" && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
              <p
                className={cn(
                  "mt-2.5 text-xs transition-opacity",
                  state === "idle" ? "text-mist-500" : state === "done" ? "text-jade-400" : "text-coral-400",
                )}
              >
                {state === "done"
                  ? "You're on the list. Pre-sale alerts land every Thursday at 09:00."
                  : state === "error"
                    ? "Please enter a valid email address."
                    : "One email a week. Unsubscribe any time — we never sell your data."}
              </p>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mist-500">Explore</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/search?category=${c.id}`}
                      className="link-underline text-mist-300 transition-colors hover:text-gold-200"
                    >
                      {c.label} events
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/events" className="link-underline text-mist-300 hover:text-gold-200">
                    All events
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="link-underline text-mist-300 hover:text-gold-200">
                    My tickets
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mist-500">Cities</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {CITIES.slice(0, 6).map((city) => (
                  <li key={city}>
                    <Link
                      to={`/search?city=${encodeURIComponent(city)}`}
                      className="link-underline text-mist-300 hover:text-gold-200"
                    >
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mist-500">Support</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/faqs" className="link-underline text-mist-300 hover:text-gold-200">
                    Help centre
                  </Link>
                </li>
                <li>
                  <Link to="/faqs?category=ticketing" className="link-underline text-mist-300 hover:text-gold-200">
                    Refund policy
                  </Link>
                </li>
                <li>
                  <Link to="/faqs?category=venue" className="link-underline text-mist-300 hover:text-gold-200">
                    Venue access
                  </Link>
                </li>
                <li className="pt-2">
                  <a
                    href="tel:+27110245678"
                    className="flex items-center gap-2 text-mist-300 transition-colors hover:text-gold-200"
                  >
                    <Phone className="h-3.5 w-3.5" /> 011 024 5678
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@opentickets.co.za"
                    className="flex items-center gap-2 text-mist-300 transition-colors hover:text-gold-200"
                  >
                    <Mail className="h-3.5 w-3.5" /> support@opentickets.co.za
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-mist-500">
                    <MapPin className="h-3.5 w-3.5" /> 44 Stanley Ave, Milpark, JHB
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payments + socials */}
        <div className="mt-14 flex flex-col gap-6 border-t border-white/8 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist-500">
              <Lock className="h-3.5 w-3.5" /> Secure payments
            </span>
            {PAYMENT_METHODS.map((m) => (
              <span
                key={m}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-mist-300 transition-colors hover:border-gold-400/40 hover:text-gold-200"
              >
                {m}
              </span>
            ))}
            <span className="rounded-md border border-jade-400/25 bg-jade-400/8 px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-jade-400">
              PCI-DSS L1
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Social label="Instagram">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
              </svg>
            </Social>
            <Social label="X">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5.1 21H2l7.3-8.3L2.4 3h6.4l4.4 5.8L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z" />
              </svg>
            </Social>
            <Social label="Facebook">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3 0-1.3-.13-2.5-.13-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.7v8h3.5Z" />
              </svg>
            </Social>
            <Social label="TikTok">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M16.2 3h-2.6v11.1a2.3 2.3 0 1 1-2-2.3V9.2a4.9 4.9 0 1 0 4.6 4.9V8.5a5.6 5.6 0 0 0 3.3 1.1V7a3.4 3.4 0 0 1-3.3-3.4V3Z" />
              </svg>
            </Social>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 text-xs text-mist-500 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 OpenTickets (Pty) Ltd · Reg 2019/447812/07 · All rights reserved.</p>
          <ThemeSwitcher />
          <div className="flex flex-wrap gap-5">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gold-300">Terms of use</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gold-300">Privacy policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gold-300">POPIA</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gold-300">Organisers</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
