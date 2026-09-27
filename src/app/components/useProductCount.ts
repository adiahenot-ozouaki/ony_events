import { useEffect, useState } from 'react';
import { fetchProducts } from '../../lib/products';

export function useProductCount() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((products) => {
        if (active) setProductCount(products.length);
      })
      .catch(() => {
        if (active) setProductCount(0);
      });

    return () => {
      active = false;
    };
  }, []);

  return productCount;
}
