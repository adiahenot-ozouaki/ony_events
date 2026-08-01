import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onyItems } from '../../constants/ony_items';

export interface CartItem {
  id: string;
  quantite: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (id: string, quantite?: number) => void;
  removeItem: (id: string) => void;
  updateQuantite: (id: string, quantite: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'ony_cart';

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is CartItem =>
        entry && typeof entry.id === 'string' && typeof entry.quantite === 'number'
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // stockage indisponible (navigation privée, quota...) - on ignore silencieusement
    }
  }, [items]);

  function addItem(id: string, quantite = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantite: item.quantite + quantite } : item
        );
      }
      return [...prev, { id, quantite }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantite(id: string, quantite: number) {
    if (quantite <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantite } : item)));
  }

  function clearCart() {
    setItems([]);
  }

  const { totalCount, totalPrice } = useMemo(() => {
    let count = 0;
    let price = 0;
    for (const cartItem of items) {
      const product = onyItems.find((p) => p.id === cartItem.id);
      if (!product) continue;
      count += cartItem.quantite;
      price += product.prix * cartItem.quantite;
    }
    return { totalCount: count, totalPrice: price };
  }, [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantite,
    clearCart,
    totalCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
}
