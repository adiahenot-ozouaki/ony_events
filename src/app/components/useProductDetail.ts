import { useEffect, useState } from 'react';
import { categoryLabels, isVIP } from '../../constants/ony_products';
import type { OnyItem } from '../../constants/ony_interfaces';
import { fetchProducts } from '../../lib/products';

export function useProductDetail(id: string | undefined) {
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

  const product = products.find((item) => item.id === id);

  const categoryLabel = product
    ? categoryLabels[product.categorie] ?? product.categorie
    : undefined;

  const vip = product ? isVIP(product) : false;

  const relatedProducts = product
    ? products
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
