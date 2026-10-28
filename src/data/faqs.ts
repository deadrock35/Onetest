export interface Faq {
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
  tags?: string[];
}

export type FaqCategory = "ticketing" | "venue" | "account" | "general";

export const FAQ_CATEGORIES: { id: FaqCategory; label: string; blurb: string }[] = [
  { id: "ticketing", label: "Ticketing & Refunds", blurb: "Buying, transfers, e-tickets and refunds" },
  { id: "venue", label: "Venue Access", blurb: "Doors, parking, accessibility and what you can bring" },
  { id: "account", label: "Account & Payments", blurb: "Wallets, payment methods and failed transactions" },
  { id: "general", label: "General", blurb: "Organisers, safety and how OpenTickets works" },
];

export const FAQS: Faq[] = [
  {
    id: "f-01",
    category: "ticketing",
    q: "How do I receive my tickets after purchase?",
    a: "Tickets are issued as mobile e-tickets with a rotating barcode. They appear in your OpenTickets wallet 48 hours before doors open, and we send both an SMS and an email with a deep link the moment they go live. Print-at-home PDFs can be requested from any order in My Tickets if your phone battery is a concern.",
    tags: ["e-ticket", "delivery", "sms"],
  },
  {
    id: "f-02",
    category: "ticketing",
    q: "Can I get a refund if I can no longer attend?",
    a: "OpenTickets tickets are non-refundable once the order is confirmed, except where the event is cancelled, postponed or moved to another city. If you simply can't go, use the transfer function to move your ticket to a friend — transfers open 7 days before the event and cost nothing.",
    tags: ["refund", "cancel", "transfer"],
  },
  {
    id: "f-03",
    category: "ticketing",
    q: "How do I transfer a ticket to someone else?",
    a: "Open My Tickets, select the ticket, tap 'Transfer' and enter the recipient's South African mobile number. They must have a free OpenTickets account. Once they accept, the barcode on your original ticket is immediately voided — you cannot both get in.",
    tags: ["transfer", "wallet", "barcode"],
  },
  {
    id: "f-04",
    category: "ticketing",
    q: "What is the booking fee and why is it charged?",
    a: "A flat R35.00 booking fee is applied per transaction, not per ticket, and covers payment processing, barcode generation and the ticketing infrastructure. Some promoters include the fee in the advertised price — the checkout always shows the full breakdown before you pay.",
    tags: ["fee", "price", "checkout"],
  },
  {
    id: "f-05",
    category: "ticketing",
    q: "I bought a seated ticket — can I choose my seat?",
    a: "Yes. Events marked 'Reserved seating' show the interactive OpenTickets seat map during checkout. You select your exact row and seat number, which is then printed on your e-ticket. Availability updates in real time, and seats are held for 10 minutes while you complete payment.",
    tags: ["seat map", "seating", "reserved"],
  },
  {
    id: "f-06",
    category: "ticketing",
    q: "Is there a limit on how many tickets I can buy?",
    a: "Most events are capped at six tickets per person to deter resale. High-demand events such as Trevor Noah's GrandWest run may carry a stricter cap, which is displayed on the event page and at checkout.",
    tags: ["limit", "resale", "quantity"],
  },
  {
    id: "v-01",
    category: "venue",
    q: "What time do doors open?",
    a: "Doors and start times are listed on every event page under 'Event details'. As a rule, arrive at least 45 minutes before the start time — security screening and barcode validation queue heavily at Gauteng and Cape Town venues between 18:30 and 19:30.",
    tags: ["doors", "arrival", "times"],
  },
  {
    id: "v-02",
    category: "venue",
    q: "Is parking available and can I pre-book it?",
    a: "Parking depends on the venue. Sun Arena, FNB Stadium, Nasrec Expo Centre and Gold Reef City all offer pre-bookable parking at checkout (from R60.00). Smaller theatres such as Die Teater and the Baxter have free on-site or street parking.",
    tags: ["parking", "venue", "car"],
  },
  {
    id: "v-03",
    category: "venue",
    q: "Are venues wheelchair accessible?",
    a: "Every event page lists the venue's accessibility notes. Wheelchair platforms with companion seating are available at Sun Arena, FNB Stadium, Artscape, the Nelson Mandela Theatre and GrandWest. Contact the box office at least 48 hours before the event so we can reserve a platform bay and a companion ticket at no extra charge.",
    tags: ["accessibility", "wheelchair", "companion"],
  },
  {
    id: "v-04",
    category: "venue",
    q: "What am I allowed to bring into the venue?",
    a: "Generally: a small bag under A4 size, a sealed water bottle up to 500ml, and your phone. Prohibited almost everywhere: professional cameras, drones, glass, weapons, umbrellas, gazebos, re-entry passes and self-seating furniture. Grass embankment events such as Fill Up allow picnic blankets.",
    tags: ["bag policy", "prohibited", "camera"],
  },
  {
    id: "v-05",
    category: "venue",
    q: "Do you run shuttles or Park & Ride?",
    a: "Yes on selected events. Rocking the Daisies runs half-hourly shuttles from Long Street and Stellenbosch (R350 return). FNB Stadium events offer the Nasrec Park & Ride at R60 per vehicle plus a Gautrain shuttle from Rosebank at R45 return. Both are bookable during checkout.",
    tags: ["shuttle", "transport", "park and ride"],
  },
  {
    id: "a-01",
    category: "account",
    q: "Which payment methods do you accept?",
    a: "All major South African cards (Visa, Mastercard, American Express), instant EFT through Ozow, SnapScan, Zapper, Apple Pay and Google Pay. Selected promoters also accept 3-month interest-free instalments with PayFlex and PayJustNow.",
    tags: ["payment", "eft", "snapscan", "ozow"],
  },
  {
    id: "a-02",
    category: "account",
    q: "My card was charged but I never received tickets.",
    a: "First check the order status in My Tickets — most of these cases are pending authorisations that reverse automatically within 3–5 business days. If no order exists after 24 hours, email support@opentickets.co.za with your card's last four digits, the amount and the timestamp, and our payments team will trace it the same day.",
    tags: ["charge", "failed", "support", "payment"],
  },
  {
    id: "a-03",
    category: "account",
    q: "Is my payment information secure?",
    a: "OpenTickets is PCI-DSS Level 1 certified. Card details are tokenised by our payment gateway and never touch our servers, and every page is served over TLS 1.3. We also support 3-D Secure verification on all South African issuers.",
    tags: ["security", "pci", "fraud"],
  },
  {
    id: "a-04",
    category: "account",
    q: "Can I buy tickets without creating an account?",
    a: "Guest checkout is available on most events using an email address and mobile number. You will still get a wallet link for your tickets, but you won't be able to use transfers, saved cards or the seat-map history that come with a free account.",
    tags: ["guest", "account", "signup"],
  },
  {
    id: "a-05",
    category: "account",
    q: "How do I update the mobile number on my account?",
    a: "Go to Account → Profile → Mobile number. Changing your number triggers a one-time OTP to both the old and new number for security. If you no longer have access to the old number, contact support with your ID document.",
    tags: ["profile", "mobile", "otp"],
  },
  {
    id: "g-01",
    category: "general",
    q: "What happens if an event is cancelled or postponed?",
    a: "If an event is cancelled, refunds are processed automatically to your original payment method within 10 business days — you don't need to do anything. If it is postponed, your tickets remain valid for the new date, and you may request a refund within 14 days of the announcement.",
    tags: ["cancelled", "postponed", "refund"],
  },
  {
    id: "g-02",
    category: "general",
    q: "I'm an organiser — how do I list an event on OpenTickets?",
    a: "Visit opentickets.co.za/organisers and submit your event details. Our team reviews new listings within two business days and provides ticket design, on-site scanning hardware, gate staff training and next-day settlement of your ticket revenue.",
    tags: ["organiser", "listing", "promoter"],
  },
  {
    id: "g-03",
    category: "general",
    q: "Is OpenTickets an official ticket agent?",
    a: "Yes. We are the official ticketing partner for over 40 South African venues and festivals, including Sun Arena, Artscape, the Joburg Theatre and Cloof Wine Estate. Tickets bought anywhere else cannot be validated at the gate.",
    tags: ["official", "scam", "agent"],
  },
  {
    id: "g-04",
    category: "general",
    q: "How do I avoid ticket scams?",
    a: "Only buy from opentickets.co.za or the event page linked from an official venue's site. Never pay an individual via EFT for a 'resale' ticket on social media — the barcode will already be voided at the gate. If a deal looks too good to be true, it is.",
    tags: ["scam", "fraud", "resale"],
  },
  {
    id: "g-05",
    category: "general",
    q: "Do you offer group or corporate bookings?",
    a: "Groups of 10 or more receive a dedicated account manager, consolidated invoicing and reserved seating blocks. Corporate packages include hospitality suites at Sun Arena, FNB Stadium and GrandWest. Email groups@opentickets.co.za with your event and headcount.",
    tags: ["group", "corporate", "bulk"],
  },
];
