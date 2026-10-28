import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartLine {
  key: string;
  eventSlug: string;
  eventTitle: string;
  eventId: string;
  tierId: string;
  tierName: string;
  price: number;
  qty: number;
  date: string;
  venue: string;
  city: string;
  seats?: string[];
  image: string;
}

export const BOOKING_FEE = 35;
const STORAGE_KEY = "opentickets.cart.v1";

interface CartCtx {
  lines: CartLine[];
  isOpen: boolean;
  lastAdded: CartLine | null;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  fees: number;
  total: number;
}

const Ctx = createContext<CartCtx | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStorage());
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartLine | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart still works in memory */
    }
  }, [lines]);

  const add = useCallback((line: Omit<CartLine, "key">) => {
    const key = `${line.eventSlug}::${line.tierId}::${(line.seats ?? []).join(",")}`;
    const full = { ...line, key };
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + line.qty) } : l));
      }
      return [...prev, full];
    });
    setLastAdded(full);
    setIsOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(10, qty) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.price * l.qty, 0), [lines]);
  const fees = lines.length ? BOOKING_FEE * lines.length : 0;

  const value: CartCtx = {
    lines,
    isOpen,
    lastAdded,
    open,
    close,
    add,
    setQty,
    remove,
    clear,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal,
    fees,
    total: subtotal + fees,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
