import { CalendarDays, Clock3, MapPin, TicketCheck } from "lucide-react";
import { longDate, zar } from "@/lib/format";
import { cn } from "@/utils/cn";

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic barcode bars from a seed string. */
function Barcode({ seed, className }: { seed: string; className?: string }) {
  const h = hash(seed);
  const bars = Array.from({ length: 46 }, (_, i) => {
    const n = (h >> (i % 24)) ^ (i * 2654435761);
    return { w: 1 + (Math.abs(n) % 3), o: 0.35 + (Math.abs(n >> 4) % 65) / 100 };
  });
  return (
    <div className={cn("flex h-9 items-end gap-[2px]", className)} aria-hidden="true">
      {bars.map((b, i) => (
        <span
          key={i}
          className="block h-full rounded-[1px] bg-mist-100"
          style={{ width: `${b.w}px`, opacity: b.o }}
        />
      ))}
    </div>
  );
}

/** Deterministic pseudo-QR block. */
function QrBlock({ seed }: { seed: string }) {
  const h = hash(seed);
  const cells = Array.from({ length: 121 }, (_, i) => ((h >> (i % 20)) ^ (i * 37)) % 3 === 0);
  return (
    <div className="grid h-16 w-16 grid-cols-11 gap-px rounded-md bg-ink-950 p-1" aria-hidden="true">
      {cells.map((on, i) => (
        <span key={i} className={cn("rounded-[1px]", on ? "bg-mist-100" : "bg-transparent")} />
      ))}
    </div>
  );
}

export interface StubData {
  key: string;
  title: string;
  image: string;
  date: string;
  venue: string;
  city: string;
  tier: string;
  doors?: string;
  seats?: string[];
  qty: number;
  price: number;
  reference: string;
  status?: "valid" | "used" | "pending";
}

export function TicketStub({ stub, className }: { stub: StubData; className?: string }) {
  const statusTone = {
    valid: "border-jade-400/35 bg-jade-400/10 text-jade-400",
    used: "border-white/12 bg-white/5 text-mist-500",
    pending: "border-gold-400/35 bg-gold-400/10 text-gold-300",
  }[stub.status ?? "valid"];

  return (
    <article
      className={cn(
        "group relative grid overflow-hidden rounded-[20px] border border-white/10 bg-ink-850 shadow-rest transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/35 hover:shadow-lift sm:grid-cols-[minmax(0,1fr)_12.5rem]",
        className,
      )}
    >
      {/* Left: event */}
      <div className="relative flex gap-4 p-4">
        <img
          src={stub.image}
          alt=""
          loading="lazy"
          className="h-24 w-20 shrink-0 rounded-xl object-cover sm:h-28 sm:w-24"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-wider", statusTone)}>
              {stub.status === "used" ? "Scanned" : stub.status === "pending" ? "Pending" : "Valid"}
            </span>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist-600">
              {stub.reference}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug text-mist-100 transition-colors group-hover:text-gold-200 sm:text-lg">
            {stub.title}
          </h3>
          <dl className="mt-2.5 space-y-1 text-[0.72rem] text-mist-400">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gold-400" />
              {longDate(stub.date)}
              {stub.doors && <span className="text-mist-600">· doors {stub.doors}</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold-400" />
              <span className="truncate">{stub.venue}, {stub.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TicketCheck className="h-3.5 w-3.5 text-gold-400" />
              {stub.qty} × {stub.tier}
              {stub.seats && stub.seats.length > 0 && (
                <span className="text-gold-300">· {stub.seats.join(", ")}</span>
              )}
            </div>
          </dl>
        </div>
      </div>

      {/* Perforation */}
      <div className="pointer-events-none absolute inset-y-0 left-[calc(100%-12.5rem)] hidden w-px sm:block">
        <span className="absolute inset-y-3 left-0 w-px bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.22)_0_5px,transparent_5px_11px)]" />
        <span className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full bg-ink-950" />
        <span className="absolute -bottom-[9px] -left-[9px] h-[18px] w-[18px] rounded-full bg-ink-950" />
      </div>

      {/* Right: stub */}
      <div className="relative flex flex-col items-center justify-center gap-3 border-t border-dashed border-white/12 bg-white/[0.02] px-4 py-5 sm:border-l sm:border-t-0">
        <QrBlock seed={stub.key} />
        <Barcode seed={stub.reference} className="w-full max-w-[9.5rem]" />
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">
          {stub.key.slice(-10).toUpperCase()}
        </p>
        <p className="flex items-center gap-1.5 font-display text-sm font-extrabold text-gold-300">
          <Clock3 className="h-3.5 w-3.5" /> {zar(stub.price * stub.qty)}
        </p>
      </div>
    </article>
  );
}
