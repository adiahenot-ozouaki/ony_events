import type { OnyItem } from '../../../constants/ony_interfaces';
import { isVIP } from '../../../constants/ony_products';

export const featuredCategories = [
  'Chaise',
  'Couvert',
  'Habillage',
  'Table',
  'Tente',
  'Service',
] as const;

export function getFeaturedProducts(products: OnyItem[]): OnyItem[] {
  return featuredCategories
    .map((category) => {
      const items = products.filter((item) => item.categorie === category);
      return items.find(isVIP) ?? items[0];
    })
    .filter((item): item is OnyItem => Boolean(item));
}
