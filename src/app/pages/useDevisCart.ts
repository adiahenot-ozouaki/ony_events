import { useEffect, useState } from 'react';
import type { OnyItem } from '../../constants/ony_interfaces';
import { fetchProducts } from '../../lib/products';
import type { CartItem } from '../context/CartContext';
import { createQuoteItems } from '../components/devis/devisUtils';
import { resolveCartLines } from '../components/devis/resolveCartLines';

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

  const lines = resolveCartLines(items, products);
  const quoteItems = createQuoteItems(lines);

  return { lines, quoteItems };
}
