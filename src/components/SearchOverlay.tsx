import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CornerDownLeft, MapPin, Search, Sparkles, X } from "lucide-react";
import { CATEGORIES, CITIES, EVENTS } from "@/data/events";
import { longDate, zar } from "@/lib/format";
import { useEscape, useScrollLock } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useScrollLock(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return EVENTS.filter((e) => e.featured || e.trending).slice(0, 5);
    return EVENTS.filter((e) =>
      [e.title, e.artist, e.venue.city, e.venue.name, e.tags.join(" "), e.category]
        .join(" ")
        .toLowerCase()
        .includes(q),
    ).slice(0, 7);
  }, [q]);

  const cityHits = useMemo(
    () => (q ? CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 3) : []),
    [q],
  );

  const total = results.length + cityHits.length;

  function choose(path: string) {
    onClose();
    navigate(path);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(total - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (cursor < results.length && results[cursor]) choose(`/event/${results[cursor].slug}`);
      else if (cityHits[cursor - results.length])
        choose(`/search?city=${encodeURIComponent(cityHits[cursor - results.length])}`);
      else if (q) choose(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]">
      <button
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink-950/80 backdrop-blur-md"
        style={{ animation: "fade .25s ease both" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search events"
        className="relative w-full max-w-2xl overflow-hidden rounded-[22px] border border-white/12 bg-ink-850/95 shadow-lift backdrop-blur-2xl"
        style={{ animation: "pop .32s cubic-bezier(.22,.9,.24,1) both" }}
      >
        <div className="flex items-center gap-3 border-b border-white/8 px-5">
          <Search className="h-4.5 w-4.5 shrink-0 text-gold-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search artists, events, venues or cities…"
            className="h-16 w-full bg-transparent text-base text-mist-100 placeholder:text-mist-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-coral-400/50 hover:text-coral-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {!q && (
            <p className="px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist-500">
              Suggested for you
            </p>
          )}
          {q && total === 0 && (
            <div className="px-4 py-10 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-gold-400" />
              <p className="mt-3 font-display text-lg font-bold text-mist-100">
                Nothing matches “{query}”
              </p>
              <p className="mt-1.5 text-sm text-mist-500">
                Try an artist, a city like Cape Town, or a genre like Amapiano.
              </p>
              <button onClick={() => choose(`/search?q=${encodeURIComponent(q)}`)} className="btn btn-ghost mt-5 h-10 px-5 text-sm">
                Search all listings
              </button>
            </div>
          )}

          {results.map((e, i) => (
            <button
              key={e.id}
              onMouseEnter={() => setCursor(i)}
              onClick={() => choose(`/event/${e.slug}`)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                cursor === i ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
              )}
            >
              <img src={e.image} alt="" loading="lazy" className="h-11 w-14 shrink-0 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-mist-100">{e.title}</span>
                <span className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-[0.62rem] uppercase tracking-wider text-mist-500">
                  <MapPin className="h-3 w-3" /> {e.venue.city} · {longDate(e.date)}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-display text-sm font-bold text-gold-300">{zar(e.priceFrom)}</span>
                <span className="block font-mono text-[0.56rem] uppercase tracking-wider text-mist-500">from</span>
              </span>
            </button>
          ))}

          {cityHits.map((city, i) => (
            <button
              key={city}
              onMouseEnter={() => setCursor(results.length + i)}
              onClick={() => choose(`/search?city=${encodeURIComponent(city)}`)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                cursor === results.length + i ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
              )}
            >
              <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                <MapPin className="h-4 w-4 text-gold-400" />
              </span>
              <span className="flex-1 text-sm font-semibold text-mist-100">{city}</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider text-mist-500">
                {EVENTS.filter((e) => e.venue.city === city).length} events
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 bg-white/[0.02] px-5 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => choose(`/search?category=${c.id}`)}
                className="chip py-1 text-[0.7rem]"
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-3 font-mono text-[0.6rem] uppercase tracking-wider text-mist-500 sm:flex">
            <span className="flex items-center gap-1">↑↓ navigate</span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" /> open
            </span>
            <button onClick={() => choose("/search")} className="flex items-center gap-1 text-gold-300 hover:text-gold-200">
              advanced <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pop { from { opacity: 0; transform: translate3d(0,16px,0) scale(.97) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}
