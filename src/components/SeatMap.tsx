import { useMemo, useState } from "react";
import { Accessibility, Minus, Plus, RotateCcw, TicketCheck, ZoomIn, ZoomOut } from "lucide-react";
import type { EventItem } from "@/data/events";
import { zar } from "@/lib/format";
import { cn } from "@/utils/cn";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
const SEATS_PER_ROW = 20;
const AISLE_AFTER = [7, 14];
const SEAT = 16;
const GAP = 5;
const PITCH = SEAT + GAP;
const AISLE = 18;
const LEFT_PAD = 30;

/** Deterministic pseudo-random occupancy so mock data is stable between renders. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seatX(col: number) {
  const aisles = AISLE_AFTER.filter((a) => col > a).length;
  return LEFT_PAD + col * PITCH + aisles * AISLE;
}

const MAP_WIDTH = seatX(SEATS_PER_ROW) + SEAT + 32;
const LABEL_RIGHT = MAP_WIDTH - 18;

export interface SeatSelection {
  id: string;
  row: string;
  seat: number;
  section: string;
  price: number;
}

interface SeatMapProps {
  event: EventItem;
  selected: SeatSelection[];
  onToggle: (seat: SeatSelection) => void;
  maxSeats?: number;
}

export function SeatMap({ event, selected, onToggle, maxSeats = 6 }: SeatMapProps) {
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<SeatSelection | null>(null);

  const tiers = event.tiers;
  const sectionFor = (rowIndex: number) => {
    if (rowIndex < 3) return { name: tiers[Math.min(2, tiers.length - 1)].name, price: tiers[Math.min(2, tiers.length - 1)].price, tone: "gold" as const };
    if (rowIndex < 9) return { name: tiers[Math.min(1, tiers.length - 1)].name, price: tiers[Math.min(1, tiers.length - 1)].price, tone: "iris" as const };
    return { name: tiers[0].name, price: tiers[0].price, tone: "mist" as const };
  };

  const sold = useMemo(() => {
    const set = new Set<string>();
    const seed = hash(event.id);
    ROWS.forEach((row, r) => {
      for (let c = 0; c < SEATS_PER_ROW; c++) {
        const n = (seed ^ hash(`${row}${c}`)) % 100;
        // Front rows sell out faster — mirrors real house occupancy curves.
        const threshold = r < 3 ? 74 : r < 9 ? 58 : 34;
        if (n < threshold) set.add(`${row}-${c + 1}`);
      }
    });
    return set;
  }, [event.id]);

  const toneClass = {
    gold: { fill: "#e3c07e", hover: "#f8ecd2" },
    iris: { fill: "#8fa8ff", hover: "#c3d0ff" },
    mist: { fill: "#5b6a8c", hover: "#93a0bd" },
  };

  const isSelected = (id: string) => selected.some((s) => s.id === id);
  const available = ROWS.length * SEATS_PER_ROW - sold.size;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-ink-850">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div>
          <h3 className="font-display text-base font-bold text-mist-100">Choose your seats</h3>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mist-500">
            {event.venue.name} · {available} seats available · max {maxSeats} per booking
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
            aria-label="Zoom out"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-gold-400/50 hover:text-gold-300"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="w-11 text-center font-mono text-[0.62rem] tabular-nums text-mist-500">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.75, +(z + 0.25).toFixed(2)))}
            aria-label="Zoom in"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-gold-400/50 hover:text-gold-300"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            aria-label="Reset zoom"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-gold-400/50 hover:text-gold-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar overflow-x-auto px-4 py-6">
        <div className="mx-auto w-fit" style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform .3s ease" }}>
          <svg
            width={MAP_WIDTH}
            height={ROWS.length * (PITCH + 6) + 118}
            viewBox={`0 0 ${MAP_WIDTH} ${ROWS.length * (PITCH + 6) + 118}`}
            role="img"
            aria-label={`Seat map for ${event.title}`}
          >
            {/* Stage */}
            <path
              d={`M 34 34 Q ${MAP_WIDTH / 2} 2 ${MAP_WIDTH - 34} 34 L ${MAP_WIDTH - 34} 44 Q ${MAP_WIDTH / 2} 14 34 44 Z`}
              fill="url(#stageGrad)"
            />
            <text
              x={MAP_WIDTH / 2}
              y={62}
              textAnchor="middle"
              className="font-mono"
              fontSize="9"
              letterSpacing="4"
              fill="#e3c07e"
            >
              STAGE
            </text>
            <defs>
              <linearGradient id="stageGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e3c07e" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#f8ecd2" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#e3c07e" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {ROWS.map((row, r) => {
              const y = 82 + r * (PITCH + 6);
              const section = sectionFor(r);
              return (
                <g key={row}>
                  <text x={10} y={y + SEAT - 3} fontSize="9" fill="#74809c" className="font-mono">
                    {row}
                  </text>
                  <text x={LABEL_RIGHT} y={y + SEAT - 3} fontSize="9" fill="#74809c" className="font-mono">
                    {row}
                  </text>
                  {Array.from({ length: SEATS_PER_ROW }).map((_, c) => {
                    const id = `${row}-${c + 1}`;
                    const isSold = sold.has(id);
                    const sel = isSelected(id);
                    const seat: SeatSelection = {
                      id,
                      row,
                      seat: c + 1,
                      section: section.name,
                      price: section.price,
                    };
                    const fill = sel
                      ? "#f8ecd2"
                      : isSold
                        ? "#242d42"
                        : toneClass[section.tone].fill;
                    return (
                      <g
                        key={id}
                        onMouseEnter={() => !isSold && setHover(seat)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => {
                          if (isSold) return;
                          if (!sel && selected.length >= maxSeats) return;
                          onToggle(seat);
                        }}
                        style={{ cursor: isSold ? "not-allowed" : "pointer" }}
                      >
                        <title>
                          {isSold
                            ? `Row ${row} seat ${c + 1} — sold`
                            : `Row ${row} · Seat ${c + 1} · ${section.name} · ${zar(section.price)}`}
                        </title>
                        <rect
                          x={seatX(c)}
                          y={y}
                          width={SEAT}
                          height={SEAT}
                          rx={3.5}
                          fill={fill}
                          opacity={isSold ? 0.55 : sel ? 1 : 0.85}
                          stroke={sel ? "#0b0f19" : "transparent"}
                          strokeWidth={sel ? 1.4 : 0}
                          style={{ transition: "fill .2s ease, opacity .2s ease" }}
                        />
                        {hover?.id === id && !isSold && (
                          <rect
                            x={seatX(c) - 2}
                            y={y - 2}
                            width={SEAT + 4}
                            height={SEAT + 4}
                            rx={5}
                            fill="none"
                            stroke={toneClass[section.tone].hover}
                            strokeWidth={1.4}
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Wheelchair platform */}
            {Array.from({ length: 5 }).map((_, i) => {
              const id = `WC-${i + 1}`;
              const sel = isSelected(id);
              const seat: SeatSelection = { id, row: "WC", seat: i + 1, section: "Wheelchair bay", price: tiers[0].price };
              const y = 82 + ROWS.length * (PITCH + 6) + 8;
              return (
                <g
                  key={id}
                  onMouseEnter={() => setHover(seat)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => (sel || selected.length < maxSeats ? onToggle(seat) : null)}
                  style={{ cursor: "pointer" }}
                >
                  <title>{`Wheelchair bay ${i + 1} · companion seat included · ${zar(tiers[0].price)}`}</title>
                  <rect
                    x={seatX(3 + i * 3)}
                    y={y}
                    width={SEAT + 6}
                    height={SEAT + 6}
                    rx={4}
                    fill={sel ? "#f8ecd2" : "#4fd6a8"}
                    opacity={sel ? 1 : 0.7}
                    stroke={sel ? "#0b0f19" : "transparent"}
                  />
                  <text x={seatX(3 + i * 3) + (SEAT + 6) / 2} y={y + 15} textAnchor="middle" fontSize="9" fill="#05070d">
                    ♿
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend + hover readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3.5">
          {[
            { label: "Premium", color: "#e3c07e" },
            { label: "Mid tier", color: "#8fa8ff" },
            { label: "Standard", color: "#5b6a8c" },
            { label: "Sold", color: "#242d42" },
            { label: "Accessible", color: "#4fd6a8" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-mist-500">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <p className="flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-wider text-gold-300">
          {hover ? (
            <>
              <Accessibility className="h-3.5 w-3.5" />
              {hover.row === "WC" ? `Wheelchair bay ${hover.seat}` : `Row ${hover.row} · Seat ${hover.seat}`} ·{" "}
              {zar(hover.price)}
            </>
          ) : (
            <>
              <TicketCheck className="h-3.5 w-3.5" /> Hover a seat for details
            </>
          )}
        </p>
      </div>

      {/* Selected seats tray */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500",
          selected.length ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-t border-gold-400/20 bg-gold-400/[0.05] px-4 py-3">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-gold-300">
              {selected.length} selected
            </span>
            {selected.map((s) => (
              <button
                key={s.id}
                onClick={() => onToggle(s)}
                className="group flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-ink-950/60 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold-200 transition-colors hover:border-coral-400/60 hover:text-coral-300"
              >
                {s.row === "WC" ? `WC ${s.seat}` : `${s.row}${s.seat}`}
                <Minus className="h-3 w-3" />
              </button>
            ))}
            <span className="ml-auto flex items-center gap-1 font-display text-sm font-bold text-mist-100">
              <Plus className="h-3 w-3 text-gold-400" />
              {zar(selected.reduce((sum, s) => sum + s.price, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
