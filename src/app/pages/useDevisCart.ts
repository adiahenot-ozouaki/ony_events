import { useEffect, useState } from 'react';
import type { OnyItem } from '../../constants/ony_interfaces';
import { fetchProducts } from '../../lib/products';
import type { CartItem } from '../context/CartContext';
import { createQuoteItems } from '../components/devis/devisUtils';
import type { CartLine } from '../components/devis/CartSummary';

export function useDevisCart(items: CartItem[]) {
  const [products, setProducts] = useState<OnyItem[]>([]);

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((loadedProducts) => {
        if (active) setProducts(loadedProducts);
      })
      .catch(() => {
        if (active) setProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const lines: CartLine[] = items
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) return null;
      return { product, quantite: cartItem.quantite };
    })
    .filter((line): line is CartLine => Boolean(line));

  const quoteItems = createQuoteItems(lines);

  return { lines, quoteItems };
}
