/** Pexels CDN helper — keeps the catalogue compact and lets us request hero-sized crops. */
export const px = (id: number, w = 1200, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export type Category = "music" | "comedy" | "theatre" | "festivals";

export const CATEGORIES: { id: Category; label: string; accent: string }[] = [
  { id: "music", label: "Music", accent: "#e3c07e" },
  { id: "comedy", label: "Comedy", accent: "#ff8264" },
  { id: "theatre", label: "Theatre", accent: "#8fa8ff" },
  { id: "festivals", label: "Festivals", accent: "#4fd6a8" },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  music: "Music",
  comedy: "Comedy",
  theatre: "Theatre",
  festivals: "Festivals",
};

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  remaining: number;
  perks: string[];
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  capacity: number;
  note: string;
  lat?: number;
  lng?: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  artist: string;
  category: Category;
  tags: string[];
  date: string; // ISO
  endDate?: string;
  doors: string;
  start: string;
  end: string;
  venue: Venue;
  image: string;
  poster: string;
  gallery: string[];
  priceFrom: number;
  tiers: TicketTier[];
  blurb: string;
  description: string[];
  lineup: { name: string; role: string }[];
  schedule: { time: string; title: string; detail: string }[];
  terms: string[];
  faqs: { q: string; a: string }[];
  featured?: boolean;
  trending?: boolean;
  seated?: boolean;
  ageRestriction: string;
  soldPercent: number;
  rating: number;
  organiser: string;
}

const baseTerms = (age: string) => [
  `All tickets are sold subject to OpenTickets' booking terms. A ${zar0(35)} booking fee applies per transaction.`,
  `Ticket holders must present a valid, government-issued photo ID at the venue gate. ${age}`,
  "Tickets are delivered as mobile e-tickets 48 hours before doors open. Print-at-home PDFs are available on request.",
  "No refunds, exchanges or name transfers after checkout, except where an event is officially cancelled or postponed.",
  "Professional cameras, drones, glass containers and re-entry are prohibited unless stated otherwise.",
];

const baseFaqs = (e: { venue: string; city: string; doors: string; age: string }) => [
  {
    q: `How early should I arrive at ${e.venue}?`,
    a: `Doors open at ${e.doors}. We recommend arriving at least 45 minutes early — security screening and barcode validation at ${e.city} venues can queue during peak arrival windows.`,
  },
  {
    q: "When will my tickets appear in my account?",
    a: "E-tickets are released to your OpenTickets wallet 48 hours before doors open. You will receive an SMS and email with a deep link the moment they go live.",
  },
  {
    q: "What is the age policy?",
    a: e.age,
  },
  {
    q: "Can I transfer a ticket to a friend?",
    a: "Yes — transfers open 7 days before the event. Go to My Tickets, select the ticket and choose 'Transfer'. The recipient needs a free OpenTickets account and a South African mobile number.",
  },
];

function zar0(n: number) {
  return `R${n.toFixed(2)}`;
}

interface Seed extends Omit<EventItem, "terms" | "faqs" | "lineup" | "schedule"> {
  lineup?: { name: string; role: string }[];
  schedule?: { time: string; title: string; detail: string }[];
  extraTerms?: string[];
  extraFaqs?: { q: string; a: string }[];
}

function build(seed: Seed): EventItem {
  const age = seed.ageRestriction;
  return {
    ...seed,
    lineup: seed.lineup ?? [],
    schedule: seed.schedule ?? [
      { time: seed.doors, title: "Doors open", detail: "Gates, bars and merchandise stalls open" },
      { time: seed.start, title: "Showtime", detail: `${seed.artist} takes the stage` },
      { time: seed.end, title: "Curtain", detail: "Event ends — please exit via the marked gates" },
    ],
    terms: [...baseTerms(age), ...(seed.extraTerms ?? [])],
    faqs: [
      ...baseFaqs({ venue: seed.venue.name, city: seed.venue.city, doors: seed.doors, age }),
      ...(seed.extraFaqs ?? []),
    ],
  };
}

export const EVENTS: EventItem[] = [
  /* ------------------------------- MUSIC ------------------------------- */
  build({
    id: "ev-101",
    slug: "kabza-de-small-dj-maphorisa-piano-return",
    title: "Kabza De Small & DJ Maphorisa: Piano Return",
    artist: "Kabza De Small & DJ Maphorisa",
    category: "music",
    tags: ["Amapiano", "Live DJ Set", "Premium"],
    date: "2026-03-14",
    doors: "17:00",
    start: "19:00",
    end: "01:00",
    venue: {
      name: "Sun Arena",
      address: "245 Maude St, Menlyn, Pretoria",
      city: "Pretoria",
      capacity: 12000,
      note: "Undercover arena with 3 concourse bars and dedicated VIP entrance on Maude Street.",
      lat: -25.7823,
      lng: 28.2756,
    },
    image: px(761543),
    poster: px(761543, 900, 1200),
    gallery: [px(761543, 1600, 900), px(7258865, 1200, 800), px(5268174, 1200, 800)],
    priceFrom: 450,
    tiers: [
      { id: "t1", name: "General Access", price: 450, description: "Standing access to the main floor", remaining: 312, perks: ["Main floor access", "Concourse bars"] },
      { id: "t2", name: "VIP Deck", price: 950, description: "Raised deck, private bar and restrooms", remaining: 64, perks: ["Private bar", "Fast-track lane", "Dedicated restrooms"] },
      { id: "t3", name: "Platinum Table (4)", price: 4800, description: "Table for four with bottle service", remaining: 6, perks: ["Reserved table", "Bottle service", "Hostess", "Parking bay"] },
    ],
    blurb: "The kings of amapiano bring the Piano Return tour to Menlyn for one night only — log drum, live vocals and a 12 000-cap arena.",
    description: [
      "After selling out three consecutive nights in 2025, Kabza De Small and DJ Maphorisa return to the Sun Arena with the full Piano Return production: a 40-metre stage, live percussion, guest vocalists and the deepest log-drum mix ever programmed for a South African arena.",
      "Expect a five-hour journey through the amapiano catalogue — from the early Bacardi-era cuts to the chart-topping collaborations — with special guests announced on the night. VIP and Platinum ticket holders get access to the pre-show lounge from 16:00.",
      "This is a standing event with a raised VIP deck and limited Platinum tables. Tables are sold per four guests and include a bottle of your choice plus mixers.",
    ],
    lineup: [
      { name: "Kabza De Small", role: "Headliner / DJ set" },
      { name: "DJ Maphorisa", role: "Headliner / DJ set" },
      { name: "Mpura", role: "Special guest" },
      { name: "Babes Wodumo", role: "Special guest" },
      { name: "Mawhoo", role: "Warm-up" },
    ],
    schedule: [
      { time: "16:00", title: "Platinum & VIP lounge", detail: "Pre-show lounge opens for premium ticket holders" },
      { time: "17:00", title: "Doors open", detail: "General access gates open, bars and merch trading" },
      { time: "18:15", title: "Mawhoo", detail: "Warm-up set on the main floor" },
      { time: "19:00", title: "Kabza De Small & DJ Maphorisa", detail: "Piano Return arena set" },
      { time: "23:30", title: "Guest appearances", detail: "Surprise collaborations" },
      { time: "01:00", title: "Event ends", detail: "Safe-travel shuttles depart for Hatfield & Menlyn CBD" },
    ],
    extraTerms: ["Platinum tables are sold per table of four guests and cannot be split."],
    extraFaqs: [
      { q: "Is parking available at Sun Arena?", a: "Yes — Menlyn Maine offers 4 500 bays. Pre-book parking during checkout for R80.00 and skip the queue on the night." },
      { q: "Are the Platinum tables really for four people?", a: "Correct. One Platinum purchase admits four guests and includes a bottle plus mixers. Additional guests need General Access tickets." },
    ],
    featured: true,
    trending: true,
    seated: false,
    ageRestriction: "Strictly no under-18s without a parent or legal guardian. ID checked at the gate.",
    soldPercent: 84,
    rating: 4.9,
    organiser: "Piano 251 Live",
  }),

  build({
    id: "ev-102",
    slug: "cassper-nyovest-fill-up-fnb-stadium",
    title: "Cassper Nyovest: Fill Up FNB Stadium",
    artist: "Cassper Nyovest",
    category: "music",
    tags: ["Hip Hop", "Stadium", "Family Friendly"],
    date: "2026-03-21",
    doors: "13:00",
    start: "15:00",
    end: "22:00",
    venue: {
      name: "FNB Stadium",
      address: "Cnr Chris Hani Rd & Rand Leases Rd, Nasrec, Johannesburg",
      city: "Johannesburg",
      capacity: 94736,
      note: "Africa's largest stadium. Gautrain Rosebank → shuttle service available on event day.",
      lat: -26.2341,
      lng: 27.9826,
    },
    image: px(17718209),
    poster: px(17718209, 900, 1200),
    gallery: [px(17718209, 1600, 900), px(4662303, 1200, 800), px(18482996, 1200, 800)],
    priceFrom: 250,
    tiers: [
      { id: "t1", name: "Grass Embankment", price: 250, description: "Unreserved seating on the embankment", remaining: 8420, perks: ["Full stadium view", "Picnic allowed"] },
      { id: "t2", name: "General Floor", price: 490, description: "Standing on the pitch level", remaining: 2140, perks: ["Closest to stage", "Floor bars"] },
      { id: "t3", name: "Level 1 Reserved", price: 750, description: "Reserved stadium seat with backrest", remaining: 380, perks: ["Reserved seat", "Covered stand"] },
      { id: "t4", name: "Solomon's Lounge", price: 2200, description: "Premium hospitality with catering", remaining: 22, perks: ["Full catering", "Open bar", "Meet & greet raffle"] },
    ],
    blurb: "Fill Up returns bigger than ever — a full stadium production with a 40-piece orchestra, guest artists and a career-spanning setlist.",
    description: [
      "Cassper Nyovest's Fill Up franchise has become the benchmark for South African live hip hop. For the 2026 edition at FNB Stadium, the production adds a live 40-piece orchestra, a rotating B-stage in the middle of the pitch and a pyrotechnic finale visible from Nasrec.",
      "Gates open at 13:00 with a full family-friendly festival village on the concourse: food trucks from Maboneng, a kids' zone, live breakdancing battles and a sneaker market. Under-12s enter free with a paying adult on the Grass Embankment.",
      "Ticket holders are encouraged to use the Park & Ride from Nasrec Expo Centre (R60 per vehicle) or the Gautrain shuttle from Rosebank.",
    ],
    lineup: [
      { name: "Cassper Nyovest", role: "Headliner" },
      { name: "Abigail Kubheka", role: "National anthem" },
      { name: "Kwesta", role: "Special guest" },
      { name: "Boity", role: "Special guest" },
      { name: "Johannesburg Youth Orchestra", role: "Live orchestra" },
    ],
    schedule: [
      { time: "13:00", title: "Festival village opens", detail: "Food trucks, kids' zone and sneaker market" },
      { time: "14:00", title: "Dance battle finals", detail: "Concourse stage, hosted by Lasizwe" },
      { time: "15:00", title: "Support sets", detail: "Boity, Kwesta and emerging Soweto artists" },
      { time: "17:30", title: "Cassper Nyovest", detail: "Fill Up stadium set with live orchestra" },
      { time: "20:30", title: "Pyrotechnic finale", detail: "Stadium-wide fireworks and light show" },
      { time: "22:00", title: "Event ends", detail: "Shuttles run until 23:30" },
    ],
    extraTerms: ["Under-12s enter free on the Grass Embankment with a paying adult (max two per adult)."],
    extraFaqs: [
      { q: "Where should I park at FNB Stadium?", a: "Pre-book the Nasrec Park & Ride for R60.00 per vehicle during checkout, or use the Gautrain shuttle from Rosebank (R45.00 return)." },
      { q: "Can I bring a picnic blanket?", a: "Yes, on the Grass Embankment only. No glass, no gazebos and no hard-sided coolers anywhere in the stadium." },
    ],
    featured: true,
    trending: true,
    seated: true,
    ageRestriction: "Family friendly. Under-12s free on the embankment with a paying adult.",
    soldPercent: 61,
    rating: 4.8,
    organiser: "Fill Up Productions",
  }),

  build({
    id: "ev-103",
    slug: "lira-soul-in-session-emperors-palace",
    title: "Lira: Soul in Session",
    artist: "Lira",
    category: "music",
    tags: ["Afro-Soul", "Live Band", "Seated"],
    date: "2026-04-10",
    doors: "19:00",
    start: "20:00",
    end: "22:15",
    venue: {
      name: "Theatre of Marcellus, Emperors Palace",
      address: "64 Jones Rd, Kempton Park, Gauteng",
      city: "Johannesburg",
      capacity: 1800,
      note: "Intimate 1 800-seat theatre with excellent sightlines from every row and free parking at Emperors Palace.",
      lat: -26.1815,
      lng: 28.2324,
    },
    image: px(9419405),
    poster: px(9419405, 900, 1200),
    gallery: [px(9419405, 1600, 900), px(359995, 1200, 800), px(26952977, 1200, 800)],
    priceFrom: 380,
    tiers: [
      { id: "t1", name: "Upper Tier", price: 380, description: "Reserved seat, balcony level", remaining: 210, perks: ["Reserved seat", "Cloakroom access"] },
      { id: "t2", name: "Stalls", price: 550, description: "Reserved seat, ground floor", remaining: 140, perks: ["Best sightlines", "Bar service in interval"] },
      { id: "t3", name: "Soul Circle (rows A–C)", price: 850, description: "Front rows with signed programme", remaining: 26, perks: ["Front 3 rows", "Signed programme", "Welcome drink"] },
    ],
    blurb: "Two hours of unfiltered afro-soul with a nine-piece band, strings and an intimate theatre setting at Emperors Palace.",
    description: [
      "Lira returns to the stage she calls home for Soul in Session — an unplugged-leaning, two-hour performance backed by a nine-piece band and a string quartet. The set moves from Phola-era classics to the newer material written during her recovery.",
      "The Theatre of Marcellus is one of Gauteng's best-sounding rooms, and this production has been mixed specifically for it. Expect a warm, cinematic sound and lighting design by the Cape Town City Ballet team.",
      "A signed programme is included with all Soul Circle tickets. Interval drinks can be pre-ordered at checkout to skip the queue.",
    ],
    lineup: [
      { name: "Lira", role: "Lead vocals" },
      { name: "Thato Sibane", role: "Musical director / keys" },
      { name: "The Soul Strings", role: "String quartet" },
    ],
    schedule: [
      { time: "19:00", title: "Doors & foyer bar", detail: "Cloakroom and foyer bar open" },
      { time: "20:00", title: "Act one", detail: "55 minutes with the nine-piece band" },
      { time: "21:00", title: "Interval", detail: "20 minutes — pre-ordered drinks collected at the bar" },
      { time: "21:20", title: "Act two", detail: "Strings join for the acoustic set" },
      { time: "22:15", title: "Curtain", detail: "Meet & greet for Soul Circle ticket holders" },
    ],
    seated: true,
    ageRestriction: "Suitable for all ages. Children under 6 not permitted in the auditorium.",
    soldPercent: 72,
    rating: 4.9,
    organiser: "Soul in Session Touring",
  }),

  build({
    id: "ev-104",
    slug: "francois-van-coke-alles-wat-ek-ken",
    title: "Francois van Coke: Alles Wat Ek Ken",
    artist: "Francois van Coke",
    category: "music",
    tags: ["Afrikaans", "Rock", "Live Band"],
    date: "2026-02-28",
    doors: "18:30",
    start: "20:00",
    end: "22:30",
    venue: {
      name: "Die Teater",
      address: "51 Mare Rd, Bellville, Cape Town",
      city: "Cape Town",
      capacity: 1200,
      note: "Modern 1 200-seat venue in the heart of Bellville, five minutes from the Tyger Valley hotel strip.",
      lat: -33.8683,
      lng: 18.6284,
    },
    image: px(2675648),
    poster: px(2675648, 900, 1200),
    gallery: [px(2675648, 1600, 900), px(2263436, 1200, 800), px(1494665, 1200, 800)],
    priceFrom: 320,
    tiers: [
      { id: "t1", name: "Staankaartjies", price: 320, description: "Staande toegang tot die vloer", remaining: 180, perks: ["Vloertoegang", "Naby die verhoog"] },
      { id: "t2", name: "Balkon Sitplek", price: 480, description: "Gereserveerde sitplek op die balkon", remaining: 74, perks: ["Gereserveerde sitplek", "Uitsig oor die verhoog"] },
      { id: "t3", name: "FVC Vriende-pakket", price: 950, description: "Sitplek voor + ontmoet en groet", remaining: 12, perks: ["Voorste 5 rye", "Ontmoet en groet", "Gesigneerde plakkate"] },
    ],
    blurb: "Twee dekades van Fokofpolisiekar, Van Coke Kartel en solo-treffers in een aande — live in Bellville.",
    description: [
      "Francois van Coke brings the Alles Wat Ek Ken tour to Die Teater in Bellville: two decades of Afrikaans rock condensed into one high-voltage evening, from Fokofpolisiekar's debut to the solo catalogue.",
      "The Bellville show is one of only six theatre dates on the tour, and the room's acoustics have been tuned for a full five-piece band plus a three-piece brass section on the Kartel medley.",
      "Support comes from a rising Afrikaans act announced closer to the date. Bar service runs throughout, with a dedicated craft-beer station sponsored by Darling Brew.",
    ],
    lineup: [
      { name: "Francois van Coke", role: "Hoofsanger" },
      { name: "Wynand Myburgh", role: "Baskitaar" },
      { name: "Jaco Griessel", role: "Klawers" },
    ],
    extraTerms: ["Afrikaanse terme is van krag; kaartjies is nie oordraagbaar nie."],
    extraFaqs: [
      { q: "Is daar parkering by Die Teater?", a: "Ja — gratis parkering in die Mare Road-terrein en in Bill Bezuidenhoutstraat. Kom vroeg, Bellville is Saterdag besig." },
      { q: "Word die vertoning opgeneem?", a: "Dele van die Bellville-aand word verfilm vir 'n lewendige album. Kaartjiehouers stem in tot opname." },
    ],
    trending: true,
    seated: true,
    ageRestriction: "Ouerskaplike leiding — 14 jaar en ouer sonder 'n volwassene.",
    soldPercent: 88,
    rating: 4.7,
    organiser: "Afrikaans Live",
  }),

  build({
    id: "ev-105",
    slug: "the-kiffness-aliekie-live-midrand",
    title: "The Kiffness: Aliekie Live",
    artist: "The Kiffness",
    category: "music",
    tags: ["Electro", "Comedy Crossover", "Viral"],
    date: "2026-03-07",
    doors: "18:00",
    start: "19:30",
    end: "22:00",
    venue: {
      name: "Hillberry Theatre",
      address: "23 Pretoria Rd, Glen Austin, Midrand",
      city: "Johannesburg",
      capacity: 700,
      note: "Boutique theatre and bistro in Glen Austin — small room, huge sound system, table seating available.",
      lat: -26.0201,
      lng: 28.1318,
    },
    image: px(29231542),
    poster: px(29231542, 900, 1200),
    gallery: [px(29231542, 1600, 900), px(7446874, 1200, 800), px(6942388, 1200, 800)],
    priceFrom: 350,
    tiers: [
      { id: "t1", name: "Standard Seat", price: 350, description: "Reserved theatre seat", remaining: 96, perks: ["Reserved seat", "Full show access"] },
      { id: "t2", name: "Bistro Table (2)", price: 890, description: "Table for two with grazing board", remaining: 18, perks: ["Front table", "Grazing board", "Welcome drink"] },
    ],
    blurb: "Live looping, satirical bangers and the remixes that broke the internet — in a 700-seat room.",
    description: [
      "David Scott, better known as The Kiffness, brings the Aliekie Live show to one of Gauteng's most intimate rooms. Everything you hear is built live on stage: looped vocals, bass, keys and the occasional sample of a very opinionated cat.",
      "The set blends the viral remix catalogue with new satirical material written for the 2026 tour, plus a Q&A segment where the audience is strongly encouraged to be unpredictable.",
      "Bistro tables include a grazing board for two and a welcome drink, served from 17:30.",
    ],
    lineup: [{ name: "David Scott", role: "Live looping / vocals / instruments" }],
    seated: true,
    ageRestriction: "16+. Strong language and adult satire throughout.",
    soldPercent: 91,
    rating: 4.8,
    organiser: "Kiff Live",
  }),

  build({
    id: "ev-106",
    slug: "the-soil-decade-of-harmony-gold-reef",
    title: "The Soil: A Decade of Harmony",
    artist: "The Soil",
    category: "music",
    tags: ["Afro-Jazz", "A Cappella", "Seated"],
    date: "2026-04-25",
    doors: "18:00",
    start: "19:30",
    end: "21:45",
    venue: {
      name: "The Lyric Theatre, Gold Reef City",
      address: "Cnr Northern Pkwy & Data Cres, Ormonde, Johannesburg",
      city: "Johannesburg",
      capacity: 1600,
      note: "Purpose-built lyric theatre inside Gold Reef City, with casino parking and five restaurants within walking distance.",
      lat: -26.2341,
      lng: 28.0136,
    },
    image: px(32297817),
    poster: px(32297817, 900, 1200),
    gallery: [px(32297817, 1600, 900), px(9002889, 1200, 800), px(3857365, 1200, 800)],
    priceFrom: 290,
    tiers: [
      { id: "t1", name: "Tier 2 Seat", price: 290, description: "Reserved upper seat", remaining: 320, perks: ["Reserved seat"] },
      { id: "t2", name: "Tier 1 Seat", price: 420, description: "Reserved mid-floor seat", remaining: 190, perks: ["Reserved seat", "Interval drinks voucher"] },
      { id: "t3", name: "Golden Circle", price: 640, description: "Front ten rows", remaining: 44, perks: ["Front 10 rows", "Commemorative poster", "Interval drinks voucher"] },
    ],
    blurb: "Ten years of kasi-flavoured jazz, three voices and one unforgettable night at the Lyric Theatre.",
    description: [
      "The Soil mark a decade together with a career retrospective at the Lyric Theatre — from their debut album to the collaborations that took them across four continents.",
      "The show is built around the trio's signature kasi-flavoured jazz sound, performed with a small rhythm section and a guest choir on the finale.",
      "Golden Circle tickets include a numbered commemorative poster, signed after the show.",
    ],
    lineup: [
      { name: "Ntsika Nxexa", role: "Vocals" },
      { name: "Buhle Mda", role: "Vocals" },
      { name: "Luphindo Mda", role: "Vocals / beatbox" },
    ],
    seated: true,
    ageRestriction: "All ages welcome. Every attendee, regardless of age, requires a ticket.",
    soldPercent: 54,
    rating: 4.8,
    organiser: "Lyric Live Series",
  }),

  build({
    id: "ev-107",
    slug: "msaki-acoustic-valentine-sessions",
    title: "Msaki: Acoustic Valentine Sessions",
    artist: "Msaki",
    category: "music",
    tags: ["Acoustic", "Afro-Folk", "Intimate"],
    date: "2026-02-14",
    doors: "18:00",
    start: "19:00",
    end: "21:30",
    venue: {
      name: "The Orbit Jazz Club",
      address: "81 De Korte St, Braamfontein, Johannesburg",
      city: "Johannesburg",
      capacity: 200,
      note: "A 200-seat jazz room in Braamfontein with table service, a listening-room sound system and a late kitchen.",
      lat: -26.1928,
      lng: 28.0327,
    },
    image: px(3857365),
    poster: px(3857365, 900, 1200),
    gallery: [px(3857365, 1600, 900), px(9002889, 1200, 800), px(359995, 1200, 800)],
    priceFrom: 220,
    tiers: [
      { id: "t1", name: "Counter Seat", price: 220, description: "Single seat at the bar counter", remaining: 16, perks: ["Bar counter seat", "Table service"] },
      { id: "t2", name: "Standard Table Seat", price: 280, description: "Reserved seat in the listening room", remaining: 42, perks: ["Reserved seat", "Table service", "Late kitchen"] },
      { id: "t3", name: "Valentine Table (2)", price: 780, description: "Table for two with a bottle of MCC", remaining: 8, perks: ["Reserved table for two", "Bottle of MCC", "Chocolate plate", "Signed setlist raffle"] },
    ],
    blurb: "Two hundred seats, one voice and a guitar — an acoustic Valentine's set in Braamfontein's best listening room.",
    description: [
      "Msaki strips the production back for two nights at The Orbit, playing an acoustic set that moves from Platoon-era material through the newer Afro-folk writing, with a cellist joining for the second half.",
      "The Orbit is a listening room: table service runs throughout, the kitchen serves until 22:30 and the room is kept deliberately quiet during the performance. Valentine Tables for two include a bottle of MCC and a chocolate plate.",
      "Only 200 seats exist per night, and the Saturday show traditionally sells out within a fortnight of going on sale.",
    ],
    lineup: [
      { name: "Msaki", role: "Vocals / guitar" },
      { name: "Thandi Ntuli", role: "Cello (second set)" },
    ],
    schedule: [
      { time: "18:00", title: "Doors & kitchen", detail: "Table service and the late kitchen open" },
      { time: "19:00", title: "First set", detail: "Solo acoustic — 50 minutes" },
      { time: "20:00", title: "Interval", detail: "30 minutes, bar and kitchen trading" },
      { time: "20:30", title: "Second set", detail: "Acoustic set with cello" },
      { time: "21:30", title: "Curtain", detail: "Bar trades until 23:00" },
    ],
    extraTerms: ["Valentine Tables admit two guests and include a bottle of MCC and a chocolate plate."],
    extraFaqs: [
      { q: "Where do I park in Braamfontein?", a: "The Orbit validates parking at the De Korte Street garage for R30.00, or use the Rea Vaya B7 to the Braamfontein station, a four-minute walk away." },
      { q: "Is the room seated or standing?", a: "Fully seated — this is a listening room. Every ticket includes a reserved seat or table." },
    ],
    seated: true,
    trending: true,
    ageRestriction: "18+ after 21:00. Under-18s welcome with a guardian before that.",
    soldPercent: 71,
    rating: 4.8,
    organiser: "The Orbit Live",
  }),

  /* ------------------------------- COMEDY ------------------------------- */
  build({
    id: "ev-201",
    slug: "trevor-noah-where-was-i-grandwest",
    title: "Trevor Noah: Where Was I — Global Tour",
    artist: "Trevor Noah",
    category: "comedy",
    tags: ["Stand-Up", "International", "Seated"],
    date: "2026-04-04",
    doors: "18:00",
    start: "20:00",
    end: "22:00",
    venue: {
      name: "Grand Arena, GrandWest",
      address: "1 Vanguard Dr, Goodwood, Cape Town",
      city: "Cape Town",
      capacity: 7000,
      note: "The largest indoor arena in the Western Cape, with 4 000 free parking bays and a casino precinct next door.",
      lat: -33.8938,
      lng: 18.5648,
    },
    image: px(10078868),
    poster: px(10078868, 900, 1200),
    gallery: [px(10078868, 1600, 900), px(9547593, 1200, 800), px(10012375, 1200, 800)],
    priceFrom: 550,
    tiers: [
      { id: "t1", name: "Upper Reserved", price: 550, description: "Reserved seat, upper tier", remaining: 940, perks: ["Reserved seat", "Covered tier"] },
      { id: "t2", name: "Stalls Reserved", price: 890, description: "Reserved seat, floor level", remaining: 610, perks: ["Reserved seat", "Floor-level bars"] },
      { id: "t3", name: "Premium Front", price: 1450, description: "Rows 1–10 with dedicated entrance", remaining: 88, perks: ["Front 10 rows", "Dedicated entrance", "Complimentary drink"] },
      { id: "t4", name: "VIP Box (8 guests)", price: 12000, description: "Private box with catering", remaining: 3, perks: ["Private box", "Full catering", "Reserved parking"] },
    ],
    blurb: "The South African homecoming stop of a sold-out world tour — two hours of storytelling at the Grand Arena.",
    description: [
      "Trevor Noah returns to Cape Town with Where Was I, the two-hour special that has sold out arenas across four continents. It is his first South African arena run since 2019 and the only Cape Town date on the tour.",
      "The GrandWest production uses a 360-degree stage so no seat is more than 40 metres from the microphone. Two large screen wings run live close-ups throughout.",
      "Demand is extremely high. Tickets are limited to six per person per session and ID checks apply at the gate to deter resale.",
    ],
    lineup: [{ name: "Trevor Noah", role: "Headliner" }, { name: "Loyiso Madinga", role: "Support" }],
    extraTerms: ["Maximum six tickets per person. Tickets are ID-matched at the gate."],
    extraFaqs: [
      { q: "Is the show filmed?", a: "No professional recording is permitted. Phone use is locked in Yondr pouches for the duration of the performance." },
      { q: "How many tickets may I buy?", a: "Six per person per session. Bulk orders above that must go through the GrandWest group booking desk." },
    ],
    featured: true,
    trending: true,
    seated: true,
    ageRestriction: "16+. Contains strong language and adult themes.",
    soldPercent: 93,
    rating: 4.9,
    organiser: "GrandWest Live",
  }),

  build({
    id: "ev-202",
    slug: "loyiso-gola-unlearning-the-baxter",
    title: "Loyiso Gola: Unlearning",
    artist: "Loyiso Gola",
    category: "comedy",
    tags: ["Stand-Up", "Political Satire", "Seated"],
    date: "2026-02-20",
    doors: "19:00",
    start: "20:00",
    end: "21:40",
    venue: {
      name: "Baxter Theatre Centre",
      address: "Main Rd, Newlands, Cape Town",
      city: "Cape Town",
      capacity: 638,
      note: "Acclaimed arts venue with the Baxter Concert Chamber — 15 minutes from the CBD on the M3.",
      lat: -33.9633,
      lng: 18.4622,
    },
    image: px(9547593),
    poster: px(9547593, 900, 1200),
    gallery: [px(9547593, 1600, 900), px(7807297, 1200, 800), px(17850551, 1200, 800)],
    priceFrom: 220,
    tiers: [
      { id: "t1", name: "Standard Seat", price: 220, description: "Reserved auditorium seat", remaining: 132, perks: ["Reserved seat"] },
      { id: "t2", name: "Premium Row A–F", price: 320, description: "Front six rows", remaining: 21, perks: ["Front 6 rows", "Programme included"] },
    ],
    blurb: "Sharp, unsentimental political satire from one of the country's most fearless stand-up voices.",
    description: [
      "Unlearning is Loyiso Gola's first full-length hour since his international tour, and it lands in a room that suits the material: 638 seats, no screens, no hiding place.",
      "Expect an hour of tightly written political and social satire, plus a support slot from a rotating Cape Town comic.",
      "The Baxter bar opens at 18:30 with a limited edition 'Unlearning' cocktail for the run.",
    ],
    lineup: [{ name: "Loyiso Gola", role: "Headliner" }, { name: "Rotating Cape Town comic", role: "Support" }],
    seated: true,
    ageRestriction: "18+. Strong language and political content.",
    soldPercent: 76,
    rating: 4.6,
    organiser: "Baxter Comedy Season",
  }),

  build({
    id: "ev-203",
    slug: "schalk-bezuidenhout-skerts-boksburg",
    title: "Schalk Bezuidenhout: Skerts",
    artist: "Schalk Bezuidenhout",
    category: "comedy",
    tags: ["Afrikaans", "Stand-Up", "Intimate"],
    date: "2026-03-07",
    doors: "18:30",
    start: "19:30",
    end: "21:15",
    venue: {
      name: "Comedy at the Barn",
      address: "Elsburg Park, 56 Trichardt Rd, Boksburg",
      city: "Johannesburg",
      capacity: 300,
      note: "Converted barn venue with long-table seating, a wood-fired pizza oven and an unbeatable atmosphere.",
      lat: -26.2206,
      lng: 28.2567,
    },
    image: px(7715793),
    poster: px(7715793, 900, 1200),
    gallery: [px(7715793, 1600, 900), px(1840320, 1200, 800), px(2101487, 1200, 800)],
    priceFrom: 180,
    tiers: [
      { id: "t1", name: "Long Table", price: 180, description: "Shared long-table seating", remaining: 88, perks: ["Table seat", "Access to pizza oven"] },
      { id: "t2", name: "Table for 4", price: 820, description: "Reserved table for four guests", remaining: 9, perks: ["Reserved table", "Bottle of wine", "Front half of the room"] },
    ],
    blurb: "'n Heerlike aand vol skerts en stories — in 'n ou pakhuis met houtvuurpizza en lang tafels.",
    description: [
      "Skerts is Schalk Bezuidenhout se nuwe eenman-vertoning: 'n uur vol waarnemings oor klein dorpies, groot families en die ongemaklike stiltes tussen hulle.",
      "Comedy at the Barn is a long-table venue — you sit with strangers, share a bottle of wine and by the interval you know their names. Tables of four can be reserved in the front half of the room.",
      "Die houtvuurpizza-oond is oop vanaf 17:30. Bestel jou pizza met kaartjieboek om die tou te spring.",
    ],
    lineup: [{ name: "Schalk Bezuidenhout", role: "Hoofkunstenaar" }],
    extraTerms: ["Langtafelsitplekke word gedeel met ander gaste."],
    seated: true,
    ageRestriction: "16+. Sterk taal en volwasse humor.",
    soldPercent: 69,
    rating: 4.7,
    organiser: "Comedy at the Barn",
  }),

  build({
    id: "ev-204",
    slug: "aunty-merle-se-troue-artscape",
    title: "Marc Lottering: Aunty Merle se Troue",
    artist: "Marc Lottering",
    category: "comedy",
    tags: ["Character Comedy", "Afrikaans", "Seated"],
    date: "2026-05-16",
    doors: "19:00",
    start: "20:00",
    end: "21:45",
    venue: {
      name: "Artscape Theatre Centre",
      address: "D F Malan St, Foreshore, Cape Town",
      city: "Cape Town",
      capacity: 1187,
      note: "Cape Town's flagship performing arts centre, a short walk from the MyCiTi Adderley Street stop.",
      lat: -33.9197,
      lng: 18.4219,
    },
    image: px(7715596),
    poster: px(7715596, 900, 1200),
    gallery: [px(7715596, 1600, 900), px(6899765, 1200, 800), px(6899775, 1200, 800)],
    priceFrom: 290,
    tiers: [
      { id: "t1", name: "Balcony", price: 290, description: "Reserved balcony seat", remaining: 240, perks: ["Reserved seat"] },
      { id: "t2", name: "Stalls", price: 390, description: "Reserved stalls seat", remaining: 160, perks: ["Reserved seat", "Foyer bar"] },
      { id: "t3", name: "Troue VIP", price: 590, description: "Front rows with wedding gift hamper", remaining: 30, perks: ["Front 5 rows", "Gift hamper", "Photo with Aunty Merle"] },
    ],
    blurb: "Aunty Merle is getting married — and the whole family has opinions about the guest list.",
    description: [
      "Marc Lottering's beloved Aunty Merle returns for a full-length wedding special: the guest list is a battlefield, the cake is a disaster and the MC has been missing since Thursday.",
      "Performed in the Artscape Theatre with a full set, projections and a live three-piece band for the reception numbers.",
      "VIP tickets include a wedding gift hamper and a photo opportunity with Aunty Merle after the show.",
    ],
    lineup: [{ name: "Marc Lottering", role: "Aunty Merle and the whole family" }],
    seated: true,
    ageRestriction: "12+. Family-friendly humour with some strong language.",
    soldPercent: 47,
    rating: 4.6,
    organiser: "Artscape Presents",
  }),

  /* ------------------------------- THEATRE ------------------------------- */
  build({
    id: "ev-301",
    slug: "joburg-ballet-swan-lake",
    title: "Joburg Ballet: Swan Lake",
    artist: "Joburg Ballet Company",
    category: "theatre",
    tags: ["Ballet", "Orchestra", "Family"],
    date: "2026-03-27",
    endDate: "2026-03-29",
    doors: "18:30",
    start: "19:30",
    end: "22:00",
    venue: {
      name: "Nelson Mandela Theatre, Joburg Theatre",
      address: "158 Loveday St, Braamfontein, Johannesburg",
      city: "Johannesburg",
      capacity: 1000,
      note: "Braamfontein's premier proscenium house, with the Joburg Theatre precinct's restaurants open until late.",
      lat: -26.1929,
      lng: 28.0356,
    },
    image: px(4250534),
    poster: px(4250534, 900, 1200),
    gallery: [px(4250534, 1600, 900), px(4250533, 1200, 800), px(17055417, 1200, 800)],
    priceFrom: 280,
    tiers: [
      { id: "t1", name: "Upper Circle", price: 280, description: "Reserved upper circle seat", remaining: 210, perks: ["Reserved seat"] },
      { id: "t2", name: "Dress Circle", price: 460, description: "Reserved dress circle seat", remaining: 140, perks: ["Reserved seat", "Interval drinks voucher"] },
      { id: "t3", name: "Stalls Premium", price: 690, description: "Stalls rows A–P", remaining: 52, perks: ["Stalls seating", "Programme", "Interval drinks voucher"] },
      { id: "t4", name: "Patron's Row", price: 1250, description: "Rows A–C with post-show reception", remaining: 14, perks: ["Front 3 rows", "Post-show reception with the company", "Signed programme"] },
    ],
    blurb: "Tchaikovsky's masterpiece in three nights only, danced by the Joburg Ballet with a live pit orchestra.",
    description: [
      "Joburg Ballet opens its 2026 season with Swan Lake, staged in the Nelson Mandela Theatre over three nights with a live orchestra of 46 musicians in the pit.",
      "The production uses Marius Petipa and Lev Ivanov's classical choreography with a new Act III design by the company's artistic director, and costumes rebuilt on the Joburg Theatre workshop floor.",
      "A 20-minute interval separates Acts II and III. Matinee performances on the Saturday and Sunday are ideal for families with children aged six and older.",
    ],
    lineup: [
      { name: "Joburg Ballet Company", role: "36 dancers" },
      { name: "Joburg Theatre Orchestra", role: "Live pit orchestra" },
    ],
    schedule: [
      { time: "18:30", title: "Foyer opens", detail: "Box office, bar and cloakroom open" },
      { time: "19:30", title: "Act I & II", detail: "80 minutes without interval" },
      { time: "20:50", title: "Interval", detail: "20 minutes" },
      { time: "21:10", title: "Act III & IV", detail: "50 minutes" },
      { time: "22:00", title: "Curtain call", detail: "Patron's Row reception in the Ballroom" },
    ],
    seated: true,
    ageRestriction: "Suitable for ages 6+. Babies and toddlers are not permitted in the auditorium.",
    soldPercent: 66,
    rating: 4.8,
    organiser: "Joburg Theatre",
  }),

  build({
    id: "ev-302",
    slug: "cape-town-philharmonic-carmina-burana",
    title: "Cape Town Philharmonic: Carmina Burana",
    artist: "Cape Town Philharmonic Orchestra",
    category: "theatre",
    tags: ["Classical", "Choir", "Orchestra"],
    date: "2026-03-13",
    doors: "19:00",
    start: "19:30",
    end: "21:30",
    venue: {
      name: "Artscape Opera House",
      address: "D F Malan St, Foreshore, Cape Town",
      city: "Cape Town",
      capacity: 1487,
      note: "The Opera House seats 1 487 across four levels, with a 47-metre proscenium and superb choral acoustics.",
      lat: -33.9197,
      lng: 18.4219,
    },
    image: px(35061324),
    poster: px(35061324, 900, 1200),
    gallery: [px(35061324, 1600, 900), px(7095724, 1200, 800), px(7095043, 1200, 800)],
    priceFrom: 250,
    tiers: [
      { id: "t1", name: "Upper Balcony", price: 250, description: "Reserved upper balcony seat", remaining: 280, perks: ["Reserved seat"] },
      { id: "t2", name: "Dress Circle", price: 420, description: "Reserved dress circle seat", remaining: 190, perks: ["Reserved seat"] },
      { id: "t3", name: "Parterre", price: 620, description: "Ground floor reserved seat", remaining: 96, perks: ["Reserved seat", "Programme"] },
    ],
    blurb: "Orff's O Fortuna performed by 90 musicians and a 120-voice choir in the Artscape Opera House.",
    description: [
      "Carl Orff's Carmina Burana opens the Cape Town Philharmonic's autumn programme — 90 orchestral musicians, a 120-voice adult choir and a 40-voice children's choir under one roof.",
      "The concert opens with a South African premiere of a short orchestral work by a Western Cape composer, commissioned for the 2026 season.",
      "The Artscape Opera House's four levels offer reserved seating in every tier. Latecomers are seated at the first suitable break.",
    ],
    lineup: [
      { name: "Cape Town Philharmonic Orchestra", role: "90 musicians" },
      { name: "Cape Town Philharmonic Choir", role: "120 voices" },
      { name: "Drakensberg Boys' Choir", role: "Guest children's choir" },
    ],
    seated: true,
    ageRestriction: "All ages welcome. Latecomers seated at the first suitable break.",
    soldPercent: 58,
    rating: 4.7,
    organiser: "Cape Town Philharmonic",
  }),

  build({
    id: "ev-303",
    slug: "appel-soos-net-hy-kan-kunstekaap",
    title: "Appel – Soos Net Hy Kan",
    artist: "Appel",
    category: "theatre",
    tags: ["Afrikaans", "Tribute Show", "Reserved Seating"],
    date: "2026-04-25",
    endDate: "2026-04-26",
    doors: "18:00",
    start: "19:00",
    end: "21:15",
    venue: {
      name: "Kunstekaap — Piers Park Theatre",
      address: "536 Schoeman St, Arcadia, Pretoria",
      city: "Pretoria",
      capacity: 520,
      note: "A 520-seat proscenium theatre with raked seating — every row is numbered and reserved on the OpenTickets seat map.",
      lat: -25.7545,
      lng: 28.2314,
    },
    image: px(2101487),
    poster: px(2101487, 900, 1200),
    gallery: [px(2101487, 1600, 900), px(6899776, 1200, 800), px(13400090, 1200, 800)],
    priceFrom: 320,
    tiers: [
      { id: "t1", name: "Balkon (Rye K–P)", price: 320, description: "Gereserveerde balkonsitplekke", remaining: 96, perks: ["Gereserveerde sitplek", "Uitsig oor die verhoog"] },
      { id: "t2", name: "Stalletjies (Rye D–J)", price: 420, description: "Gereserveerde vloersitplekke", remaining: 74, perks: ["Gereserveerde sitplek", "Intervaldrankie"] },
      { id: "t3", name: "Voorste Rye (A–C)", price: 560, description: "Die eerste drie rye, middeldeur", remaining: 18, perks: ["Voorste 3 rye", "Ontmoet en groet", "Gesigneerde CD"] },
    ],
    blurb: "Die storie agter die liedjies — 'n teateraand met Appel soos net hy kan, live in Pretoria.",
    description: [
      "Soos Net Hy Kan is 'n teaterproduksie wat Appel se treffers, sy stories en sy humorsin in een aand saamvat. Met 'n vierstuk-band, 'n ligontwerp gebou vir klein teaters en 'n paar gaste wat niemand sien kom nie.",
      "Die produksie is twee aande lank in die Kunstekaap Piers Park Theatre in Pretoria, met 'n Saterdag- en Sondagvertoning. Alle sitplekke is genommer en word op die OpenTickets-sitplekkaart gekies.",
      "Voorste Rye-kaartjies sluit 'n ontmoet en groet ná die vertoning en 'n gesigneerde CD in.",
    ],
    lineup: [
      { name: "Appel", role: "Hoofkunstenaar" },
      { name: "Die Appel Band", role: "Vierstuk live band" },
      { name: "Gaskunstenaars", role: "Word op die aand aangekondig" },
    ],
    schedule: [
      { time: "18:00", title: "Foier en kroeg oop", detail: "Kardientjies en die foierkroeg open" },
      { time: "19:00", title: "Deel een", detail: "Die treffers en die stories" },
      { time: "20:00", title: "Interval", detail: "20 minute — vooraf bestelde drankies by die kroeg" },
      { time: "20:20", title: "Deel twee", detail: "Gaste en die akoestiese stel" },
      { time: "21:15", title: "Gordyn", detail: "Ontmoet en groet vir Voorste Rye-kaartjiehouers" },
    ],
    extraTerms: ["Alle sitplekke is genommer en word tydens bespreking op die sitplekkaart gekies."],
    extraFaqs: [
      { q: "Kan ek my eie sitplek kies?", a: "Ja. Hierdie vertoning gebruik die OpenTickets-sitplekkaart: kies jou ry en sitplek tydens bespreking en jou plek word op jou kaartjie gedruk." },
      { q: "Is die teater toeganklik vir rolstoele?", a: "Die Kunstekaap Piers Park Theatre het rolstoeltoegang op die grondvloer. Kontak die boks­kantoor om 'n rolstoelplek en 'n begeleierkaartjie te bespreek." },
    ],
    seated: true,
    trending: true,
    ageRestriction: "10 jaar en ouer. Ouerskaplike leiding vir kinders onder 12.",
    soldPercent: 79,
    rating: 4.8,
    organiser: "Kunstekaap Teater",
  }),

  build({
    id: "ev-304",
    slug: "isibindi-market-theatre-drum-and-dance",
    title: "Isibindi: Drum & Dance of the Continent",
    artist: "Isibindi Ensemble",
    category: "theatre",
    tags: ["Dance", "Live Drums", "Market Theatre"],
    date: "2026-05-08",
    endDate: "2026-05-10",
    doors: "19:00",
    start: "20:00",
    end: "21:30",
    venue: {
      name: "Market Theatre, Newtown",
      address: "56 Margaret Mcingana St, Newtown, Johannesburg",
      city: "Johannesburg",
      capacity: 400,
      note: "The legendary anti-apartheid theatre complex in Newtown, with the Market Photo Workshop and Kramers bar next door.",
      lat: -26.2041,
      lng: 28.0293,
    },
    image: px(28928758),
    poster: px(28928758, 900, 1200),
    gallery: [px(28928758, 1600, 900), px(27291194, 1200, 800), px(18807622, 1200, 800)],
    priceFrom: 190,
    tiers: [
      { id: "t1", name: "General Seat", price: 190, description: "Reserved seat in the Barney Simon Theatre", remaining: 128, perks: ["Reserved seat"] },
      { id: "t2", name: "Front Row", price: 260, description: "Rows A–C", remaining: 24, perks: ["Front 3 rows", "Drum-circle participation"] },
    ],
    blurb: "Fifteen dancers, eight drummers and one hour of rhythm that travels from Soweto to West Africa and back.",
    description: [
      "Isibindi is a high-energy drum and dance production that maps the rhythmic conversation between Southern and West Africa, performed by a fifteen-strong ensemble of dancers, drummers and a lead vocalist.",
      "The Barney Simon Theatre's thrust configuration puts the audience within arm's reach of the dancers — there is no fourth wall here, and the finale invites front-row ticket holders into the drum circle.",
      "Three performances only, with a post-show talkback on the Saturday.",
    ],
    lineup: [
      { name: "Isibindi Ensemble", role: "15 dancers, 8 drummers" },
      { name: "Nomvula Dlamini", role: "Lead vocals" },
    ],
    seated: true,
    ageRestriction: "All ages. Loud drumming — ear protection available at the box office.",
    soldPercent: 43,
    rating: 4.7,
    organiser: "Market Theatre Foundation",
  }),

  /* ------------------------------ FESTIVALS ------------------------------ */
  build({
    id: "ev-401",
    slug: "rocking-the-daisies-2026",
    title: "Rocking the Daisies 2026",
    artist: "RTD Festival Line-up",
    category: "festivals",
    tags: ["Multi-Day", "Camping", "Sustainability"],
    date: "2026-10-02",
    endDate: "2026-10-04",
    doors: "10:00",
    start: "12:00",
    end: "23:00",
    venue: {
      name: "Cloof Wine Estate",
      address: "Darling Hills Rd, Darling, Western Cape",
      city: "Cape Town",
      capacity: 20000,
      note: "A working wine farm in the Darling Hills — four stages, camping grounds and 90 minutes from Cape Town.",
      lat: -33.3792,
      lng: 18.5799,
    },
    image: px(17373844),
    poster: px(17373844, 900, 1200),
    gallery: [px(17373844, 1600, 900), px(14267300, 1200, 800), px(38431294, 1200, 800)],
    priceFrom: 1250,
    tiers: [
      { id: "t1", name: "Weekend GA", price: 1250, description: "3-day access, bring your own camping", remaining: 4200, perks: ["3-day festival access", "Bring-your-own camping"] },
      { id: "t2", name: "Weekend GA + Camping", price: 1690, description: "3-day access with a serviced campsite", remaining: 1850, perks: ["3-day access", "Serviced campsite", "Hot showers", "Phone charging"] },
      { id: "t3", name: "Glamping Dome", price: 3950, description: "Twin-share furnished dome", remaining: 96, perks: ["Furnished dome", "Private ablutions", "Early entry Thursday", "Breakfast included"] },
    ],
    blurb: "South Africa's greenest festival returns to the Darling Hills — three days, four stages and 60 artists.",
    description: [
      "Rocking the Daisies 2026 takes over Cloof Wine Estate for three days in the Darling Hills, with four stages, 60 artists and the festival's signature sustainability programme — including a cashless site, refill stations and a zero-landfill pledge.",
      "Camping is included with the Camping and Glamping tiers. The campsite opens at 10:00 on Thursday 1 October for pre-registered campers, with hot showers, phone charging lockers and a dedicated quiet camping zone.",
      "Day visitors are welcome: shuttle buses run from Cape Town's Long Street and Stellenbosch every 30 minutes between 09:00 and 02:00.",
    ],
    lineup: [
      { name: "Jeremy Loops", role: "Friday headline" },
      { name: "Goldfish", role: "Saturday headline" },
      { name: "Maphorisa", role: "Sunday headline" },
      { name: "60+ artists", role: "Across four stages" },
    ],
    schedule: [
      { time: "Thu 10:00", title: "Campsite opens", detail: "Pre-registered campers move in" },
      { time: "Fri 12:00", title: "Festival opens", detail: "Gates open, all four stages live" },
      { time: "Fri 21:00", title: "Jeremy Loops", detail: "Main stage headline" },
      { time: "Sat 21:00", title: "Goldfish", detail: "Main stage headline" },
      { time: "Sun 20:00", title: "Maphorisa", detail: "Closing headline set" },
      { time: "Sun 23:00", title: "Festival closes", detail: "Campers depart by 12:00 Monday" },
    ],
    extraTerms: ["Camping guests must register a vehicle and tent footprint before 25 September."],
    extraFaqs: [
      { q: "Do shuttles run from Cape Town?", a: "Yes — every 30 minutes from Long Street and Stellenbosch between 09:00 and 02:00, R350 return, bookable at checkout." },
      { q: "Is the festival cashless?", a: "Completely. Your wristband is loaded at the tap stations across the site, and unused credit is refunded within five working days after the festival." },
    ],
    featured: true,
    trending: true,
    ageRestriction: "18+ for camping. Under-18s welcome as day visitors with a guardian.",
    soldPercent: 52,
    rating: 4.8,
    organiser: "Cloof Festival Group",
  }),

  build({
    id: "ev-402",
    slug: "ultra-south-africa-2026",
    title: "Ultra South Africa 2026",
    artist: "Ultra SA Line-up",
    category: "festivals",
    tags: ["Electronic", "One Day", "Nasrec"],
    date: "2026-02-13",
    doors: "12:00",
    start: "13:00",
    end: "23:00",
    venue: {
      name: "Nasrec Expo Centre",
      address: "1 Expo Rd, Nasrec, Johannesburg",
      city: "Johannesburg",
      capacity: 30000,
      note: "Two outdoor main stages plus three indoor halls, with Park & Ride from Rosebank and Midrand.",
      lat: -26.2356,
      lng: 27.9853,
    },
    image: px(7715596),
    poster: px(7715596, 900, 1200),
    gallery: [px(7715596, 1600, 900), px(7258865, 1200, 800), px(9005483, 1200, 800)],
    priceFrom: 795,
    tiers: [
      { id: "t1", name: "General Admission", price: 795, description: "Full-site access for one day", remaining: 1240, perks: ["All 5 stages", "Site-wide bars"] },
      { id: "t2", name: "VIP", price: 1650, description: "Raised viewing decks and private bars", remaining: 260, perks: ["VIP decks", "Private bars", "Fast-track entry"] },
      { id: "t3", name: "Ultra Table", price: 8500, description: "VIP table for six on the deck", remaining: 8, perks: ["Table for 6", "Two bottles", "Waiter service", "VIP parking"] },
    ],
    blurb: "One day, five stages and the biggest electronic line-up ever assembled on African soil.",
    description: [
      "Ultra South Africa returns to the Nasrec Expo Centre with two outdoor main stages and three indoor halls, running from midday to 23:00.",
      "The 2026 line-up spans house, techno, amapiano and drum & bass, with international headliners joined by the strongest local bill in the festival's history.",
      "VIP tables are sold for six guests and include two bottles with waiter service on the raised deck overlooking the main stage.",
    ],
    lineup: [
      { name: "Black Coffee", role: "Main stage" },
      { name: "Themba", role: "Main stage" },
      { name: "Kelvin Momo", role: "Amapiano hall" },
      { name: "Culoe De Song", role: "Deep house hall" },
    ],
    extraTerms: ["VIP tables admit six guests and include two bottles with waiter service."],
    ageRestriction: "Strictly 18+. Photo ID required — no ID, no entry, no refund.",
    soldPercent: 81,
    rating: 4.7,
    organiser: "Ultra Worldwide SA",
  }),

  build({
    id: "ev-403",
    slug: "oppikoppi-bushveld-ball-2026",
    title: "Oppikoppi: Bushveld Ball",
    artist: "Oppikoppi Line-up",
    category: "festivals",
    tags: ["Rock", "Camping", "Bushveld"],
    date: "2026-08-07",
    endDate: "2026-08-09",
    doors: "09:00",
    start: "11:00",
    end: "23:30",
    venue: {
      name: "Oppikoppi Farm",
      address: "R510, Northam, Limpopo",
      city: "Limpopo",
      capacity: 25000,
      note: "The original bushveld festival farm — three stages in the trees, camping under the stars, three hours north of Joburg.",
      lat: -24.8782,
      lng: 27.2756,
    },
    image: px(14267300),
    poster: px(14267300, 900, 1200),
    gallery: [px(14267300, 1600, 900), px(15509661, 1200, 800), px(28407738, 1200, 800)],
    priceFrom: 1450,
    tiers: [
      { id: "t1", name: "Weekend Ticket", price: 1450, description: "3-day access, camping included", remaining: 3100, perks: ["3-day access", "Camping included", "Showers"] },
      { id: "t2", name: "Weekend + Vehicle", price: 1780, description: "Adds a camping vehicle pass", remaining: 900, perks: ["3-day access", "Vehicle on site", "Camping included"] },
      { id: "t3", name: "Bushveld VIP", price: 3200, description: "Shaded deck, private ablutions", remaining: 120, perks: ["Shaded viewing deck", "Private ablutions", "Free water refill", "Early entry"] },
    ],
    blurb: "Three days of rock, dust and duiwelskuns in the Limpopo bushveld — camping included in every ticket.",
    description: [
      "Bushveld Ball is Oppikoppi's 2026 edition: three stages tucked into the trees, 40 bands across rock, Afrikaans, hip hop and electronic, and camping included in every ticket price.",
      "The farm is three hours north of Johannesburg on the R510. Water refill stations are free and unlimited — Limpopo in August is hot and dry, and hydration is taken seriously.",
      "The Bushveld VIP deck sits in the shade with private ablutions and an early-entry lane from 08:00 each day.",
    ],
    lineup: [
      { name: "Fokofpolisiekar", role: "Saturday headline" },
      { name: "The Parlotones", role: "Friday headline" },
      { name: "Gazelle", role: "Sunday headline" },
      { name: "40 bands", role: "Across three stages" },
    ],
    extraTerms: ["Every ticket includes camping. Vehicle passes must be purchased separately to bring a car onto the campsite."],
    ageRestriction: "18+. Strict photo ID policy at the gate.",
    soldPercent: 44,
    rating: 4.6,
    organiser: "Oppikoppi Boerdery",
  }),

  build({
    id: "ev-404",
    slug: "innibos-kunsfees-2026",
    title: "Innibos Laeveld Kunsfees",
    artist: "Innibos Festival",
    category: "festivals",
    tags: ["Arts Festival", "Afrikaans", "Family"],
    date: "2026-06-24",
    endDate: "2026-06-27",
    doors: "08:00",
    start: "09:00",
    end: "22:00",
    venue: {
      name: "Laerskool Nelspruit & Innibos Park",
      address: "Louis Trichardt St, Mbombela, Mpumalanga",
      city: "Mbombela",
      capacity: 35000,
      note: "A festival built across school grounds and parkland in Mbombela — 12 venues, all within walking distance.",
      lat: -25.4753,
      lng: 30.9694,
    },
    image: px(38431294),
    poster: px(38431294, 900, 1200),
    gallery: [px(38431294, 1600, 900), px(16803238, 1200, 800), px(37250480, 1200, 800)],
    priceFrom: 250,
    tiers: [
      { id: "t1", name: "Dagkaartjie", price: 250, description: "Enkele dag toegang tot alle verhoë", remaining: 5200, perks: ["1 dag toegang", "Alle verhoë", "Kunstemark"] },
      { id: "t2", name: "Voltyd Kaartjie", price: 890, description: "Volle vier dae toegang", remaining: 2100, perks: ["4 dae toegang", "Alle vertonings", "Gratis parkering"] },
      { id: "t3", name: "Innibos Vriende", price: 2400, description: "Voltyd kaartjie met gasvryheid", remaining: 150, perks: ["4 dae toegang", "Gasvryheid-lokaal", "Ontbyt ingesluit", "Voorafbespreking van vertonings"] },
    ],
    blurb: "Vier dae van Afrikaanse kuns, musiek, teater en kos in die hart van die Laeveld.",
    description: [
      "Innibos is die Laeveld se groot Afrikaanse kunstefees: vier dae, twaalf verhoë, meer as 300 vertonings en 'n kunstemark wat strek oor drie skoolgronde in Mbombela.",
      "Die program meng teater, cabaret, kinder-vertonings, boekgeselse en 'n vol musiekprogram wat tot laat in die nag op die hoof­verhoog speel.",
      "Voltyd-kaartjies gee toegang tot alle vertonings sonder voorafbespreking, behalwe die Innibos Vriende-produksies wat vroeg bespreek moet word.",
    ],
    lineup: [
      { name: "Kurt Darren", role: "Hoofverhoog" },
      { name: "Karen Zoid", role: "Hoofverhoog" },
      { name: "Elzabé Zietsman", role: "Teater" },
      { name: "300+ vertonings", role: "12 verhoë" },
    ],
    extraTerms: ["Innibos Vriende-gaste moet Vriende-produksies vooraf bespreek."],
    extraFaqs: [
      { q: "Is Innibos geskik vir kinders?", a: "Baie. Daar is 'n volledige kinderprogram met marionette-, storie- en werkswinkelvertonings, plus 'n bewaakte speelarea by Innibos Park." },
      { q: "Kan ek my eie stoele bring?", a: "Ja, vir die grasperk-areas by die hoofverhoog. Geen stoele binne die teatersale nie." },
    ],
    ageRestriction: "Gesinsvriendelik. Kinders onder 6 is gratis op die terrein.",
    soldPercent: 38,
    rating: 4.7,
    organiser: "Innibos Kunstefees",
  }),

  build({
    id: "ev-405",
    slug: "karoo-food-and-wine-festival-2026",
    title: "Karoo Food & Wine Festival",
    artist: "Karoo Festival Collective",
    category: "festivals",
    tags: ["Food", "Wine", "Family Friendly"],
    date: "2026-09-12",
    endDate: "2026-09-13",
    doors: "10:00",
    start: "11:00",
    end: "20:00",
    venue: {
      name: "Prince Albert Village Green",
      address: "Church St, Prince Albert, Karoo",
      city: "Prince Albert",
      capacity: 8000,
      note: "A village green at the foot of the Swartberg — two days of food, wine and long Karoo sunsets.",
      lat: -33.2256,
      lng: 22.0311,
    },
    image: px(16803238),
    poster: px(16803238, 900, 1200),
    gallery: [px(16803238, 1600, 900), px(37250480, 1200, 800), px(12657546, 1200, 800)],
    priceFrom: 320,
    tiers: [
      { id: "t1", name: "Day Ticket", price: 320, description: "Single-day entry with tasting glass", remaining: 1800, perks: ["1-day entry", "Tasting glass", "40 tasting tokens"] },
      { id: "t2", name: "Weekend Ticket", price: 560, description: "Both days with tasting glass", remaining: 640, perks: ["2-day entry", "Tasting glass", "80 tasting tokens"] },
      { id: "t3", name: "Long Table Dinner", price: 1450, description: "Chef's long-table dinner under the stars", remaining: 28, perks: ["6-course dinner", "Wine pairing", "Weekend entry included"] },
    ],
    blurb: "Two days on a Karoo village green — 60 producers, six chefs and a long-table dinner under the stars.",
    description: [
      "The Karoo Food & Wine Festival takes over the Prince Albert village green for two days, with 60 producers from the Great Karoo, six guest chefs running live-fire demonstrations and a tasting glass included with every ticket.",
      "The highlight is the Long Table Dinner: a six-course menu under the stars, cooked over open fire by three of the country's best chefs, with Swartberg wine pairings. Weekend entry is included with the dinner ticket.",
      "Children under 12 enter free with a paying adult. The green is fully wheelchair accessible with accessible parking on Church Street.",
    ],
    lineup: [
      { name: "60 Karoo producers", role: "Tasting village" },
      { name: "6 guest chefs", role: "Live-fire demonstrations" },
      { name: "Karoo Musiek", role: "Afternoon stage" },
    ],
    extraTerms: ["Tasting tokens are non-transferable and cannot be exchanged for cash."],
    ageRestriction: "Family friendly. Under-12s free. Alcohol service strictly 18+ with ID.",
    soldPercent: 34,
    rating: 4.6,
    organiser: "Prince Albert Tourism",
  }),

  build({
    id: "ev-406",
    slug: "soweto-gospel-extravaganza-2026",
    title: "Soweto Gospel Extravaganza",
    artist: "Soweto Gospel Choir",
    category: "music",
    tags: ["Gospel", "Choir", "Heritage Day"],
    date: "2026-09-24",
    doors: "14:00",
    start: "15:00",
    end: "18:30",
    venue: {
      name: "Walter Sisulu Square, Kliptown",
      address: "Union Rd, Kliptown, Soweto",
      city: "Johannesburg",
      capacity: 15000,
      note: "Open-air heritage square in Kliptown, with shaded grandstand seating and a food market on the concourse.",
      lat: -26.2541,
      lng: 27.9245,
    },
    image: px(27291194),
    poster: px(27291194, 900, 1200),
    gallery: [px(27291194, 1600, 900), px(18807622, 1200, 800), px(32879847, 1200, 800)],
    priceFrom: 180,
    tiers: [
      { id: "t1", name: "Lawn", price: 180, description: "Unreserved lawn access", remaining: 3200, perks: ["Lawn access", "Bring your own blanket"] },
      { id: "t2", name: "Grandstand", price: 320, description: "Reserved shaded grandstand seat", remaining: 720, perks: ["Reserved seat", "Shaded stand"] },
      { id: "t3", name: "Heritage Circle", price: 690, description: "Front grandstand with lunch hamper", remaining: 60, perks: ["Front grandstand rows", "Lunch hamper", "Choir meet & greet"] },
    ],
    blurb: "Heritage Day in Kliptown — 40 voices, a 15 000-strong square and the sound that took Soweto to the world.",
    description: [
      "The Soweto Gospel Choir returns home for a Heritage Day extravaganza on the Walter Sisulu Square in Kliptown, performing with a 12-piece band, three guest choirs and a dance ensemble.",
      "The square opens at 14:00 with a food market, craft stalls and children's activities. The concert runs from 15:00 to 18:30, ending as the sun goes down behind the grandstand.",
      "Heritage Circle tickets include a lunch hamper from a Soweto kitchen and a meet & greet with the choir after the performance.",
    ],
    lineup: [
      { name: "Soweto Gospel Choir", role: "40 voices" },
      { name: "Drakensberg Boys' Choir", role: "Guest choir" },
      { name: "Vusi Mahlasela", role: "Special guest" },
    ],
    extraTerms: ["No gazebos or shade structures permitted on the lawn."],
    ageRestriction: "All ages. Family friendly with a supervised children's zone.",
    soldPercent: 29,
    rating: 4.9,
    organiser: "Kliptown Heritage Live",
  }),
];

/* ------------------------------ Derived data ------------------------------ */

export const CITIES = Array.from(new Set(EVENTS.map((e) => e.venue.city))).sort();

export const VENUES = EVENTS.map((e) => ({
  id: e.venue.name,
  name: e.venue.name,
  city: e.venue.city,
  capacity: e.venue.capacity,
}));

export const ALL_TAGS = Array.from(new Set(EVENTS.flatMap((e) => e.tags))).sort();

export const FEATURED = EVENTS.filter((e) => e.featured);
export const TRENDING = EVENTS.filter((e) => e.trending);

export const PRICE_BANDS: { id: string; label: string; min: number; max: number }[] = [
  { id: "under-300", label: "Under R300", min: 0, max: 300 },
  { id: "300-600", label: "R300 – R600", min: 300, max: 600 },
  { id: "600-1200", label: "R600 – R1 200", min: 600, max: 1200 },
  { id: "over-1200", label: "R1 200 +", min: 1200, max: Infinity },
];

export function getEvent(slug: string | undefined): EventItem | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function relatedEvents(event: EventItem, count = 3): EventItem[] {
  const same = EVENTS.filter((e) => e.id !== event.id && e.category === event.category);
  const other = EVENTS.filter((e) => e.id !== event.id && e.category !== event.category);
  return [...same, ...other].slice(0, count);
}
