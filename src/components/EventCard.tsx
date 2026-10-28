import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3, MapPin, Sparkles, TicketCheck } from "lucide-react";
import type { EventItem } from "@/data/events";
import { CATEGORY_LABEL } from "@/data/events";
import { countdownLabel, dayNumber, monthName, shortDate, zar } from "@/lib/format";
import { useCart } from "@/store/cart";
import { cn } from "@/utils/cn";

const CAT_TONE: Record<string, string> = {
  music: "text-gold-300 border-gold-400/35 bg-gold-400/10",
  comedy: "text-coral-300 border-coral-400/35 bg-coral-400/10",
  theatre: "text-iris-400 border-iris-400/35 bg-iris-400/10",
  festivals: "text-jade-400 border-jade-400/35 bg-jade-400/10",
};

function buildQuickAdd(event: EventItem, add: ReturnType<typeof useCart>["add"]) {
  return () => {
    const tier = event.tiers[0];
    add({
      eventSlug: event.slug,
      eventTitle: event.title,
      eventId: event.id,
      tierId: tier.id,
      tierName: tier.name,
      price: tier.price,
      qty: 1,
      date: event.date,
      venue: event.venue.name,
      city: event.venue.city,
      image: event.image,
    });
  };
}

function SoldBar({ percent }: { percent: number }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.16em]">
        <span className={cn(percent > 85 ? "text-coral-400" : "text-mist-500")}>
          {percent > 85 ? "Almost sold out" : `${percent}% sold`}
        </span>
        <span className="text-mist-500">{100 - percent}% left</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-out",
            percent > 85
              ? "bg-gradient-to-r from-coral-400 to-coral-500"
              : "bg-gradient-to-r from-gold-300 to-gold-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function EventCard({
  event,
  variant = "grid",
  className,
}: {
  event: EventItem;
  variant?: "grid" | "list";
  className?: string;
}) {
  const { add } = useCart();
  const onQuickAdd = buildQuickAdd(event, add);

  if (variant === "list") {
    return (
      <article
        data-flip={event.id}
        className={cn(
          "group relative flex flex-col gap-5 overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-ink-850 p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-gold-400/30 hover:shadow-lift sm:flex-row sm:items-center",
          className,
        )}
      >
        <Link to={`/event/${event.slug}`} className="relative block w-full shrink-0 overflow-hidden rounded-xl sm:w-56">
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
          />
          <span className="absolute left-2 top-2 rounded-md bg-ink-950/80 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-gold-300 backdrop-blur-sm">
            {shortDate(event.date)}
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider", CAT_TONE[event.category])}>
              {CATEGORY_LABEL[event.category]}
            </span>
            {event.trending && (
              <span className="flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-wider text-coral-400">
                <Sparkles className="h-3 w-3" /> Trending
              </span>
            )}
            {event.seated && (
              <span className="flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-wider text-mist-500">
                <TicketCheck className="h-3 w-3" /> Seat map
              </span>
            )}
          </div>
          <Link to={`/event/${event.slug}`}>
            <h3 className="mt-2 font-display text-xl font-bold leading-tight text-mist-100 transition-colors group-hover:text-gold-200">
              {event.title}
            </h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-sm text-mist-400">{event.blurb}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-mist-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {event.venue.name}, {event.venue.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" /> Doors {event.doors}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/8 pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div className="text-right">
            <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist-500">from</span>
            <span className="block font-display text-2xl font-extrabold text-mist-100">{zar(event.priceFrom)}</span>
          </div>
          <Link to={`/event/${event.slug}`} className="btn btn-gold h-10 px-5 text-sm">
            Select tickets
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      data-flip={event.id}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-ink-850 transition-all duration-500 hover:-translate-y-2 hover:border-gold-400/30 hover:shadow-lift",
        className,
      )}
    >
      <Link to={`/event/${event.slug}`} className="relative block overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="aspect-[16/11] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.09]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/10 to-transparent opacity-80" />

        {/* Date badge */}
        <span className="absolute left-3 top-3 flex flex-col items-center rounded-xl border border-white/12 bg-ink-950/70 px-2.5 py-1.5 backdrop-blur-md">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-gold-300">
            {monthName(event.date)}
          </span>
          <span className="font-display text-lg font-extrabold leading-none text-mist-100">
            {dayNumber(event.date)}
          </span>
        </span>

        <span
          className={cn(
            "absolute right-3 top-3 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-wider backdrop-blur-md",
            CAT_TONE[event.category],
          )}
        >
          {CATEGORY_LABEL[event.category]}
        </span>

        <span className="absolute bottom-3 left-3 rounded-full bg-ink-950/70 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-mist-300 backdrop-blur-md">
          {countdownLabel(event.date)}
        </span>

        {/* Quick add — slides up on hover */}
        <button
          onClick={onQuickAdd}
          className="absolute bottom-3 right-3 flex translate-y-3 items-center gap-1.5 rounded-full bg-mist-100 px-3.5 py-2 text-xs font-semibold text-ink-900 opacity-0 shadow-lift transition-all duration-400 hover:bg-gold-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <TicketCheck className="h-3.5 w-3.5" /> Quick add
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold-400">{event.artist}</p>
        <Link to={`/event/${event.slug}`} className="mt-1.5">
          <h3 className="line-clamp-2 font-display text-[1.05rem] font-bold leading-snug text-mist-100 transition-colors group-hover:text-gold-200">
            {event.title}
          </h3>
        </Link>

        <div className="mt-2.5 flex items-start gap-1.5 text-xs text-mist-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">
            {event.venue.name} · {event.venue.city}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="block font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-500">from</span>
              <span className="font-display text-xl font-extrabold text-mist-100">{zar(event.priceFrom)}</span>
            </div>
            <Link
              to={`/event/${event.slug}`}
              className="flex h-9 items-center gap-1 rounded-full border border-white/12 px-3.5 text-xs font-semibold text-mist-200 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-ink-900"
            >
              Book <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <SoldBar percent={event.soldPercent} />
        </div>
      </div>
    </article>
  );
}
