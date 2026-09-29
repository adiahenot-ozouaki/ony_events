import type { OnyItem } from '../../../constants/ony_interfaces';
import type { CartItem } from '../../context/CartContext';
import type { CartLine } from './CartSummary';

export function resolveCartLines(items: CartItem[], products: OnyItem[]): CartLine[] {
  return items
    .map((cartItem) => {
      const product = products.find((item) => item.id === cartItem.id);
      if (!product) return null;
      return { product, quantite: cartItem.quantite };
    })
    .filter((line): line is CartLine => Boolean(line));
}
