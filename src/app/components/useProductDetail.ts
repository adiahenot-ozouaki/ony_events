import { onyItems } from '../../constants/ony_items';
import { categoryLabels, isVIP } from '../../constants/ony_products';

export function useProductDetail(id: string | undefined) {
  const product = onyItems.find((item) => item.id === id);

  const categoryLabel = product
    ? categoryLabels[product.categorie] ?? product.categorie
    : undefined;

  const vip = product ? isVIP(product) : false;

  const relatedProducts = product
    ? onyItems
        .filter((item) => item.categorie === product.categorie && item.id !== product.id)
        .slice(0, 3)
    : [];

  return {
    product,
    categoryLabel,
    vip,
    relatedProducts,
  };
}
