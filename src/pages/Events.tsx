import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  MapPin,
  Rows3,
  Search,
  SlidersHorizontal,
  Sparkles,
  TicketCheck,
  X,
} from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { Badge } from "@/components/ui";
import { CATEGORIES, CITIES, EVENTS, PRICE_BANDS, VENUES } from "@/data/events";
import { TODAY, parseDate, shortDate, zar } from "@/lib/format";
import { useFlip } from "@/hooks/useFlip";
import { usePageTitle, useScrollLock } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

type SortId = "popular" | "date" | "price-asc" | "price-desc" | "rating";

const SORTS: { id: SortId; label: string }[] = [
  { id: "popular", label: "Most popular" },
  { id: "date", label: "Date — soonest first" },
  { id: "price-asc", label: "Price — low to high" },
  { id: "price-desc", label: "Price — high to low" },
  { id: "rating", label: "Highest rated" },
];

const PAGE_SIZE = 8;

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function nextWeekend() {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return { from: iso(d), to: iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) };
}

const DATE_PRESETS = [
  { id: "weekend", label: "This weekend", range: nextWeekend() },
  { id: "week", label: "Next 7 days", range: { from: iso(TODAY), to: iso(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 7)) } },
  { id: "month", label: "This month", range: { from: iso(TODAY), to: iso(new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0)) } },
  { id: "quarter", label: "Next 3 months", range: { from: iso(TODAY), to: iso(new Date(TODAY.getFullYear(), TODAY.getMonth() + 3, TODAY.getDate())) } },
];

export function Listing({ mode = "events" }: { mode?: "events" | "search" }) {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">((params.get("view") as "grid" | "list") ?? "grid");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawer, setDrawer] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  useScrollLock(drawer);
  usePageTitle(
    mode === "search"
      ? params.get("q")
        ? `Search: ${params.get("q")}`
        : "Search events"
      : "All events",
  );

  const { ref: gridRef, capture } = useFlip<HTMLDivElement>([
    params.toString(),
    view,
    visible,
  ]);

  const q = params.get("q") ?? "";
  const cats = (params.get("category") ?? "").split(",").filter(Boolean);
  const cities = (params.get("city") ?? "").split(",").filter(Boolean);
  const venues = (params.get("venue") ?? "").split(",").filter(Boolean);
  const maxPrice = Number(params.get("price") ?? 4000);
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const seatedOnly = params.get("seated") === "1";
  const sort = (params.get("sort") as SortId) ?? "popular";

  function update(pairs: Record<string, string | null>) {
    capture();
    const next = new URLSearchParams(params);
    Object.entries(pairs).forEach(([k, v]) => {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    });
    setParams(next, { replace: true });
  }

  const toggleIn = (key: string, value: string) => {
    const current = (params.get(key) ?? "").split(",").filter(Boolean);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    update({ [key]: next.length ? next.join(",") : null });
  };

  useEffect(() => setVisible(PAGE_SIZE), [params.toString()]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = EVENTS.filter((e) => {
      if (needle) {
        const hay = `${e.title} ${e.artist} ${e.venue.name} ${e.venue.city} ${e.tags.join(" ")} ${e.blurb}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (cats.length && !cats.includes(e.category)) return false;
      if (cities.length && !cities.includes(e.venue.city)) return false;
      if (venues.length && !venues.includes(e.venue.name)) return false;
      if (e.priceFrom > maxPrice) return false;
      if (from && parseDate(e.date) < parseDate(from)) return false;
      if (to && parseDate(e.date) > parseDate(to)) return false;
      if (seatedOnly && !e.seated) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "date":
          return a.date.localeCompare(b.date);
        case "price-asc":
          return a.priceFrom - b.priceFrom;
        case "price-desc":
          return b.priceFrom - a.priceFrom;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.soldPercent - a.soldPercent;
      }
    });
    return list;
  }, [q, cats.join(), cities.join(), venues.join(), maxPrice, from, to, seatedOnly, sort]);

  const activeChips: { label: string; clear: () => void }[] = [
    ...(q ? [{ label: `“${q}”`, clear: () => update({ q: null }) }] : []),
    ...cats.map((c) => ({
      label: CATEGORIES.find((x) => x.id === c)?.label ?? c,
      clear: () => toggleIn("category", c),
    })),
    ...cities.map((c) => ({ label: c, clear: () => toggleIn("city", c) })),
    ...venues.map((v) => ({ label: v, clear: () => toggleIn("venue", v) })),
    ...(maxPrice < 4000 ? [{ label: `Under ${zar(maxPrice)}`, clear: () => update({ price: null }) }] : []),
    ...(from || to ? [{ label: `${from ? shortDate(from) : "Any"} → ${to ? shortDate(to) : "Any"}`, clear: () => update({ from: null, to: null }) }] : []),
    ...(seatedOnly ? [{ label: "Reserved seating", clear: () => update({ seated: null }) }] : []),
  ];

  const clearAll = () => {
    capture();
    setParams(new URLSearchParams(), { replace: true });
  };

  const shown = results.slice(0, visible);

  const filtersPanel = (
    <div className="space-y-8">
      {/* Keyword */}
      <FilterBlock title="Keyword" icon={<Search className="h-3.5 w-3.5" />}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <input
            value={q}
            onChange={(e) => update({ q: e.target.value || null })}
            placeholder="Artist, event or tag…"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-9 text-sm text-mist-100 placeholder:text-mist-600 focus:border-gold-400/60 focus:outline-none"
          />
          {q && (
            <button
              onClick={() => update({ q: null })}
              aria-label="Clear keyword"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500 hover:text-coral-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </FilterBlock>

      {/* Category */}
      <FilterBlock title="Category" icon={<Sparkles className="h-3.5 w-3.5" />}>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              data-active={cats.includes(c.id)}
              onClick={() => toggleIn("category", c.id)}
              className="chip"
            >
              {c.label}
              <span className={cn("font-mono text-[0.6rem] tabular-nums", cats.includes(c.id) ? "text-ink-900/70" : "text-mist-500")}>
                {EVENTS.filter((e) => e.category === c.id).length}
              </span>
            </button>
          ))}
        </div>
      </FilterBlock>

      {/* Date range */}
      <FilterBlock title="Date range" icon={<CalendarDays className="h-3.5 w-3.5" />}>
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((p) => {
            const active = from === p.range.from && to === p.range.to;
            return (
              <button
                key={p.id}
                data-active={active}
                onClick={() =>
                  active ? update({ from: null, to: null }) : update({ from: p.range.from, to: p.range.to })
                }
                className="chip"
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist-600">From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => update({ from: e.target.value || null })}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 font-mono text-xs text-mist-200 focus:border-gold-400/60 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist-600">To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => update({ to: e.target.value || null })}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 font-mono text-xs text-mist-200 focus:border-gold-400/60 focus:outline-none"
            />
          </label>
        </div>
      </FilterBlock>

      {/* Price */}
      <FilterBlock title="Budget" icon={<span className="font-mono text-[0.6rem]">R</span>}>
        <div className="flex items-baseline justify-between">
          <span className="font-display text-lg font-extrabold text-mist-100">
            {maxPrice >= 4000 ? "Any price" : `Up to ${zar(maxPrice)}`}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-mist-600">from price</span>
        </div>
        <input
          type="range"
          min={150}
          max={4000}
          step={50}
          value={maxPrice}
          onChange={(e) => update({ price: e.target.value })}
          className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10"
          aria-label="Maximum ticket price"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => {
            const active = maxPrice === b.max;
            return (
              <button
                key={b.id}
                data-active={active}
                onClick={() => update({ price: active ? null : String(b.max === Infinity ? 4000 : b.max) })}
                className="chip px-2.5 py-1 text-[0.7rem]"
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      {/* City */}
      <FilterBlock title="City" icon={<MapPin className="h-3.5 w-3.5" />}>
        <div className="space-y-1">
          {CITIES.map((city) => {
            const count = EVENTS.filter((e) => e.venue.city === city).length;
            const active = cities.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggleIn("city", city)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-gold-400/12 text-gold-200" : "text-mist-300 hover:bg-white/[0.04]",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded border transition-colors",
                      active ? "border-gold-400 bg-gold-400" : "border-white/20",
                    )}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-[1px] bg-ink-900" />}
                  </span>
                  {city}
                </span>
                <span className="font-mono text-[0.6rem] tabular-nums text-mist-600">{count}</span>
              </button>
            );
          })}
        </div>
      </FilterBlock>

      {/* Venue */}
      <FilterBlock title="Venue" icon={<TicketCheck className="h-3.5 w-3.5" />}>
        <div className="no-scrollbar max-h-56 space-y-1 overflow-y-auto pr-1">
          {VENUES.map((v) => {
            const active = venues.includes(v.name);
            return (
              <button
                key={v.id}
                onClick={() => toggleIn("venue", v.name)}
                className={cn(
                  "flex w-full items-start justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  active ? "bg-gold-400/12 text-gold-200" : "text-mist-300 hover:bg-white/[0.04]",
                )}
              >
                <span className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors",
                      active ? "border-gold-400 bg-gold-400" : "border-white/20",
                    )}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-[1px] bg-ink-900" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{v.name}</span>
                    <span className="block font-mono text-[0.58rem] uppercase tracking-wider text-mist-600">
                      {v.city} · cap {v.capacity.toLocaleString("en-ZA")}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </FilterBlock>

      {/* Seating */}
      <FilterBlock title="Seating" icon={<LayoutGrid className="h-3.5 w-3.5" />}>
        <button
          onClick={() => update({ seated: seatedOnly ? null : "1" })}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors",
            seatedOnly ? "border-gold-400/40 bg-gold-400/10 text-gold-200" : "border-white/10 text-mist-300 hover:border-white/20",
          )}
        >
          Reserved seating only
          <span
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              seatedOnly ? "bg-gold-400" : "bg-white/12",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-ink-900 transition-transform duration-300",
                seatedOnly ? "translate-x-4.5" : "translate-x-0.5",
              )}
            />
          </span>
        </button>
      </FilterBlock>

      <button onClick={clearAll} className="btn btn-ghost h-11 w-full text-sm">
        <X className="h-4 w-4" /> Clear all filters
      </button>
    </div>
  );

  return (
    <div className="relative pt-[calc(var(--header-h)+1.5rem)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(90%_60%_at_20%_0%,rgba(227,192,126,0.10),transparent_65%),radial-gradient(70%_50%_at_85%_10%,rgba(244,89,58,0.08),transparent_60%)]" />

      {/* Page head */}
      <div className="shell relative border-b border-white/8 pb-8 pt-6">
        <nav className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist-600">
          <Link to="/" className="hover:text-gold-300">Home</Link>
          <span>/</span>
          <span className="text-mist-400">{mode === "search" ? "Search" : "Events"}</span>
        </nav>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-[clamp(2.1rem,4.6vw,3.4rem)] font-extrabold leading-[1]">
              {mode === "search" ? (
                <>
                  {q ? (
                    <>
                      Results for <span className="text-gold-300">“{q}”</span>
                    </>
                  ) : (
                    <>Search every listing</>
                  )}
                </>
              ) : (
                <>Every event, one calendar</>
              )}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-mist-400 md:text-base">
              {EVENTS.length} verified listings across {CITIES.length} South African cities — filter by date,
              budget, city, venue or seating type. Prices include VAT; a flat {zar(35)} booking fee applies per order.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex h-12 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 lg:w-80 lg:flex-none">
              <Search className="h-4 w-4 shrink-0 text-gold-400" />
              <input
                value={q}
                onChange={(e) => update({ q: e.target.value || null })}
                placeholder="Search events, artists, venues…"
                className="h-full w-full bg-transparent text-sm text-mist-100 placeholder:text-mist-600 focus:outline-none"
              />
              {q && (
                <button onClick={() => update({ q: null })} aria-label="Clear search" className="text-mist-500 hover:text-coral-400">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setDrawer(true)}
              className="btn btn-ghost h-12 px-5 text-sm lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeChips.length > 0 && (
                <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-gold-400 font-mono text-[0.6rem] text-ink-900">
                  {activeChips.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="shell relative grid gap-10 py-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h-sm)+1.5rem)] max-h-[calc(100vh-9rem)] overflow-y-auto rounded-[var(--radius-card)] border border-white/8 bg-ink-850/60 p-5 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-mist-100">
                <SlidersHorizontal className="h-4 w-4 text-gold-400" /> Filters
              </h2>
              {activeChips.length > 0 && (
                <button onClick={clearAll} className="font-mono text-[0.6rem] uppercase tracking-wider text-coral-400 hover:text-coral-300">
                  Reset
                </button>
              )}
            </div>
            {filtersPanel}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="font-display text-lg font-bold text-mist-100">
                {results.length} <span className="text-sm font-normal text-mist-500">events found</span>
              </p>
              {seatedOnly && <Badge tone="gold">Reserved seating</Badge>}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-mist-300 transition-colors hover:border-gold-400/50 hover:text-mist-100"
                >
                  Sort: <span className="font-semibold text-mist-100">{SORTS.find((s) => s.id === sort)?.label}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", sortOpen && "rotate-180")} />
                </button>
                <div
                  className={cn(
                    "absolute right-0 top-[calc(100%+8px)] z-30 w-60 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-ink-850/97 p-1.5 shadow-lift backdrop-blur-2xl transition-all duration-250",
                    sortOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
                  )}
                >
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        update({ sort: s.id === "popular" ? null : s.id });
                        setSortOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                        sort === s.id ? "bg-gold-400/12 text-gold-200" : "text-mist-300 hover:bg-white/[0.05]",
                      )}
                    >
                      {s.label}
                      {sort === s.id && <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 sm:flex">
                <button
                  onClick={() => {
                    capture();
                    setView("grid");
                  }}
                  aria-label="Grid view"
                  className={cn("grid h-8 w-8 place-items-center rounded-full transition-colors", view === "grid" ? "bg-gold-400 text-ink-900" : "text-mist-400 hover:text-mist-100")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    capture();
                    setView("list");
                  }}
                  aria-label="List view"
                  className={cn("grid h-8 w-8 place-items-center rounded-full transition-colors", view === "list" ? "bg-gold-400 text-ink-900" : "text-mist-400 hover:text-mist-100")}
                >
                  <Rows3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active chips */}
          {activeChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist-600">Active</span>
              {activeChips.map((chip, i) => (
                <button
                  key={`${chip.label}-${i}`}
                  onClick={chip.clear}
                  className="group flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-xs text-gold-200 transition-colors hover:border-coral-400/50 hover:bg-coral-400/10 hover:text-coral-200"
                >
                  {chip.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button onClick={clearAll} className="ml-1 font-mono text-[0.62rem] uppercase tracking-wider text-mist-500 hover:text-mist-200">
                clear all
              </button>
            </div>
          )}

          {/* Grid / list */}
          <div
            ref={gridRef}
            className={cn(
              "mt-6 grid gap-5",
              view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
            )}
          >
            {shown.map((e) => (
              <EventCard key={e.id} event={e} variant={view} />
            ))}
          </div>

          {results.length === 0 && (
            <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-dashed border-white/12 bg-white/[0.02] p-12 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-ink-850 text-mist-500">
                <Search className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-extrabold text-mist-100">
                No events match those filters
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist-400">
                Try widening your budget or date range — or clear the filters to see all {EVENTS.length} listings.
                New events are added every Thursday at 09:00.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button onClick={clearAll} className="btn btn-gold h-11 px-6 text-sm">
                  Clear all filters
                </button>
                <Link to="/faqs" className="btn btn-ghost h-11 px-6 text-sm">
                  Contact support
                </Link>
              </div>
            </div>
          )}

          {results.length > visible && (
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold-500 transition-[width] duration-700"
                  style={{ width: `${(visible / results.length) * 100}%` }}
                />
              </div>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-mist-600">
                Showing {visible} of {results.length}
              </p>
              <button
                onClick={() => {
                  capture();
                  setVisible((v) => v + PAGE_SIZE);
                }}
                className="btn btn-ghost h-12 px-7 text-sm"
              >
                Load more events <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={cn("fixed inset-0 z-[75] lg:hidden", !drawer && "pointer-events-none")}>
        <button
          aria-label="Close filters"
          onClick={() => setDrawer(false)}
          tabIndex={drawer ? 0 : -1}
          className={cn(
            "absolute inset-0 cursor-default bg-ink-950/75 backdrop-blur-sm transition-opacity duration-400",
            drawer ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[min(92vw,22rem)] overflow-y-auto border-r border-white/10 bg-ink-900 p-5 transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,.9,.24,1)]",
            drawer ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-mist-100">
              <SlidersHorizontal className="h-4 w-4 text-gold-400" /> Filters
            </h2>
            <button
              onClick={() => setDrawer(false)}
              aria-label="Close filters"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-mist-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {filtersPanel}
          <button onClick={() => setDrawer(false)} className="btn btn-gold mt-6 h-12 w-full text-sm">
            Show {results.length} events
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-gold-400">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

export function EventsPage() {
  return <Listing mode="events" />;
}

export function SearchPage() {
  return <Listing mode="search" />;
}
