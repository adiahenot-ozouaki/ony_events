import { useEffect, useState } from 'react';
import { categoryLabels, isVIP } from '../../constants/ony_products';
import type { OnyItem } from '../../constants/ony_interfaces';
import { fetchProducts } from '../../lib/products';

export function useProductDetail(id: string | undefined) {
  const [products, setProducts] = useState<OnyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((fetchedProducts) => {
        if (!cancelled) setProducts(fetchedProducts);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossible de charger le produit.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
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
    error,
    isLoading,
  };
}
