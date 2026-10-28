import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, TicketCheck, Trash2, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { TRENDING } from "@/data/events";
import { longDate, zar } from "@/lib/format";
import { useEscape, useScrollLock } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, subtotal, fees, total, count } = useCart();
  const navigate = useNavigate();
  useScrollLock(isOpen);
  useEscape(isOpen, close);

  return (
    <div className={cn("fixed inset-0 z-[70]", !isOpen && "pointer-events-none")} aria-hidden={!isOpen}>
      <button
        aria-label="Close cart"
        onClick={close}
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          "absolute inset-0 cursor-default bg-ink-950/75 backdrop-blur-sm transition-opacity duration-400",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-ink-900 shadow-lift transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,.9,.24,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-400/12 text-gold-300">
              <ShoppingBag className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold leading-none text-mist-100">Your cart</h2>
              <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist-500">
                {count} {count === 1 ? "ticket" : "tickets"} · {lines.length} {lines.length === 1 ? "order" : "orders"}
              </p>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-coral-400/50 hover:text-coral-300"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-mist-500">
                <TicketCheck className="h-7 w-7" />
              </span>
              <p className="mt-5 font-display text-xl font-bold text-mist-100">Nothing booked yet</p>
              <p className="mt-2 max-w-xs text-sm text-mist-500">
                Add tickets from any event page — or grab a seat at one of these before they go.
              </p>
              <div className="mt-6 w-full space-y-2">
                {TRENDING.slice(0, 3).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      close();
                      navigate(`/event/${e.slug}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-2 text-left transition-colors hover:border-gold-400/40"
                  >
                    <img src={e.image} alt="" loading="lazy" className="h-11 w-14 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-mist-200">{e.title}</span>
                      <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-mist-500">
                        {e.venue.city} · from {zar(e.priceFrom)}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gold-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3 transition-colors hover:border-gold-400/25"
                >
                  <img
                    src={line.image}
                    alt=""
                    loading="lazy"
                    className="h-20 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/event/${line.eventSlug}`}
                      onClick={close}
                      className="line-clamp-2 text-sm font-semibold leading-snug text-mist-100 hover:text-gold-200"
                    >
                      {line.eventTitle}
                    </Link>
                    <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-mist-500">
                      {line.tierName} · {longDate(line.date)}
                    </p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-mist-500">{line.venue}</p>
                    {line.seats && line.seats.length > 0 && (
                      <p className="mt-1 inline-flex rounded-md bg-gold-400/12 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-gold-300">
                        {line.seats.join(" · ")}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-white/10 p-0.5">
                        <button
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-6 w-6 place-items-center rounded-full text-mist-300 transition-colors hover:bg-white/10 hover:text-mist-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs tabular-nums text-mist-100">{line.qty}</span>
                        <button
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label="Increase quantity"
                          className="grid h-6 w-6 place-items-center rounded-full text-mist-300 transition-colors hover:bg-white/10 hover:text-mist-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-base font-extrabold text-mist-100">
                          {zar(line.price * line.qty)}
                        </span>
                        <button
                          onClick={() => remove(line.key)}
                          aria-label={`Remove ${line.eventTitle}`}
                          className="text-mist-500 transition-colors hover:text-coral-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-white/8 bg-ink-850/80 px-5 py-5 backdrop-blur-xl">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-mist-400">
                <dt>Subtotal</dt>
                <dd className="tabular-nums text-mist-200">{zar(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-mist-400">
                <dt>Booking fee ({lines.length} {lines.length === 1 ? "order" : "orders"})</dt>
                <dd className="tabular-nums text-mist-200">{zar(fees)}</dd>
              </div>
              <div className="flex justify-between text-mist-400">
                <dt>Delivery</dt>
                <dd className="text-jade-400">Free e-ticket</dd>
              </div>
              <div className="mt-2 flex items-end justify-between border-t border-white/8 pt-3">
                <dt className="font-display text-base font-bold text-mist-100">Total</dt>
                <dd className="font-display text-2xl font-extrabold text-gold-300 tabular-nums">{zar(total)}</dd>
              </div>
            </dl>

            <Link to="/checkout" onClick={close} className="btn btn-gold mt-4 h-13 w-full text-[0.95rem]">
              Secure checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mist-500">
              <ShieldCheck className="h-3.5 w-3.5 text-jade-400" /> PCI-DSS Level 1 · 3-D Secure
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}
