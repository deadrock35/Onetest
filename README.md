# OpenTickets

Premium, conversion-optimised ticketing platform for **opentickets.co.za** — South African concerts,
comedy, theatre and festivals, with reserved seating, a ZAR checkout and instant e-tickets.

Built with **React 19 + Vite 7 + Tailwind CSS v4** and TypeScript. Output is a single, self-contained
`dist/index.html` (via `vite-plugin-singlefile`), so it deploys to any static host.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the production build locally
```

Requires Node.js 20+ (Vite 7).

---

## Deploy to Vercel

The repository already contains everything Vercel needs (`vercel.json`). No environment variables or
server functions are required.

### Option A — Git integration (recommended)

1. Push this repository to GitHub / GitLab / Bitbucket.
2. In Vercel: **Add New → Project → Import** the repository.
3. Vercel auto-detects **Vite**. Confirm:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. **Deploy**. Every push to the production branch redeploys; pull requests get preview URLs.
5. Add the domain: **Project → Settings → Domains → opentickets.co.za** (and `www`), then point the
   DNS records Vercel provides. HTTPS is issued automatically.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel            # preview deployment
vercel --prod     # production deployment
```

### What `vercel.json` configures

| Setting | Purpose |
| --- | --- |
| `buildCommand` / `outputDirectory` | `npm run build` → `dist` |
| `rewrites` | Serves `index.html` for unknown paths (SPA fallback) |
| `cleanUrls`, `trailingSlash` | Canonical, extension-free URLs |
| `headers` | HSTS, `nosniff`, frame protection, referrer + permissions policy |
| Asset caching | Immutable caching for `og-image.jpg`, one week for the favicon |

### Routing note

The app uses **`HashRouter`** so every route survives a hard refresh on any static host without
server configuration (e.g. `/#/event/kabza-de-small-dj-maphorisa-piano-return`). The SPA rewrite is
already in place if you later switch to `BrowserRouter` for clean paths.

### Post-deploy checklist

- [ ] Replace the placeholder domain in `index.html` (`canonical`, `og:url`, `og:image`) and in
      `public/robots.txt` / `public/sitemap.xml` if the production domain differs.
- [ ] Upload a production `og-image.jpg` (1200×630) if you re-brand.
- [ ] Set the real payment gateway keys when wiring live payments (currently a fully interactive
      demo checkout — no card data leaves the browser).
- [ ] Connect analytics and a support inbox.

---

## Project structure

```
src/
├─ App.tsx                route table, global overlays, a11y skip-link
├─ index.css              Tailwind import + design tokens + component layer
├─ styles/theme.css       client retheming layer (4 palettes via data-theme)
├─ data/
│  ├─ events.ts           21 South African events, tiers, schedules, T&Cs
│  └─ faqs.ts             20 help-centre answers across 4 categories
├─ store/cart.tsx         cart context, localStorage persistence, fees/totals
├─ hooks/
│  ├─ useFlip.ts          FLIP layout animation for the Isotope-style grid
│  └─ useUi.ts            scroll, escape, scroll-lock, page titles
├─ components/            Header, Footer, Hero, EventCard, FilterGrid,
│                         SeatMap, TicketStub, CartDrawer, SearchOverlay,
│                         ThemeSwitcher, ui primitives
└─ pages/                 Home, Events, EventDetail, FAQs, Checkout, Account
```

### Routes

| Route | Screen |
| --- | --- |
| `/` | Home — hero carousel, ticker, categories, discovery grid (8/page + pagination) |
| `/events` | Full listing with advanced filters, sort, grid/list views |
| `/search` | Search results (same filter engine, keyword-led) |
| `/event/:slug` | Event detail, tabs, house plan + sticky booking card |
| `/faqs` | Searchable help centre |
| `/checkout` | Three-step checkout → confirmation with ticket stubs |
| `/account` | Ticket wallet, order history, profile |

---

## Theming

All colours, typography, radii and shadows are CSS custom properties declared in `src/index.css`
under `@theme`. To re-skin for a client:

1. Edit the accent ramp in `src/styles/theme.css`, or
2. Set `document.documentElement.dataset.theme = "ember" | "iris" | "karoo"`.

The footer contains a live theme switcher that persists the choice in `localStorage`.

## Commerce notes

- Currency formatting uses `Intl`-style ZAR grouping via `src/lib/format.ts` (`R1 250.00`).
- A flat **R35.00** booking fee applies per order (not per ticket).
- Promo codes in the demo checkout: `OPEN10` (10% off) and `WELCOME50` (R50 off).
- Cart contents persist in `localStorage`; checkout validates card formatting client-side only.

## Accessibility

Keyboard-operable overlays and seat map controls, visible focus rings, `aria-current` pagination,
skip-to-content link, `prefers-reduced-motion` support, and labelled form fields throughout.
