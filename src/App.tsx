import { Component, useEffect, useState, type ReactNode } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUp, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { CartProvider } from "@/store/cart";
import { usePageTitle, useScrollY } from "@/hooks/useUi";
import Home from "@/pages/Home";
import { EventsPage, SearchPage } from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Faqs from "@/pages/FAQs";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import { cn } from "@/utils/cn";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function BackToTop() {
  const y = useScrollY();
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-6 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-ink-850/90 text-mist-300 shadow-lift backdrop-blur-xl transition-all duration-400 hover:border-gold-400/60 hover:text-gold-300",
        y > 700 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <span className="font-display text-[7rem] font-extrabold leading-none text-ink-700">404</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold">This page sold out</h1>
      <p className="mt-3 max-w-md text-sm text-mist-400">
        The link you followed doesn't exist. Head back to the calendar and find something worth going to.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/events" className="btn btn-gold h-12 px-6 text-sm">
          Browse events <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/faqs" className="btn btn-ghost h-12 px-6 text-sm">
          Help centre
        </Link>
      </div>
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink-950">
      {/* Ambient layers */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-ink-950" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(227,192,126,0.07),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(90%_100%_at_20%_100%,rgba(143,168,255,0.05),transparent_60%)]" />
        <div className="dotgrid absolute inset-0 opacity-[0.22]" />
      </div>

      <ScrollToTop />
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main");
          main?.focus();
          main?.scrollIntoView({ block: "start" });
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink-900"
      >
        Skip to content
      </a>
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <main id="main" tabIndex={-1} key={location.pathname} className="animate-rise outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/event/:slug" element={<EventDetail />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BackToTop />

      {/* Floating search FAB on mobile */}
      <button
        onClick={() => setSearchOpen(true)}
        aria-label="Search events"
        className="fixed bottom-6 left-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900 shadow-gold transition-transform hover:scale-105 md:hidden"
      >
        <Search className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

/** Production safety net — keeps a runtime failure from white-screening the platform. */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[OpenTickets] Unhandled render error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-400/35 bg-gold-400/10 font-display text-xl font-extrabold text-gold-300">
            OT
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-mist-100">Something went off-script</h1>
          <p className="mt-3 text-sm leading-relaxed text-mist-400">
            We hit an unexpected error loading this page. Your cart is saved in this browser — reload to pick up
            where you left off, or call our team on 011 024 5678.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-gold mt-6 h-11 px-6 text-sm"
          >
            Reload the page
          </button>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </CartProvider>
    </ErrorBoundary>
  );
}
