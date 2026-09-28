import { useEffect, useState } from 'react';
import type { OnyItem } from '../../constants/ony_interfaces';
import { categoryLabels } from '../../constants/ony_products';
import { formatProductName } from '../../lib/productFormatting';
import { fetchProducts } from '../../lib/products';
import type { CartItem } from '../context/CartContext';
import type { QuoteFormItem } from '../components/QuoteForm';
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

  const quoteItems: QuoteFormItem[] = lines.map(({ product, quantite }) => ({
    id: product.id,
    nom: formatProductName(product),
    categorie: categoryLabels[product.categorie] ?? product.categorie,
    quantite,
    prixUnitaire: product.prix,
  }));

  return { lines, quoteItems };
}
