import { cn } from "@/utils/cn";

/** OpenTickets brand mark — a perforated ticket stub in champagne gold. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="otGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8ecd2" />
            <stop offset="48%" stopColor="#e3c07e" />
            <stop offset="100%" stopColor="#a5803f" />
          </linearGradient>
        </defs>
        <path
          d="M7 8h26a3 3 0 0 1 3 3v5.2a3.8 3.8 0 0 0 0 7.6V29a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5.2a3.8 3.8 0 0 0 0-7.6V11a3 3 0 0 1 3-3Z"
          fill="url(#otGold)"
        />
        <path
          d="M25.5 12v16"
          stroke="#0b0f19"
          strokeWidth="1.6"
          strokeDasharray="2.4 2.8"
          strokeLinecap="round"
          opacity="0.72"
        />
        <circle cx="15" cy="17.5" r="3.4" fill="#0b0f19" opacity="0.82" />
        <path d="M11 25h8" stroke="#0b0f19" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.15rem] font-extrabold tracking-tight text-mist-100">
          Open<span className="text-gold-400">Tickets</span>
        </span>
        {!compact && (
          <span className="mt-1 block font-mono text-[0.56rem] uppercase tracking-[0.34em] text-mist-500">
            co.za
          </span>
        )}
      </span>
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-extrabold tracking-tight", className)}>
      Open<span className="text-gold-400">Tickets</span>
    </span>
  );
}
