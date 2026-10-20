import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type QuoteItem } from "@/lib/lampros-data";

type QuoteLine = QuoteItem & { name: string };
type QuoteContextValue = {
  items: QuoteLine[];
  count: number;
  addItem: (id: string) => void;
  changeQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteLine[]>([]);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("lampros-quote-list");
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validItems = parsed.flatMap((entry): QuoteLine[] => {
            if (entry == null || typeof entry !== "object") return [];
            const candidate = entry as Partial<QuoteLine>;
            const product = products.find((item) => item.id === candidate.id);
            if (!product || typeof candidate.quantity !== "number" || !Number.isInteger(candidate.quantity) || candidate.quantity < 1 || candidate.quantity > 100000) return [];
            return [{ id: product.id, name: product.name, quantity: candidate.quantity }];
          });
          setItems(validItems);
        }
      }
    } catch {
      window.localStorage.removeItem("lampros-quote-list");
    }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (restored) window.localStorage.setItem("lampros-quote-list", JSON.stringify(items));
  }, [items, restored]);
  const addItem = useCallback((id: string) => {
    const match = products.find((product) => product.id === id);
    if (!match) return;
    setItems((previous) => {
      const existing = previous.find((item) => item.id === id);
      if (existing) return previous.map((item) => item.id === id ? { ...item, quantity: Math.min(100000, item.quantity + 1) } : item);
      return [...previous, { id, name: match.name, quantity: 1 }];
    });
  }, []);
  const changeQuantity = useCallback((id: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;
    const normalizedQuantity = Math.floor(quantity);
    setItems((previous) => normalizedQuantity < 1
      ? previous.filter((item) => item.id !== id)
      : previous.map((item) => item.id === id ? { ...item, quantity: Math.min(100000, normalizedQuantity) } : item));
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((sum, item) => sum + item.quantity, 0), addItem, changeQuantity, clear }), [items, addItem, changeQuantity, clear]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error("QuoteProvider is required.");
  return context;
}