import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { OnyItem } from '../../constants/ony_interfaces';
import { fetchProducts } from '../../lib/products';
import { useCartStorage } from './useCartStorage';

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useCartStorage();
  const [products, setProducts] = useState<OnyItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchProducts().then((fetchedProducts) => {
      if (!cancelled) setProducts(fetchedProducts);
    });

    return () => {
      cancelled = true;
    };
  }, []);

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
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) continue;
      count += cartItem.quantite;
      price += product.prix * cartItem.quantite;
    }
    return { totalCount: count, totalPrice: price };
  }, [items, products]);

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
