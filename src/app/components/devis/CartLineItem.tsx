import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { QuantityInput } from '../QuantityInput';
import type { OnyItem } from '../../../constants/ony_interfaces';
import { categoryLabels, formatProductName, formatPrice, productImage } from '../../../constants/ony_products';

interface CartLineItemProps {
  product: OnyItem;
  quantite: number;
}

export function CartLineItem({ product, quantite }: CartLineItemProps) {
  const { updateQuantite, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 p-4">
      <img
        src={productImage(product)}
        alt={formatProductName(product)}
        loading="lazy"
        decoding="async"
        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {categoryLabels[product.categorie] ?? product.categorie}
        </div>
        <div className="truncate">{formatProductName(product)}</div>
        <div className="text-sm text-muted-foreground">{formatPrice(product.prix)} / unité</div>
      </div>

      <QuantityInput
        value={quantite}
        onChange={(newQuantite) => updateQuantite(product.id, newQuantite)}
        size="sm"
      />

      <div className="w-28 text-right font-[var(--font-serif)]" style={{ fontFamily: 'var(--font-serif)' }}>
        {formatPrice(product.prix * quantite)}
      </div>

      <button
        onClick={() => removeItem(product.id)}
        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Retirer cet article"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
