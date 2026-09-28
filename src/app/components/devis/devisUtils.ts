import { categoryLabels } from '../../../constants/ony_products';
import { formatProductName } from '../../../lib/productFormatting';
import type { QuoteFormItem } from '../QuoteForm';
import type { CartLine } from './CartSummary';

export function createQuoteItems(lines: CartLine[]): QuoteFormItem[] {
  return lines.map(({ product, quantite }) => ({
    id: product.id,
    nom: formatProductName(product),
    categorie: categoryLabels[product.categorie] ?? product.categorie,
    quantite,
    prixUnitaire: product.prix,
  }));
}
