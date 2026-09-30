import { useEffect, useState } from 'react';
import type { CartItem } from './CartContext';

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
        entry &&
        typeof entry.id === 'string' &&
        entry.id.trim() !== '' &&
        typeof entry.quantite === 'number' &&
        Number.isFinite(entry.quantite) &&
        Number.isInteger(entry.quantite) &&
        entry.quantite > 0
    );
  } catch {
    return [];
  }
}

export function useCartStorage() {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // stockage indisponible (navigation privée, quota...) - on ignore silencieusement
    }
  }, [items]);

  return [items, setItems] as const;
}
