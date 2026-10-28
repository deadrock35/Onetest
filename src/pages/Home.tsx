import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { FilterGrid } from "@/components/FilterGrid";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Rating } from "@/components/ui";
import { CATEGORIES, EVENTS, TRENDING } from "@/data/events";
import { countdownLabel, dayNumber, longDate, zar } from "@/lib/format";
import { usePageTitle } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

/* ------------------------------ Count-up stat ----------------------------- */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1500;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ----------------------------- Category tiles ----------------------------- */
const CATEGORY_TILES: Record<string, { span: string; ratio: string }> = {
  music: { span: "lg:col-span-5 lg:row-span-2", ratio: "aspect-[4/5] lg:aspect-auto lg:h-full" },
  festivals: { span: "lg:col-span-4", ratio: "aspect-[16/10]" },
  comedy: { span: "lg:col-span-3", ratio: "aspect-[16/10]" },
  theatre: { span: "lg:col-span-7", ratio: "aspect-[16/9]" },
};

function CategoryBand() {
  const coverFor = (id: string) => EVENTS.find((e) => e.category === id)?.image ?? EVENTS[0].image;

  return (
    <section className="shell py-16 lg:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Browse by category"
          title="Four rooms. One ticket."
          description="Whether it's a log-drum arena night in Menlyn or a 638-seat satire room in Newlands, every listing is verified, seated where it matters and delivered straight to your phone."
          action={
            <Link to="/events" className="btn btn-ghost h-11 px-5 text-sm">
              View full calendar <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        {CATEGORIES.map((c, i) => {
          const tile = CATEGORY_TILES[c.id];
          const count = EVENTS.filter((e) => e.category === c.id).length;
          const from = Math.min(...EVENTS.filter((e) => e.category === c.id).map((e) => e.priceFrom));
          return (
            <Reveal key={c.id} delay={i * 90} className={cn(tile.span)}>
              <Link
                to={`/search?category=${c.id}`}
                className={cn(
                  "group relative block overflow-hidden rounded-[var(--radius-card)] border border-white/8 transition-all duration-500 hover:border-white/20 hover:shadow-lift",
                  tile.ratio,
                )}
              >
                <img
                  src={coverFor(c.id)}
                  alt={`${c.label} events`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10" />
                <span
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(120% 90% at 20% 100%, ${c.accent}33, transparent 70%)` }}
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <span>
                    <span
                      className="block font-mono text-[0.62rem] uppercase tracking-[0.22em]"
                      style={{ color: c.accent }}
                    >
                      {count} events
                    </span>
                    <span className="mt-1.5 block font-display text-2xl font-extrabold leading-none text-mist-100 lg:text-3xl">
                      {c.label}
                    </span>
                    <span className="mt-2 block text-xs text-mist-400">from {zar(from)}</span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-ink-950/50 text-mist-200 backdrop-blur-md transition-all duration-400 group-hover:scale-110 group-hover:border-gold-400 group-hover:text-gold-300">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------- Trending rail ---------------------------- */
function TrendingRail() {
  return (
    <section className="py-16 lg:py-20">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Moving fastest"
            title={
              <span className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-coral-400" /> Trending this week
              </span>
            }
            description="Ranked by tickets sold in the last seven days. Inventory on these events is moving quickly."
          />
        </Reveal>
      </div>

      <div className="no-scrollbar mt-9 snap-x snap-mandatory overflow-x-auto pb-4">
        <div className="shell flex w-max gap-5">
          {TRENDING.map((e, i) => (
            <Reveal key={e.id} delay={i * 70}>
              <Link
                to={`/event/${e.slug}`}
                className="group relative flex w-[19rem] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-ink-850 transition-all duration-500 hover:-translate-y-2 hover:border-coral-400/35 hover:shadow-lift sm:w-[21rem]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="aspect-[16/11] w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-850 via-transparent to-transparent" />
                  <span className="absolute left-4 top-3 font-display text-[3.2rem] font-extrabold leading-none text-mist-100/25 transition-colors duration-500 group-hover:text-gold-300/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-coral-500 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-wider text-ink-950">
                    {e.soldPercent}% sold
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold-400">
                    {longDate(e.date)}
                  </span>
                  <h3 className="mt-1.5 line-clamp-2 font-display text-lg font-bold leading-snug text-mist-100 transition-colors group-hover:text-coral-200">
                    {e.title}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-mist-500">
                    <MapPin className="h-3.5 w-3.5" /> {e.venue.name}, {e.venue.city}
                  </p>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <Rating value={e.rating} />
                    <span className="font-display text-lg font-extrabold text-mist-100">{zar(e.priceFrom)}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Seat-map teaser --------------------------- */
function SeatMapTeaser() {
  const rows = 6;
  const cols = 14;
  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-ink-900 py-20 lg:py-28">
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-gold-500/[0.07] to-transparent" />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400/60" /> Coming next · Reserved seating
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.2vw,3.2rem)] font-extrabold leading-[1.02]">
            Pick the exact seat.
            <span className="block text-gold-300">Not just the section.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-mist-400 md:text-base">
            Every theatre and arena listing on OpenTickets now ships with a live seat map — real house
            occupancy, colour-coded price tiers, wheelchair bays with companion seats, and a ten-minute
            hold while you pay.
          </p>
          <ul className="mt-7 space-y-3">
            {[
              "Live availability straight from the venue's house plan",
              "Tier colours matched to the price list — no surprises at checkout",
              "Wheelchair bays include a free companion seat",
              "Seats held for 10 minutes while you complete payment",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-mist-300">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                  <BadgeCheck className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/event/appel-soos-net-hy-kan-kunstekaap" className="btn btn-gold h-12 px-6 text-sm">
              <TicketCheck className="h-4 w-4" /> Try the seat map
            </Link>
            <Link to="/search?seated=1" className="btn btn-ghost h-12 px-6 text-sm">
              All seated events
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="glass relative rounded-[26px] p-5 shadow-lift sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold-300">
                Kunstekaap · Piers Park
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mist-500">520 seats</span>
            </div>
            <div className="mx-auto mt-4 h-8 w-3/4 rounded-b-[3rem] bg-gradient-to-b from-gold-400/45 to-gold-400/5" />
            <div className="mt-6 space-y-2">
              {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex items-center justify-center gap-1.5">
                  <span className="w-4 font-mono text-[0.55rem] text-mist-600">{String.fromCharCode(65 + r)}</span>
                  {Array.from({ length: cols }).map((_, c) => {
                    const filled = (r * 7 + c * 13) % 11 < 5;
                    const hot = r < 2 && c > 5 && c < 9;
                    return (
                      <span
                        key={c}
                        className={cn(
                          "h-3.5 w-3.5 rounded-[3px] transition-all duration-500",
                          hot
                            ? "bg-gold-300 shadow-[0_0_10px_rgba(248,236,210,0.55)]"
                            : filled
                              ? "bg-iris-400/45"
                              : "bg-ink-600",
                        )}
                        style={{
                          animation: hot ? `blip 2.6s ${c * 0.12}s ease-out infinite` : undefined,
                        }}
                      />
                    );
                  })}
                  <span className="w-4 font-mono text-[0.55rem] text-right text-mist-600">
                    {String.fromCharCode(65 + r)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
              <div>
                <span className="block font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist-500">Selected</span>
                <span className="font-display text-base font-extrabold text-mist-100">Row B · Seats 7 &amp; 8</span>
              </div>
              <span className="font-display text-2xl font-extrabold text-gold-300">{zar(1120)}</span>
            </div>
          </div>
          <span className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[26px] border border-gold-400/20" />
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Stats ---------------------------------- */
function StatsBand() {
  const stats = [
    { value: 1.24, suffix: "M", decimals: 2, label: "Tickets sold since 2019" },
    { value: 42, suffix: "", decimals: 0, label: "Partner venues nationwide" },
    { value: 4.8, suffix: "/5", decimals: 1, label: "From 26 400 reviews" },
    { value: 0, suffix: "", decimals: 0, label: "Hidden fees at checkout" },
  ];
  return (
    <section className="shell py-14">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-gold-400/30">
              <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <p className="font-display text-[2.6rem] font-extrabold leading-none text-mist-100">
                {s.decimals || s.value ? (
                  <Counter to={s.value} suffix={s.suffix} decimals={s.decimals} />
                ) : (
                  `0`
                )}
              </p>
              <p className="mt-2.5 text-sm text-mist-500">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ How it works ------------------------------ */
const STEPS = [
  { icon: CalendarClock, title: "Find your night", copy: "Filter the full calendar by city, category, date or budget — every listing verified directly with the venue." },
  { icon: TicketCheck, title: "Pick your tier or seat", copy: "Compare tiers side by side, or choose an exact row and seat on events with reserved seating." },
  { icon: CreditCard, title: "Pay your way", copy: "Card, instant EFT, SnapScan, Zapper, Apple Pay or three interest-free instalments with PayFlex." },
  { icon: QrCode, title: "Walk straight in", copy: "Your rotating barcode lands in your wallet 48 hours before doors. No printing, no queues." },
];

function HowItWorks() {
  return (
    <section className="shell py-16 lg:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="How OpenTickets works"
          title="Four steps between you and the front row"
          description="The same flow our buyers have known since 2019 — just faster, prettier and safer."
        />
      </Reveal>

      <div className="relative mt-12">
        <span className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold-400/35 to-transparent lg:block" />
        <div className="grid gap-9 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 110}>
              <div className="group relative">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-ink-850 text-gold-300 transition-all duration-400 group-hover:-translate-y-1 group-hover:border-gold-400/50 group-hover:shadow-gold">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="mt-5 block font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mist-600">
                  Step 0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-mist-100">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-400">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- This month ------------------------------ */
function ThisMonth() {
  const soon = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  return (
    <section className="shell py-16 lg:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="On the calendar"
          title="Next up in South Africa"
          action={
            <Link to="/events?sort=date" className="btn btn-ghost h-11 px-5 text-sm">
              Full calendar <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </Reveal>

      <div className="mt-9 divide-y divide-white/8 border-y border-white/8">
        {soon.map((e, i) => (
          <Reveal key={e.id} delay={i * 70}>
            <Link
              to={`/event/${e.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-[7rem_1.4fr_1fr_auto] md:gap-8 md:px-3"
            >
              <span className="text-center">
                <span className="block font-display text-3xl font-extrabold leading-none text-mist-100 transition-colors group-hover:text-gold-300">
                  {dayNumber(e.date)}
                </span>
                <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mist-500">
                  {longDate(e.date).split(" ").slice(1).join(" ")}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-lg font-bold text-mist-100 md:text-xl">
                  {e.title}
                </span>
                <span className="mt-1 block truncate font-mono text-[0.62rem] uppercase tracking-[0.16em] text-gold-400">
                  {e.artist}
                </span>
              </span>
              <span className="hidden min-w-0 text-sm text-mist-400 md:block">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-mist-600" /> {e.venue.name}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-mist-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-jade-400" /> {countdownLabel(e.date)} · {e.soldPercent}% sold
                </span>
              </span>
              <span className="flex items-center gap-4">
                <span className="text-right">
                  <span className="block font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">from</span>
                  <span className="block font-display text-lg font-extrabold text-mist-100">{zar(e.priceFrom)}</span>
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-mist-300 transition-all duration-400 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-ink-900">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default function Home() {
  usePageTitle();

  return (
    <>
      <Hero />
      <Ticker />
      <CategoryBand />
      <FilterGrid
        events={EVENTS}
        eyebrow="Isotope-style discovery"
        title="Filter the calendar"
        description="Tap a category and the grid re-orders in place — no reload, no lost scroll position. This is the same layout you've been using since 2019, now with live availability."
        link={{ to: "/events", label: "Advanced search & filters" }}
      />
      <TrendingRail />
      <ThisMonth />
      <SeatMapTeaser />
      <StatsBand />
      <HowItWorks />
    </>
  );
}
