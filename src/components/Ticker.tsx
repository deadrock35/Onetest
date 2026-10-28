import { Bolt } from "lucide-react";
import { EVENTS } from "@/data/events";
import { zar } from "@/lib/format";

const TICKER_ITEMS = EVENTS.filter((e) => e.trending || e.soldPercent > 70).map((e) => ({
  id: e.id,
  label: `${e.title}`,
  detail: `${e.venue.city} · from ${zar(e.priceFrom)} · ${e.soldPercent}% sold`,
}));

export function Ticker() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative border-y border-white/8 bg-ink-900/80 py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center gap-2 bg-gradient-to-r from-ink-950 via-ink-950/90 to-transparent pr-10 pl-[max(var(--gutter),1rem)]">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-coral-500/15 text-coral-400">
          <Bolt className="h-3.5 w-3.5 fill-current" />
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-coral-300">Live now</span>
      </div>

      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 will-change-transform">
          {row.map((item, i) => (
            <span key={`${item.id}-${i}`} className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1 w-1 rounded-full bg-gold-400/70" />
              <span className="font-display text-sm font-semibold text-mist-200">{item.label}</span>
              <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-mist-500">
                {item.detail}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
