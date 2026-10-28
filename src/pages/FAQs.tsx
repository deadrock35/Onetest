import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Headphones, LifeBuoy, Mail, MessageCircle, Phone, Search, Sparkles, X } from "lucide-react";
import { FAQS, FAQ_CATEGORIES, type FaqCategory } from "@/data/faqs";
import { Accordion, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { usePageTitle } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

const POPULAR = ["refund", "e-ticket", "parking", "seat map", "payment", "transfer", "cancelled"];

type Filter = "all" | FaqCategory;

function Highlight({ text, term }: { text: string; term: string }) {
  if (!term.trim()) return <>{text}</>;
  const safe = term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.trim().toLowerCase() ? (
          <mark key={i} className="rounded bg-gold-400/25 px-0.5 text-gold-200">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function Faqs() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const category = (params.get("category") as Filter) ?? "all";
  usePageTitle(query ? `Help: ${query}` : "Help centre");

  const setCategory = (c: Filter) => {
    const next = new URLSearchParams(params);
    if (c === "all") next.delete("category");
    else next.set("category", c);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (category !== "all" && f.category !== category) return false;
      if (!needle) return true;
      return `${f.q} ${f.a} ${(f.tags ?? []).join(" ")}`.toLowerCase().includes(needle);
    });
  }, [query, category]);

  const grouped = useMemo(
    () =>
      FAQ_CATEGORIES.filter((c) => category === "all" || category === c.id)
        .map((c) => ({ ...c, items: results.filter((f) => f.category === c.id) }))
        .filter((g) => g.items.length > 0),
    [results, category],
  );

  return (
    <div className="relative pt-[calc(var(--header-h)+1.5rem)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(80%_60%_at_15%_0%,rgba(143,168,255,0.10),transparent_60%),radial-gradient(70%_50%_at_90%_5%,rgba(227,192,126,0.10),transparent_60%)]" />

      {/* Head */}
      <div className="shell relative border-b border-white/8 pb-10 pt-8">
        <nav className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist-600">
          <Link to="/" className="hover:text-gold-300">Home</Link>
          <span>/</span>
          <span className="text-mist-400">Help centre</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <span className="eyebrow flex items-center gap-2">
              <span className="h-px w-8 bg-gold-400/60" /> Support · 07:00 – 23:00 daily
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[0.98]">
              Answers, not
              <span className="text-gold-300"> hold music.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist-400 md:text-base">
              {FAQS.length} questions across ticketing, venue access, payments and everything else. Start typing —
              answers filter instantly.
            </p>
          </div>

          <div>
            {/* The icon's positioning context is the input only — the popular
                chips row lives outside this wrapper so nothing can shift it. */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-gold-400">
                <Search className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                spellCheck={false}
                placeholder="Search the help centre…"
                aria-label="Search frequently asked questions"
                aria-controls="faq-results"
                className="h-14 w-full appearance-none rounded-full border border-white/12 bg-white/[0.04] pl-12 pr-14 text-sm text-mist-100 shadow-rest backdrop-blur-md transition-colors placeholder:text-mist-600 hover:border-white/20 focus:border-gold-400/70 focus:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-gold-400/10 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-1.5 z-10 grid w-11 place-items-center rounded-full text-mist-400 transition-colors hover:text-coral-300"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                    <X className="h-3.5 w-3.5" />
                  </span>
                </button>
              ) : (
                <span className="pointer-events-none absolute inset-y-0 right-4 z-10 hidden items-center font-mono text-[0.62rem] uppercase tracking-wider text-mist-600 sm:flex">
                  {FAQS.length} answers
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-mist-600">Popular</span>
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => setQuery(query.toLowerCase() === p ? "" : p)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider transition-colors",
                    query.toLowerCase() === p
                      ? "border-gold-400/60 bg-gold-400/12 text-gold-200"
                      : "border-white/10 text-mist-500 hover:border-white/25 hover:text-mist-200",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          {/* Category tabs */}
          <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1">
            <button data-active={category === "all"} onClick={() => setCategory("all")} className="chip shrink-0">
              All topics
              <span className={cn("font-mono text-[0.6rem] tabular-nums", category === "all" ? "text-ink-900/70" : "text-mist-500")}>
                {FAQS.length}
              </span>
            </button>
            {FAQ_CATEGORIES.map((c) => (
              <button
                key={c.id}
                data-active={category === c.id}
                onClick={() => setCategory(c.id)}
                className="chip shrink-0"
              >
                {c.label}
                <span className={cn("font-mono text-[0.6rem] tabular-nums", category === c.id ? "text-ink-900/70" : "text-mist-500")}>
                  {FAQS.filter((f) => f.category === c.id).length}
                </span>
              </button>
            ))}
          </div>

          <p
            id="faq-results"
            role="status"
            aria-live="polite"
            className="mt-5 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-mist-600"
          >
            {results.length} {results.length === 1 ? "answer" : "answers"}
            {query && <> for “{query}”</>}
            {category !== "all" && <> in {FAQ_CATEGORIES.find((c) => c.id === category)?.label}</>}
          </p>

          {grouped.length === 0 ? (
            <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-white/12 bg-white/[0.02] p-12 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 text-mist-500">
                <LifeBuoy className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-mist-100">We couldn't find that one</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-mist-400">
                No answer matches “{query}”. Our support team replies to email within two hours during opening hours —
                or call us and speak to a human in South Africa.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a href="mailto:support@opentickets.co.za" className="btn btn-gold h-11 px-6 text-sm">
                  <Mail className="h-4 w-4" /> Email support
                </a>
                <button onClick={() => { setQuery(""); setCategory("all"); }} className="btn btn-ghost h-11 px-6 text-sm">
                  Reset search
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-12">
              {grouped.map((group, gi) => (
                <Reveal key={group.id} delay={gi * 60}>
                  <section>
                    <SectionHeading
                      eyebrow={group.label}
                      title={group.blurb}
                      className="gap-2 flex-col items-start md:flex-col md:items-start md:text-left"
                    />
                    <div className="mt-5">
                      <Accordion
                        items={group.items.map((f) => ({
                          q: <Highlight text={f.q} term={query} />,
                          a: <Highlight text={f.a} term={query} />,
                        }))}
                      />
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h-sm)+1.5rem)] lg:self-start">
          <div className="glass overflow-hidden rounded-[var(--radius-card)] p-5 shadow-lift">
            <span className="eyebrow">Still stuck?</span>
            <h3 className="mt-3 font-display text-xl font-extrabold text-mist-100">Talk to a human</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">
              Our Cape Town support desk answers in under two hours during opening times.
            </p>
            <div className="mt-5 space-y-2">
              {[
                { icon: Phone, label: "011 024 5678", sub: "Mon–Sun, 07:00 – 23:00", href: "tel:+27110245678" },
                { icon: Mail, label: "support@opentickets.co.za", sub: "Replies within 2 hours", href: "mailto:support@opentickets.co.za" },
                { icon: MessageCircle, label: "WhatsApp 082 555 0134", sub: "Tickets & transfers only", href: "https://wa.me/27825550134" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3 transition-all hover:border-gold-400/40 hover:bg-gold-400/[0.06]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-400/12 text-gold-300">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-mist-100">{c.label}</span>
                    <span className="block font-mono text-[0.58rem] uppercase tracking-wider text-mist-500">{c.sub}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-mist-600 transition-transform group-hover:translate-x-1 group-hover:text-gold-300" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[var(--radius-card)] border border-white/8 bg-white/[0.02] p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-iris-400/12 text-iris-400">
              <Headphones className="h-4.5 w-4.5" />
            </span>
            <h4 className="mt-4 font-display text-lg font-bold text-mist-100">At the gate tonight?</h4>
            <p className="mt-2 text-sm text-mist-400">
              Venue-day hotline runs from 15:00 until the last gate closes. Have your order reference ready.
            </p>
            <a href="tel:+27820001234" className="btn btn-ghost mt-4 h-11 w-full text-sm">
              <Sparkles className="h-4 w-4" /> 082 000 1234
            </a>
          </div>

          <div className="mt-4 rounded-[var(--radius-card)] border border-gold-400/20 bg-gold-400/[0.05] p-5">
            <h4 className="font-display text-lg font-bold text-gold-200">Running an event?</h4>
            <p className="mt-2 text-sm text-mist-400">
              List on OpenTickets and settle your ticket revenue the next business day.
            </p>
            <Link to="/faqs?category=general" className="btn btn-gold mt-4 h-11 w-full text-sm">
              Organiser info
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
