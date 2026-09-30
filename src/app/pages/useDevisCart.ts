import type { OnyItem } from '../../constants/ony_interfaces';
import type { CartItem } from '../context/CartContext';
import { createQuoteItems } from '../components/devis/devisUtils';
import { resolveCartLines } from '../components/devis/resolveCartLines';

export function useDevisCart(items: CartItem[], products: OnyItem[]) {
  const lines = resolveCartLines(items, products);
  const quoteItems = createQuoteItems(lines);

  return { lines, quoteItems };
}
