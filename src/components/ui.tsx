import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/utils/cn";

/* ------------------------------- Section head ------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow && (
          <span className="eyebrow flex items-center gap-2 justify-center">
            <span className="h-px w-8 bg-gold-400/60" />
            {eyebrow}
            <span className="h-px w-8 bg-gold-400/60" />
          </span>
        )}
        <h2 className="mt-4 font-display text-[clamp(1.8rem,3.8vw,3rem)] font-extrabold leading-[1.02]">
          {title}
        </h2>
        {description && <p className="mt-4 text-sm leading-relaxed text-mist-400 md:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* --------------------------------- Rating --------------------------------- */
export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn("h-3.5 w-3.5", i <= Math.round(value) ? "fill-gold-400 text-gold-400" : "text-ink-600")}
          />
        ))}
      </span>
      <span className="font-mono text-[0.66rem] tabular-nums text-mist-400">{value.toFixed(1)}</span>
    </span>
  );
}

/* -------------------------------- Accordion -------------------------------- */
export interface AccordionItemData {
  q: ReactNode;
  a: ReactNode;
}

export function Accordion({
  items,
  defaultOpen = -1,
  tone = "panel",
}: {
  items: AccordionItemData[];
  defaultOpen?: number;
  tone?: "panel" | "hairline";
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("divide-y", tone === "hairline" ? "divide-white/8" : "divide-transparent space-y-2.5")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={cn(
              "overflow-hidden transition-all duration-400",
              tone === "panel"
                ? cn(
                    "rounded-2xl border bg-white/[0.02]",
                    isOpen ? "border-gold-400/35 bg-gold-400/[0.04]" : "border-white/8 hover:border-white/16",
                  )
                : isOpen
                  ? "bg-white/[0.03]"
                  : "hover:bg-white/[0.02]",
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span
                className={cn(
                  "font-display text-[0.98rem] font-semibold leading-snug transition-colors",
                  isOpen ? "text-gold-200" : "text-mist-200",
                )}
              >
                {item.q}
              </span>
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-400",
                  isOpen
                    ? "rotate-180 border-gold-400/50 bg-gold-400/12 text-gold-300"
                    : "border-white/12 text-mist-400",
                )}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-sm leading-relaxed text-mist-400">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- Tabs ---------------------------------- */
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: T; label: string; icon?: ReactNode }[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full border border-white/8 bg-white/[0.03] p-1.5",
        className,
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-350",
            active === t.id
              ? "bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900 shadow-gold"
              : "text-mist-400 hover:text-mist-100",
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------- Badge --------------------------------- */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "coral" | "jade" | "iris";
  className?: string;
}) {
  const tones = {
    neutral: "border-white/12 bg-white/[0.04] text-mist-300",
    gold: "border-gold-400/35 bg-gold-400/10 text-gold-300",
    coral: "border-coral-400/35 bg-coral-400/10 text-coral-300",
    jade: "border-jade-400/35 bg-jade-400/10 text-jade-400",
    iris: "border-iris-400/35 bg-iris-400/10 text-iris-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------- Pagination ------------------------------ */
export function Pagination({
  page,
  totalPages,
  onChange,
  className,
  label = "Event pages",
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
  label?: string;
}) {
  if (totalPages <= 1) return null;

  const all = Array.from({ length: totalPages }, (_, i) => i + 1);
  const windowed = Array.from(new Set([1, ...all.filter((p) => Math.abs(p - page) <= 1), totalPages])).sort(
    (a, b) => a - b,
  );
  const items: (number | "gap")[] = [];
  windowed.forEach((p, i) => {
    const previous = windowed[i - 1];
    if (previous !== undefined && p - previous > 1) items.push("gap");
    items.push(p);
  });

  const btn =
    "grid h-9 min-w-9 place-items-center rounded-full border px-3 font-mono text-xs tabular-nums transition-all duration-300";

  return (
    <nav aria-label={label} className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(btn, "border-white/12 text-mist-300 enabled:hover:border-gold-400/60 enabled:hover:text-gold-300 disabled:opacity-30")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="px-1 font-mono text-[0.62rem] uppercase tracking-wider text-mist-500 sm:hidden">
        {page} / {totalPages}
      </span>

      <div className="hidden items-center gap-1.5 sm:flex">
        {items.map((item, i) =>
          item === "gap" ? (
            <span key={`gap-${i}`} className="px-1 font-mono text-xs text-mist-600">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                btn,
                item === page
                  ? "border-gold-400 bg-gold-400 font-bold text-ink-900 shadow-gold"
                  : "border-white/12 text-mist-300 hover:border-gold-400/60 hover:text-gold-300",
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(btn, "border-white/12 text-mist-300 enabled:hover:border-gold-400/60 enabled:hover:text-gold-300 disabled:opacity-30")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/* ------------------------------- Quantity -------------------------------- */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-8" : "h-11";
  return (
    <div className={cn("flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.03] p-1", h)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease"
        className="grid h-full aspect-square place-items-center rounded-full text-mist-300 transition-colors enabled:hover:bg-white/10 enabled:hover:text-mist-100 disabled:opacity-30"
      >
        <span className="h-px w-3 bg-current" />
      </button>
      <span className="w-8 text-center font-display text-base font-bold tabular-nums text-mist-100">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase"
        className="grid h-full aspect-square place-items-center rounded-full text-mist-300 transition-colors enabled:hover:bg-white/10 enabled:hover:text-mist-100 disabled:opacity-30"
      >
        <span className="relative block h-3 w-3">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current" />
        </span>
      </button>
    </div>
  );
}
