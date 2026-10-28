import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, MapPin, Play, Star, TicketCheck } from "lucide-react";
import { FEATURED } from "@/data/events";
import { countdownLabel, longDate, zar } from "@/lib/format";
import { cn } from "@/utils/cn";
import { usePrefersReducedMotion } from "@/hooks/useUi";

const SLIDE_MS = 7200;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const slide = FEATURED[index % FEATURED.length];

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % FEATURED.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, reduced]);

  const go = (dir: number) => setIndex((i) => (i + dir + FEATURED.length) % FEATURED.length);
  const cheapest = slide.tiers[0];
  const premium = slide.tiers[slide.tiers.length - 1];

  return (
    <section
      className="relative isolate min-h-[92svh] overflow-hidden bg-ink-950 pt-[calc(var(--header-h)+2.5rem)] pb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Layered backdrop */}
      {FEATURED.map((e, i) => (
        <div
          key={e.id}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={e.gallery[0]}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            className={cn("h-full w-full object-cover", i === index && !reduced && "animate-kenburns")}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/85" />
      <div className="grain absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-96 w-96 rounded-full bg-gold-500/12 blur-[130px]" />

      <div className="shell relative">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          {/* Left: editorial type block */}
          <div key={slide.id} className="animate-rise pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-coral-500 animate-blip" />
                Featured · {slide.venue.city}
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mist-300 backdrop-blur-md">
                {countdownLabel(slide.date)}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-gold-300">
                <Star className="h-3 w-3 fill-current" /> {slide.rating.toFixed(1)}
              </span>
            </div>

            <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(2.6rem,7.2vw,6.2rem)] font-extrabold leading-[0.9] tracking-[-0.035em] text-mist-100">
              {slide.title}
            </h1>

            <p className="mt-4 flex items-center gap-2 font-display text-lg font-semibold text-gold-300 md:text-xl">
              {slide.artist}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-mist-300">
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-gold-400" />
                {longDate(slide.date)}
                {slide.endDate ? ` – ${longDate(slide.endDate)}` : ""} · Doors {slide.doors}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-400" />
                {slide.venue.name}
              </span>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist-400 md:text-[0.98rem]">
              {slide.blurb}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={`/event/${slide.slug}`} className="btn btn-gold h-13 px-7 text-[0.95rem]">
                Book tickets <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={`/event/${slide.slug}`} className="btn btn-ghost h-13 px-6 text-[0.95rem]">
                <Play className="h-3.5 w-3.5 fill-current" /> Event details
              </Link>
              <span className="hidden items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mist-500 sm:flex">
                {slide.soldPercent}% sold · {zar(cheapest.price)} – {zar(premium.price)}
              </span>
            </div>
          </div>

          {/* Right: ticket panel */}
          <aside className="glass hidden rounded-[var(--radius-card)] p-5 shadow-lift lg:block">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Ticket tiers</span>
              <span className="font-mono text-[0.62rem] uppercase tracking-wider text-mist-500">
                {slide.organiser}
              </span>
            </div>
            <ul className="mt-4 space-y-2">
              {slide.tiers.slice(0, 3).map((t) => (
                <li
                  key={t.id}
                  className="group/tier flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3 transition-colors hover:border-gold-400/40 hover:bg-gold-400/[0.06]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-mist-100">{t.name}</span>
                    <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-mist-500">
                      {t.remaining} left
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-lg font-extrabold text-gold-300">{zar(t.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-300 to-coral-500 transition-[width] duration-1000"
                style={{ width: `${slide.soldPercent}%` }}
              />
            </div>
            <Link to={`/event/${slide.slug}`} className="btn btn-gold mt-4 h-12 w-full text-sm">
              {slide.seated ? <TicketCheck className="h-4 w-4" /> : null}
              Select tickets
            </Link>
            <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mist-500">
              Free e-ticket delivery · {slide.ageRestriction.split(".")[0]}
            </p>
          </aside>
        </div>

        {/* Slide selector */}
        <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-6">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => go(-1)}
              aria-label="Previous featured event"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-mist-300 transition-all hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next featured event"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-mist-300 transition-all hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="no-scrollbar -mx-1 flex flex-1 items-stretch gap-3 overflow-x-auto px-1">
            {FEATURED.map((e, i) => (
              <button
                key={e.id}
                onClick={() => setIndex(i)}
                className={cn(
                  "group relative flex min-w-[13rem] shrink-0 items-center gap-3 overflow-hidden rounded-xl border p-2 text-left transition-all duration-400",
                  i === index
                    ? "border-gold-400/50 bg-white/[0.07]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/20",
                )}
              >
                <img
                  src={e.image}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "h-12 w-16 shrink-0 rounded-lg object-cover transition-all duration-500",
                    i === index ? "grayscale-0" : "grayscale group-hover:grayscale-0",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-[0.58rem] uppercase tracking-[0.16em] text-gold-400">
                    {longDate(e.date).slice(0, 11)}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-mist-200">{e.title}</span>
                </span>
                {i === index && !reduced && (
                  <span
                    key={`bar-${index}`}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold-400"
                    style={{ animation: `grow ${SLIDE_MS}ms linear forwards` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </section>
  );
}
