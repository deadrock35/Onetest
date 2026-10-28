import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, User, X, ChevronDown, Ticket } from "lucide-react";
import { Logo } from "./Brand";
import { useCart } from "@/store/cart";
import { useScrollLock, useScrollY } from "@/hooks/useUi";
import { cn } from "@/utils/cn";
import { TRENDING } from "@/data/events";
import { countdownLabel } from "@/lib/format";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/search", label: "Search" },
  { to: "/faqs", label: "FAQs" },
];

const ACCOUNT_LINKS = [
  { to: "/account", label: "My tickets", icon: Ticket },
  { to: "/account?tab=orders", label: "Order history" },
  { to: "/faqs", label: "Help centre" },
];

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const y = useScrollY();
  const shrunk = y > 24;
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [noticeIndex, setNoticeIndex] = useState(0);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  useScrollLock(mobileOpen);

  useEffect(() => {
    const t = setInterval(() => setNoticeIndex((i) => (i + 1) % TRENDING.length), 4200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const notice = TRENDING[noticeIndex % TRENDING.length];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement strip — collapses on scroll */}
      <div
        className={cn(
          "overflow-hidden border-b border-white/5 bg-ink-950/90 backdrop-blur-xl transition-[height,opacity] duration-500",
          shrunk ? "h-0 opacity-0" : "h-9 opacity-100",
        )}
      >
        <div className="shell flex h-9 items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/event/${notice.slug}`)}
            className="group flex min-w-0 items-center gap-2 text-left"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral-500" />
            </span>
            <span className="truncate font-mono text-[0.66rem] uppercase tracking-[0.18em] text-mist-400 group-hover:text-gold-300">
              Selling fast · {notice.title} · {countdownLabel(notice.date)}
            </span>
          </button>
          <span className="hidden shrink-0 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-mist-500 sm:block">
            Free e-ticket delivery · Support 07:00–23:00
          </span>
        </div>
      </div>

      <div
        className={cn(
          "border-b transition-all duration-500",
          shrunk
            ? "border-white/10 bg-ink-900/85 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-transparent bg-gradient-to-b from-ink-950/80 to-transparent backdrop-blur-[2px]",
        )}
      >
        <div className="shell flex items-center gap-3 lg:gap-6">
          <div
            className={cn("flex items-center transition-all duration-500", shrunk ? "py-2.5" : "py-4")}
          >
            <Link to="/" aria-label="OpenTickets home">
              <Logo compact={shrunk} />
            </Link>
          </div>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    isActive ? "text-gold-300" : "text-mist-300 hover:text-mist-100",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gradient-to-r from-gold-400 to-transparent transition-transform duration-400",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
            <button
              onClick={onOpenSearch}
              className="group hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-mist-400 transition-all duration-300 hover:border-gold-400/50 hover:text-mist-100 md:flex"
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden xl:inline">Search artists, events…</span>
              <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.6rem] text-mist-500 xl:inline">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={onOpenSearch}
              aria-label="Search events"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist-300 transition-colors hover:border-gold-400/50 hover:text-gold-300 md:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className={cn(
                  "flex h-10 items-center gap-1.5 rounded-full border border-white/10 px-3 text-mist-300 transition-colors hover:border-gold-400/50 hover:text-gold-300",
                  accountOpen && "border-gold-400/60 text-gold-300",
                )}
              >
                <User className="h-4 w-4" />
                <span className="hidden text-sm font-medium sm:inline">Account</span>
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-300", accountOpen && "rotate-180")}
                />
              </button>
              <div
                className={cn(
                  "absolute right-0 top-[calc(100%+10px)] w-64 origin-top-right rounded-2xl border border-white/10 bg-ink-850/95 p-2 shadow-lift backdrop-blur-2xl transition-all duration-250",
                  accountOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
                )}
              >
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 font-display text-sm font-bold text-ink-900">
                    TM
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-mist-100">Thabo Mokoena</span>
                    <span className="block truncate font-mono text-[0.66rem] text-mist-500">
                      thabo@opentickets.co.za
                    </span>
                  </span>
                </div>
                <div className="my-1.5 h-px bg-white/8" />
                {ACCOUNT_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-mist-300 transition-colors hover:bg-white/[0.06] hover:text-gold-200"
                  >
                    {l.label}
                  </Link>
                ))}
                <button className="mt-1 w-full rounded-lg bg-gold-400 px-3 py-2.5 text-sm font-semibold text-ink-900 transition-transform hover:-translate-y-0.5">
                  Sign in
                </button>
              </div>
            </div>

            <button
              onClick={open}
              aria-label={`Cart, ${count} items`}
              className="relative flex h-10 items-center gap-2 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 px-3.5 font-semibold text-ink-900 shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={2.4} />
              <span className="text-sm tabular-nums">{count}</span>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink-900 bg-coral-500" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist-200 lg:hidden"
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-b border-white/10 bg-ink-900/97 backdrop-blur-2xl transition-[max-height,opacity] duration-500 lg:hidden",
          mobileOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="shell flex flex-col gap-1 py-4">
          {NAV.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg font-semibold transition-colors",
                  isActive ? "bg-white/[0.06] text-gold-300" : "text-mist-200 hover:bg-white/[0.04]",
                )
              }
              style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
            >
              {item.label}
              <span className="font-mono text-[0.6rem] text-mist-500">0{i + 1}</span>
            </NavLink>
          ))}
          <Link
            to="/account"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-gold-400/40 px-4 py-3 text-sm font-semibold text-gold-300"
          >
            <Ticket className="h-4 w-4" /> My tickets
          </Link>
        </nav>
      </div>
    </header>
  );
}
