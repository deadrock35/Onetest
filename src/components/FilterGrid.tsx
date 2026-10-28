import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, Rows3 } from "lucide-react";
import type { Category, EventItem } from "@/data/events";
import { CATEGORIES } from "@/data/events";
import { EventCard } from "./EventCard";
import { Pagination } from "./ui";
import { useFlip } from "@/hooks/useFlip";
import { Reveal } from "./Reveal";
import { cn } from "@/utils/cn";

const PER_PAGE = 8;

export type FilterId = "all" | Category;

interface FilterGridProps {
  events: EventItem[];
  initial?: FilterId;
  eyebrow?: string;
  title?: string;
  description?: string;
  link?: { to: string; label: string };
  view?: "grid" | "list";
  showViewToggle?: boolean;
  emptyAction?: { to: string; label: string };
}

export function FilterGrid({
  events,
  initial = "all",
  eyebrow = "The line-up",
  title = "What's on across South Africa",
  description,
  link,
  view: controlledView,
  showViewToggle = false,
  emptyAction = { to: "/events", label: "Browse all events" },
}: FilterGridProps) {
  const [filter, setFilter] = useState<FilterId>(initial);
  const [page, setPage] = useState(1);
  const [internalView, setInternalView] = useState<"grid" | "list">("grid");
  const sectionRef = useRef<HTMLElement | null>(null);
  const view = controlledView ?? internalView;

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: events.length };
    CATEGORIES.forEach((c) => {
      map[c.id] = events.filter((e) => e.category === c.id).length;
    });
    return map;
  }, [events]);

  const visible = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.category === filter)),
    [events, filter],
  );

  const totalPages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = visible.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const rangeFrom = visible.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1;
  const rangeTo = Math.min(safePage * PER_PAGE, visible.length);

  const { ref, capture } = useFlip<HTMLDivElement>([filter, view, safePage, pageItems.length]);

  // Keep pagination valid if the incoming collection shrinks.
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  /** Scroll back to the top of the discovery section so page changes start at card 1. */
  const goToPage = (next: number) => {
    if (next === safePage || next < 1 || next > totalPages) return;
    capture();
    setPage(next);
    const node = sectionRef.current;
    if (!node) return;
    const header = window.matchMedia("(min-width: 1024px)").matches ? 64 : 82;
    const top = node.getBoundingClientRect().top + window.scrollY - header - 16;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <section ref={sectionRef} className="shell relative py-16 lg:py-24" id="events-grid">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400/60" />
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[0.98]">
            {title}
          </h2>
          {description && <p className="mt-4 text-sm leading-relaxed text-mist-400 md:text-base">{description}</p>}
        </div>
        {link && (
          <Link
            to={link.to}
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-gold-300"
          >
            <span className="link-underline">{link.label}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        )}
      </Reveal>

      {/* Filter bar */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-white/8 py-4">
        <div className="no-scrollbar -mx-1 flex flex-1 items-center gap-2 overflow-x-auto px-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                if (f.id === filter) return;
                capture();
                setFilter(f.id);
                setPage(1);
              }}
              data-active={filter === f.id}
              className="chip shrink-0"
              aria-pressed={filter === f.id}
            >
              {f.label}
              <span
                className={cn(
                  "font-mono text-[0.62rem] tabular-nums transition-colors",
                  filter === f.id ? "text-ink-900/70" : "text-mist-500",
                )}
              >
                {counts[f.id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-mist-500">
            {visible.length === 0
              ? "0 events"
              : `${rangeFrom}–${rangeTo} of ${visible.length}`}
          </span>
          {showViewToggle && (
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                onClick={() => {
                  capture();
                  setInternalView("grid");
                }}
                aria-label="Grid view"
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-colors",
                  view === "grid" ? "bg-gold-400 text-ink-900" : "text-mist-400 hover:text-mist-100",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  capture();
                  setInternalView("list");
                }}
                aria-label="List view"
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-colors",
                  view === "list" ? "bg-gold-400 text-ink-900" : "text-mist-400 hover:text-mist-100",
                )}
              >
                <Rows3 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        ref={ref}
        className={cn(
          "mt-8 grid gap-5",
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1",
        )}
      >
        {pageItems.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            variant={view === "grid" ? "grid" : "list"}
          />
        ))}
      </div>

      {/* Pagination — 8 events per page */}
      {visible.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-5 border-t border-white/8 pt-8">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-mist-500">
            Showing <span className="text-mist-200">{rangeFrom}–{rangeTo}</span> of{" "}
            <span className="text-mist-200">{visible.length}</span> events
            <span className="mx-2 text-mist-600">·</span>
            Page <span className="text-gold-300">{safePage}</span> of {totalPages}
          </p>

          <Pagination page={safePage} totalPages={totalPages} onChange={goToPage} label="Discovery pages" />

          <Link
            to="/events"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-300"
          >
            <span className="link-underline">See all {events.length} events with advanced filters</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      )}

      {visible.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-12 text-center">
          <p className="font-display text-xl font-bold text-mist-200">No events in this category yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist-500">
            New listings are added every Thursday. Try another category or browse the full calendar.
          </p>
          <Link to={emptyAction.to} className="btn btn-ghost mt-6 h-11 px-6 text-sm">
            {emptyAction.label}
          </Link>
        </div>
      )}
    </section>
  );
}
