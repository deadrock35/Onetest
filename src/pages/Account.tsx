import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Crown, Download, Share2, Ticket, User } from "lucide-react";
import { TicketStub, type StubData } from "@/components/TicketStub";
import { EVENTS } from "@/data/events";
import { zar } from "@/lib/format";
import { Tabs } from "@/components/ui";
import { useCart } from "@/store/cart";
import { usePageTitle } from "@/hooks/useUi";
import { cn } from "@/utils/cn";

const bySlug = Object.fromEntries(EVENTS.map((e) => [e.slug, e]));

const UPCOMING: StubData[] = [
  {
    key: "stub-1",
    title: bySlug["kabza-de-small-dj-maphorisa-piano-return"].title,
    image: bySlug["kabza-de-small-dj-maphorisa-piano-return"].image,
    date: "2026-03-14",
    venue: "Sun Arena",
    city: "Pretoria",
    tier: "VIP Deck",
    doors: "17:00",
    qty: 2,
    price: 950,
    reference: "OT-K4X92B-1",
    status: "valid",
  },
  {
    key: "stub-2",
    title: bySlug["appel-soos-net-hy-kan-kunstekaap"].title,
    image: bySlug["appel-soos-net-hy-kan-kunstekaap"].image,
    date: "2026-04-25",
    venue: "Kunstekaap — Piers Park Theatre",
    city: "Pretoria",
    tier: "Stalletjies (Rye D–J)",
    doors: "18:00",
    seats: ["F11", "F12"],
    qty: 2,
    price: 420,
    reference: "OT-P2M77Q-2",
    status: "valid",
  },
  {
    key: "stub-3",
    title: bySlug["rocking-the-daisies-2026"].title,
    image: bySlug["rocking-the-daisies-2026"].image,
    date: "2026-10-02",
    venue: "Cloof Wine Estate",
    city: "Cape Town",
    tier: "Weekend GA + Camping",
    doors: "10:00",
    qty: 4,
    price: 1690,
    reference: "OT-R8T21L-3",
    status: "pending",
  },
];

const PAST: StubData[] = [
  {
    key: "stub-p1",
    title: "Ard Matthews: Live at the Baxter",
    image: bySlug["loyiso-gola-unlearning-the-baxter"].image,
    date: "2025-11-08",
    venue: "Baxter Theatre Centre",
    city: "Cape Town",
    tier: "Standard Seat",
    qty: 2,
    price: 220,
    reference: "OT-B5N10K-1",
    status: "used",
  },
  {
    key: "stub-p2",
    title: "Ultra South Africa 2025",
    image: bySlug["ultra-south-africa-2026"].image,
    date: "2025-02-14",
    venue: "Nasrec Expo Centre",
    city: "Johannesburg",
    tier: "VIP",
    qty: 3,
    price: 1450,
    reference: "OT-U9C44Z-2",
    status: "used",
  },
];

export default function Account() {
  const [tab, setTab] = useState<"upcoming" | "past" | "profile">("upcoming");
  const [toast, setToast] = useState("");
  const { count } = useCart();
  usePageTitle("My account");

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  };

  const list = tab === "past" ? PAST : UPCOMING;
  const value = tab === "past" ? PAST : UPCOMING;
  const totalValue = value.reduce((s, t) => s + t.price * t.qty, 0);

  return (
    <div className="pt-[calc(var(--header-h)+1.5rem)]">
      <div className="shell border-b border-white/8 pb-8 pt-6">
        <nav className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist-600">
          <Link to="/" className="hover:text-gold-300">Home</Link>
          <span>/</span>
          <span className="text-mist-400">My account</span>
        </nav>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-gold-200 to-gold-600 font-display text-xl font-extrabold text-ink-900">
              TM
              <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full border border-ink-900 bg-ink-850 text-gold-300">
                <Crown className="h-3 w-3" />
              </span>
            </span>
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">Thabo Mokoena</h1>
              <p className="mt-1.5 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-mist-500">
                Gold member since 2019 · thabo@opentickets.co.za
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { k: "Tickets held", v: String(list.reduce((s, t) => s + t.qty, 0)) },
              { k: "Events attended", v: "27" },
              { k: "Wallet value", v: zar(totalValue) },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                <span className="block font-mono text-[0.56rem] uppercase tracking-[0.18em] text-mist-600">{s.k}</span>
                <span className="mt-1 block font-display text-lg font-extrabold text-mist-100">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shell py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: "upcoming", label: "Upcoming", icon: <Ticket className="h-3.5 w-3.5" /> },
              { id: "past", label: "Past events", icon: <Check className="h-3.5 w-3.5" /> },
              { id: "profile", label: "Profile", icon: <User className="h-3.5 w-3.5" /> },
            ]}
            active={tab}
            onChange={setTab}
          />
          {count > 0 && tab === "upcoming" && (
            <Link to="/checkout" className="btn btn-ghost h-10 px-4 text-sm">
              {count} unpaid in cart <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {tab !== "profile" ? (
          <div className="mt-8 space-y-4">
            {list.map((stub) => (
              <div key={stub.key} className="relative">
                <TicketStub stub={stub} />
                {stub.status === "valid" && (
                  <div className="mt-2 flex flex-wrap gap-2 sm:absolute sm:-top-3 sm:right-4 sm:mt-0">
                    <button
                      onClick={() => notify(`Transfer link sent for ${stub.title}`)}
                      className="btn btn-ghost h-9 px-4 text-xs"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Transfer
                    </button>
                    <button onClick={() => notify("Ticket PDF downloaded")} className="btn btn-ghost h-9 px-4 text-xs">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-white/8 bg-ink-850/60 p-6">
              <h3 className="font-display text-xl font-extrabold text-mist-100">Profile</h3>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Full name", "Thabo Mokoena"],
                  ["Email", "thabo@opentickets.co.za"],
                  ["Mobile", "082 555 0134"],
                  ["ID number", "••••••••••891"],
                  ["Home city", "Johannesburg"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                    <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mist-600">{k}</dt>
                    <dd className="text-mist-200">{v}</dd>
                  </div>
                ))}
              </dl>
              <button onClick={() => notify("Profile saved")} className="btn btn-gold mt-6 h-11 px-5 text-sm">
                Save changes
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-[var(--radius-card)] border border-white/8 bg-ink-850/60 p-6">
                <h3 className="font-display text-xl font-extrabold text-mist-100">Saved cards</h3>
                <div className="mt-4 space-y-2.5">
                  {[
                    { brand: "Visa", last: "4291", exp: "08/28", primary: true },
                    { brand: "Mastercard", last: "8830", exp: "02/27", primary: false },
                  ].map((c) => (
                    <div
                      key={c.last}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
                    >
                      <span className="rounded-md border border-white/12 bg-ink-950 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-mist-300">
                        {c.brand}
                      </span>
                      <span className="font-mono text-sm tracking-wider text-mist-300">•••• {c.last}</span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-mist-600">exp {c.exp}</span>
                      {c.primary && (
                        <span className="ml-auto rounded-full bg-gold-400/12 px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-wider text-gold-300">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[var(--radius-card)] border border-gold-400/20 bg-gold-400/[0.05] p-6">
                <span className="eyebrow">Gold member perks</span>
                <ul className="mt-4 space-y-2.5 text-sm text-mist-300">
                  {[
                    "48-hour pre-sale access on partner events",
                    "Zero booking fees on orders over R1 000",
                    "Priority transfer approvals",
                    "Two free companion upgrades a year",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-jade-400/35 bg-ink-850/95 px-5 py-3 text-sm text-mist-100 shadow-lift backdrop-blur-xl transition-all duration-400",
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4 text-jade-400" /> {toast}
        </span>
      </div>
    </div>
  );
}
