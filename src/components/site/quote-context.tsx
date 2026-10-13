import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
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
  const addItem = useCallback((id: string) => {
    const match = products.find((product) => product.id === id);
    if (!match) return;
    setItems((previous) => {
      const existing = previous.find((item) => item.id === id);
      if (existing) return previous.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...previous, { id, name: match.name, quantity: 1 }];
    });
  }, []);
  const changeQuantity = useCallback((id: string, quantity: number) => {
    setItems((previous) => previous.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(100000, quantity)) } : item));
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