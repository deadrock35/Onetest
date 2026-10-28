import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Info,
  MapPin,
  Minus,
  Music4,
  Plus,
  Share2,
  ShieldCheck,
  TicketCheck,
  Users,
} from "lucide-react";
import { getEvent, relatedEvents, CATEGORY_LABEL } from "@/data/events";
import { countdownLabel, longDate, shortDate, zar } from "@/lib/format";
import { Accordion, Badge, Rating, SectionHeading, Tabs } from "@/components/ui";
import { EventCard } from "@/components/EventCard";
import { Reveal } from "@/components/Reveal";
import { SeatMap, type SeatSelection } from "@/components/SeatMap";
import { useCart } from "@/store/cart";
import { usePageTitle } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

type TabId = "overview" | "lineup" | "venue" | "schedule" | "terms" | "faq";

const TABS: { id: TabId; label: string; icon?: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Info className="h-3.5 w-3.5" /> },
  { id: "lineup", label: "Line-up", icon: <Music4 className="h-3.5 w-3.5" /> },
  { id: "venue", label: "Venue", icon: <MapPin className="h-3.5 w-3.5" /> },
  { id: "schedule", label: "Schedule", icon: <Clock3 className="h-3.5 w-3.5" /> },
  { id: "terms", label: "Terms", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  { id: "faq", label: "Event FAQ", icon: <Users className="h-3.5 w-3.5" /> },
];

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEvent(slug);
  const { add } = useCart();
  const [tab, setTab] = useState<TabId>("overview");
  const [tierId, setTierId] = useState(event?.tiers[0]?.id ?? "");
  const [qty, setQty] = useState(2);
  const [seats, setSeats] = useState<SeatSelection[]>([]);
  const [copied, setCopied] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setTab("overview");
    setSeats([]);
    setQty(2);
    if (event) setTierId(event.tiers[0].id);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setBarVisible(heroBottom < 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const related = useMemo(() => (event ? relatedEvents(event, 3) : []), [event?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  usePageTitle(event ? `${event.title} — ${event.venue.city}` : "Event not found");

  if (!event) {
    return (
      <div className="shell flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
        <span className="font-display text-7xl font-extrabold text-ink-700">404</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">We can't find that event</h1>
        <p className="mt-3 max-w-md text-sm text-mist-400">
          The listing may have sold out and been archived. Browse the full calendar for everything currently on sale.
        </p>
        <Link to="/events" className="btn btn-gold mt-7 h-12 px-6 text-sm">
          Browse all events <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const activeTier = event.tiers.find((t) => t.id === tierId) ?? event.tiers[0];
  const useSeats = event.seated;
  const effectiveQty = useSeats ? Math.max(seats.length, 0) : qty;
  const unitTotal = useSeats
    ? seats.reduce((s, x) => s + x.price, 0)
    : activeTier.price * qty;
  const fee = effectiveQty > 0 ? 35 : 0;
  const total = unitTotal + fee;

  function toggleSeat(seat: SeatSelection) {
    setSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : prev.length >= 6
          ? prev
          : [...prev, seat],
    );
  }

  function addToCart() {
    add({
      eventSlug: event!.slug,
      eventTitle: event!.title,
      eventId: event!.id,
      tierId: useSeats ? seats[0]?.section ?? activeTier.id : activeTier.id,
      tierName: useSeats ? `${seats[0]?.section} · ${seats.length} seats` : activeTier.name,
      price: useSeats
        ? Math.round((unitTotal / Math.max(1, seats.length)) * 100) / 100
        : activeTier.price,
      qty: useSeats ? seats.length : qty,
      date: event!.date,
      venue: event!.venue.name,
      city: event!.venue.city,
      seats: seats.map((s) => (s.row === "WC" ? `WC${s.seat}` : `${s.row}${s.seat}`)),
      image: event!.image,
    });
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const canBook = useSeats ? seats.length > 0 : qty > 0;

  return (
    <article className="relative">
      {/* ---------------------------- Immersive header ---------------------------- */}
      <div ref={heroRef} className="relative isolate overflow-hidden pt-[calc(var(--header-h)+1rem)]">
        <img
          src={event.gallery[0]}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/72 to-ink-950/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/92 via-ink-950/35 to-transparent" />
        <div className="grain absolute inset-0 -z-10" />

        <div className="shell pb-14 pt-8 lg:pb-20">
          <nav className="flex flex-wrap items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist-400">
            <Link to="/" className="hover:text-gold-300">Home</Link>
            <span className="text-mist-600">/</span>
            <Link to="/events" className="hover:text-gold-300">Events</Link>
            <span className="text-mist-600">/</span>
            <Link to={`/search?category=${event.category}`} className="hover:text-gold-300">
              {CATEGORY_LABEL[event.category]}
            </Link>
            <span className="text-mist-600">/</span>
            <span className="text-mist-500">{event.venue.city}</span>
          </nav>

          <div className="mt-7 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="animate-rise">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="gold">{CATEGORY_LABEL[event.category]}</Badge>
                {event.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
                {event.seated && (
                  <Badge tone="iris">
                    <TicketCheck className="h-3 w-3" /> Reserved seating
                  </Badge>
                )}
                {event.soldPercent > 85 && <Badge tone="coral">Almost sold out</Badge>}
              </div>

              <h1 className="mt-5 max-w-[20ch] font-display text-[clamp(2.3rem,6.4vw,5rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
                {event.title}
              </h1>
              <p className="mt-4 font-display text-lg font-semibold text-gold-300 md:text-2xl">{event.artist}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-mist-300">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold-400" />
                  <span>
                    {longDate(event.date)}
                    {event.endDate ? ` – ${longDate(event.endDate)}` : ""}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-gold-400" /> Doors {event.doors} · Show {event.start}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-400" /> {event.venue.name}, {event.venue.city}
                </span>
                <Rating value={event.rating} />
              </div>

              {/* Primary action bar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="btn btn-gold h-13 px-7 text-[0.95rem]"
                >
                  Select tickets <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    document.getElementById("pricing-tiers")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="btn btn-ghost h-13 px-6 text-[0.95rem]"
                >
                  View pricing tiers
                </button>
                <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-mist-400">
                  {countdownLabel(event.date)} · {event.soldPercent}% sold
                </span>
              </div>
            </div>

            {/* Poster */}
            <div className="relative hidden lg:block">
              <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-white/12 shadow-lift">
                <img
                  src={event.poster}
                  alt={`${event.title} poster`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 to-transparent p-4 pt-12">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold-300">Official poster</p>
                  <p className="mt-1 font-display text-sm font-bold text-mist-100">
                    {event.organiser} presents
                  </p>
                </div>
              </div>
              <span className="pointer-events-none absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-[var(--radius-card)] border border-gold-400/25" />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------ Main content ----------------------------- */}
      <div className="shell grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12 lg:py-16">
        {/* Left column */}
        <div className="min-w-0">
          <Tabs tabs={TABS} active={tab} onChange={setTab} className="max-w-full" />

          <div key={tab} className="mt-8 animate-rise">
            {tab === "overview" && (
              <div>
                <p className="font-display text-xl font-semibold leading-relaxed text-mist-200 md:text-2xl">
                  {event.blurb}
                </p>
                <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-mist-400">
                  {event.description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-4">
                  {[
                    { k: "Doors", v: event.doors },
                    { k: "Show time", v: event.start },
                    { k: "Age policy", v: event.ageRestriction.split(".")[0] },
                    { k: "Capacity", v: event.venue.capacity.toLocaleString("en-ZA") },
                  ].map((item) => (
                    <div key={item.k} className="bg-ink-850 p-4">
                      <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">{item.k}</dt>
                      <dd className="mt-1.5 font-display text-base font-bold text-mist-100">{item.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="no-scrollbar mt-9 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                  {event.gallery.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${event.title} gallery ${i + 1}`}
                      loading="lazy"
                      className="h-40 w-64 shrink-0 rounded-2xl border border-white/8 object-cover transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/40"
                    />
                  ))}
                </div>
              </div>
            )}

            {tab === "lineup" && (
              <div>
                <h3 className="font-display text-2xl font-extrabold">Who's on the bill</h3>
                {event.lineup.length > 0 ? (
                  <ul className="mt-6 divide-y divide-white/8 border-y border-white/8">
                    {event.lineup.map((l, i) => (
                      <li key={l.name} className="group flex items-center gap-5 py-4">
                        <span className="font-mono text-xs text-mist-600">{String(i + 1).padStart(2, "0")}</span>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-gold-300 transition-colors group-hover:border-gold-400/40">
                          <Music4 className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg font-bold text-mist-100">{l.name}</span>
                          <span className="block text-sm text-mist-500">{l.role}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-mist-400">
                    The full line-up for this event is announced closer to the date. Follow {event.organiser} for updates.
                  </p>
                )}
              </div>
            )}

            {tab === "venue" && (
              <div>
                <h3 className="font-display text-2xl font-extrabold">{event.venue.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-400">{event.venue.note}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <span className="eyebrow">Address</span>
                    <p className="mt-2.5 text-sm text-mist-200">{event.venue.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${event.venue.name} ${event.venue.address}`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost mt-4 h-10 w-full text-sm"
                    >
                      <MapPin className="h-4 w-4" /> Get directions
                    </a>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <span className="eyebrow">House details</span>
                    <dl className="mt-2.5 space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <dt className="text-mist-500">Capacity</dt>
                        <dd className="text-mist-200">{event.venue.capacity.toLocaleString("en-ZA")}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-mist-500">City</dt>
                        <dd className="text-mist-200">{event.venue.city}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-mist-500">Seating</dt>
                        <dd className="text-mist-200">{event.seated ? "Reserved seat map" : "General access"}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-mist-500">Accessibility</dt>
                        <dd className="text-mist-200">Wheelchair bays + companion</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Stylised venue plan */}
                <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/8 bg-ink-850">
                  <div className="dotgrid absolute inset-0 opacity-40" />
                  <div className="relative p-6">
                    <div className="mx-auto h-9 w-2/3 rounded-b-[3rem] bg-gradient-to-b from-gold-400/40 to-transparent" />
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {["Floor / GA", "Stalls / Stands", "Balcony / Deck"].map((zone, i) => (
                        <div
                          key={zone}
                          className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center"
                        >
                          <span className="block font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">
                            Zone {i + 1}
                          </span>
                          <span className="mt-1.5 block text-sm font-semibold text-mist-200">{zone}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 text-center font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist-600">
                      Indicative venue plan · exact seat selection on the booking card
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tab === "schedule" && (
              <div>
                <h3 className="font-display text-2xl font-extrabold">Run of show</h3>
                <ol className="relative mt-7 space-y-7 border-l border-white/10 pl-7">
                  {event.schedule.map((s, i) => (
                    <li key={i} className="group relative">
                      <span className="absolute -left-[2.05rem] top-1 grid h-4 w-4 place-items-center rounded-full border border-gold-400/50 bg-ink-900">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-400 transition-transform duration-300 group-hover:scale-150" />
                      </span>
                      <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-gold-300">{s.time}</span>
                      <h4 className="mt-1.5 font-display text-lg font-bold text-mist-100">{s.title}</h4>
                      <p className="mt-1 text-sm text-mist-400">{s.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {tab === "terms" && (
              <div>
                <h3 className="font-display text-2xl font-extrabold">Terms &amp; conditions</h3>
                <p className="mt-3 text-sm text-mist-500">
                  By completing this booking you accept the following conditions, issued by {event.organiser} in
                  partnership with OpenTickets.
                </p>
                <ol className="mt-6 space-y-4">
                  {event.terms.map((t, i) => (
                    <li key={i} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                      <span className="font-mono text-xs text-gold-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm leading-relaxed text-mist-300">{t}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/faqs?category=ticketing" className="btn btn-ghost h-11 px-5 text-sm">
                    Read the refund policy
                  </Link>
                  <Link to="/faqs" className="btn btn-ghost h-11 px-5 text-sm">
                    Help centre
                  </Link>
                </div>
              </div>
            )}

            {tab === "faq" && (
              <div>
                <h3 className="font-display text-2xl font-extrabold">Questions about this event</h3>
                <p className="mt-3 text-sm text-mist-500">
                  Everything buyers ask about {event.title} — plus our platform-wide answers in the{" "}
                  <Link to="/faqs" className="text-gold-300 underline decoration-gold-400/40 underline-offset-4">
                    help centre
                  </Link>
                  .
                </p>
                <div className="mt-6">
                  <Accordion items={event.faqs} defaultOpen={0} />
                </div>
              </div>
            )}
          </div>

          {/* Interactive house plan — reserved seating events */}
          {useSeats && (
            <section id="seat-map" className="mt-16 scroll-mt-32">
              <SectionHeading
                eyebrow="House plan"
                title="Choose your exact seat"
                description={`Live availability from ${event.venue.name}'s house plan — ${event.venue.capacity.toLocaleString(
                  "en-ZA",
                )} seats, colour-coded by price tier, with wheelchair bays that include a free companion seat.`}
              />
              <div className="mt-7">
                <SeatMap event={event} selected={seats} onToggle={toggleSeat} />
              </div>
            </section>
          )}

          {/* Pricing tier table — the anchor the action bar points at */}
          <section id="pricing-tiers" className="mt-16 scroll-mt-32">
            <SectionHeading
              eyebrow="Pricing tiers"
              title="What each ticket gets you"
              description="All prices in South African Rand, VAT included. A flat R35.00 booking fee applies per order."
            />
            <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-white/8">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist-500">
                  <tr>
                    <th className="px-5 py-3.5 font-normal">Tier</th>
                    <th className="hidden px-5 py-3.5 font-normal md:table-cell">Includes</th>
                    <th className="px-5 py-3.5 text-right font-normal">Available</th>
                    <th className="px-5 py-3.5 text-right font-normal">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {event.tiers.map((t) => {
                    const active = t.id === tierId;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => !useSeats && setTierId(t.id)}
                        className={cn(
                          "transition-colors",
                          active ? "bg-gold-400/[0.07]" : "hover:bg-white/[0.03]",
                          !useSeats && "cursor-pointer",
                        )}
                      >
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-2.5">
                            {!useSeats && (
                              <span
                                className={cn(
                                  "grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors",
                                  active ? "border-gold-400 bg-gold-400 text-ink-900" : "border-white/25",
                                )}
                              >
                                {active && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                              </span>
                            )}
                            <span>
                              <span className="block font-display text-base font-bold text-mist-100">{t.name}</span>
                              <span className="mt-0.5 block text-xs text-mist-500">{t.description}</span>
                            </span>
                          </span>
                        </td>
                        <td className="hidden px-5 py-4 md:table-cell">
                          <ul className="space-y-1">
                            {t.perks.map((p) => (
                              <li key={p} className="flex items-center gap-1.5 text-xs text-mist-400">
                                <span className="h-1 w-1 rounded-full bg-gold-400/70" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className={cn(
                              "font-mono text-xs",
                              t.remaining < 30 ? "text-coral-400" : "text-mist-400",
                            )}
                          >
                            {t.remaining} left
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-display text-lg font-extrabold text-mist-100">
                          {zar(t.price)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ------------------------- Sticky booking summary ------------------------- */}
        <div ref={bookingRef} className="lg:sticky lg:top-[calc(var(--header-h-sm)+1.5rem)] lg:self-start">
          <div className="glass overflow-hidden rounded-[var(--radius-card)] shadow-lift">
            <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
              <div>
                <span className="eyebrow">Booking summary</span>
                <p className="mt-2 font-display text-base font-bold leading-snug text-mist-100">{event.title}</p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-wider text-mist-500">
                  {shortDate(event.date)} · {event.venue.city}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={copyLink}
                  aria-label="Copy event link"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-gold-400/50 hover:text-gold-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-jade-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={copyLink}
                  aria-label="Share event"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-gold-400/50 hover:text-gold-300"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5">
              {copied && (
                <p className="mb-3 rounded-lg bg-jade-400/10 px-3 py-2 text-xs text-jade-400">
                  Link copied to your clipboard.
                </p>
              )}

              {!useSeats && (
                <>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mist-500">Ticket tier</span>
                  <div className="mt-3 space-y-2">
                    {event.tiers.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTierId(t.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-300",
                          t.id === tierId
                            ? "border-gold-400/60 bg-gold-400/[0.09] shadow-gold"
                            : "border-white/10 bg-white/[0.02] hover:border-white/25",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-mist-100">{t.name}</span>
                          <span className="mt-0.5 block font-mono text-[0.58rem] uppercase tracking-wider text-mist-500">
                            {t.remaining < 30 ? `Only ${t.remaining} left` : `${t.remaining} available`}
                          </span>
                        </span>
                        <span className="shrink-0 font-display text-base font-extrabold text-gold-300">{zar(t.price)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mist-500">Quantity</span>
                    <div className="flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.03] p-1">
                      <button
                        onClick={() => setQty((n) => Math.max(1, n - 1))}
                        disabled={qty <= 1}
                        aria-label="Fewer tickets"
                        className="grid h-8 w-8 place-items-center rounded-full text-mist-300 transition-colors enabled:hover:bg-white/10 disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center font-display text-base font-bold tabular-nums text-mist-100">{qty}</span>
                      <button
                        onClick={() => setQty((n) => Math.min(10, n + 1))}
                        disabled={qty >= 10}
                        aria-label="More tickets"
                        className="grid h-8 w-8 place-items-center rounded-full text-mist-300 transition-colors enabled:hover:bg-white/10 disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {useSeats && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mist-500">
                      Seat selection
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gold-300">
                      {seats.length} / 6 selected
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-mist-500">
                    This event uses reserved seating. Choose your exact row and seat on the house plan —
                    your selection is held for ten minutes while you pay.
                  </p>

                  <button
                    onClick={() =>
                      document.getElementById("seat-map")?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="btn btn-ghost mt-4 h-11 w-full text-sm"
                  >
                    <TicketCheck className="h-4 w-4" />
                    {seats.length > 0 ? "Change seats" : "Open seat map"}
                  </button>

                  {seats.length > 0 ? (
                    <>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {seats.map((s) => (
                          <li
                            key={s.id}
                            className="rounded-lg border border-gold-400/35 bg-gold-400/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold-200"
                          >
                            {s.row === "WC" ? `WC bay ${s.seat}` : `Row ${s.row} · Seat ${s.seat}`}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-coral-400/30 bg-coral-400/8 px-3.5 py-2.5">
                        <Clock3 className="h-4 w-4 shrink-0 text-coral-300" />
                        <HoldTimer />
                      </div>
                    </>
                  ) : (
                    <p className="mt-4 rounded-xl border border-dashed border-white/12 px-3.5 py-3 text-xs text-mist-600">
                      No seats selected yet — up to six per booking.
                    </p>
                  )}
                </>
              )}

              <dl className="mt-5 space-y-1.5 border-t border-white/8 pt-4 text-sm">
                <div className="flex justify-between text-mist-400">
                  <dt>
                    {useSeats ? `${seats.length} seats` : `${qty} × ${activeTier.name}`}
                  </dt>
                  <dd className="tabular-nums text-mist-200">{zar(unitTotal)}</dd>
                </div>
                <div className="flex justify-between text-mist-400">
                  <dt>Booking fee</dt>
                  <dd className="tabular-nums text-mist-200">{zar(fee)}</dd>
                </div>
                <div className="flex justify-between text-mist-400">
                  <dt>E-ticket delivery</dt>
                  <dd className="text-jade-400">Free</dd>
                </div>
                <div className="mt-2 flex items-end justify-between border-t border-white/8 pt-3">
                  <dt className="font-display text-base font-bold text-mist-100">Total</dt>
                  <dd className="font-display text-3xl font-extrabold tabular-nums text-gold-300">{zar(total)}</dd>
                </div>
              </dl>

              <button
                onClick={() => addToCart()}
                disabled={!canBook}
                className="btn btn-gold mt-5 h-13 w-full text-[0.95rem] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <TicketCheck className="h-4 w-4" /> Add to cart
              </button>
              <Link
                to={canBook ? "/checkout" : "#"}
                onClick={(e) => {
                  if (!canBook) e.preventDefault();
                }}
                className={cn(
                  "btn mt-2.5 h-12 w-full text-sm",
                  canBook ? "btn-coral" : "pointer-events-none border border-white/10 text-mist-600",
                )}
              >
                Checkout now <ArrowRight className="h-4 w-4" />
              </Link>

              <ul className="mt-5 space-y-2 border-t border-white/8 pt-4">
                {[
                  "E-tickets delivered 48 hours before doors",
                  "Free transfer to a friend up to 7 days before",
                  "Full refund if the event is cancelled",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-xs text-mist-500">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-jade-400" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist-500">Organised by</p>
            <p className="mt-1.5 font-display text-base font-bold text-mist-100">{event.organiser}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-mist-500">
              Official OpenTickets partner. Ticket revenue settles to the organiser the next business day.
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------- Related -------------------------------- */}
      {related.length > 0 && (
        <section className="shell border-t border-white/8 py-16">
          <Reveal>
            <SectionHeading
              eyebrow="You may also like"
              title={`More ${CATEGORY_LABEL[event.category].toLowerCase()} in ${event.venue.city}`}
              action={
                <Link to="/events" className="btn btn-ghost h-11 px-5 text-sm">
                  Browse all <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          </Reveal>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e, i) => (
              <Reveal key={e.id} delay={i * 90}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------- Mobile bottom bar --------------------------- */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/95 px-4 py-3 backdrop-blur-2xl transition-transform duration-500 lg:hidden",
          barVisible && canBook ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="block truncate font-display text-sm font-bold text-mist-100">
              {useSeats ? `${seats.length} seats selected` : `${qty} × ${activeTier.name}`}
            </span>
            <span className="block font-display text-lg font-extrabold text-gold-300">{zar(total)}</span>
          </div>
          <button
            onClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="btn btn-ghost h-11 px-4 text-sm"
          >
            Change
          </button>
          <button onClick={() => addToCart()} className="btn btn-gold h-11 px-5 text-sm">
            Add to cart
          </button>
        </div>
      </div>
      <div className={cn("lg:hidden", barVisible && canBook && "h-20")} />
    </article>
  );
}

/** 10-minute seat hold countdown — resets when a new selection is made. */
function HoldTimer() {
  const [seconds, setSeconds] = useState(600);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <span className="font-mono text-[0.68rem] uppercase tracking-wider text-coral-200">
      Seats held · <span className="tabular-nums text-coral-300">{mm}:{ss}</span> remaining
    </span>
  );
}
