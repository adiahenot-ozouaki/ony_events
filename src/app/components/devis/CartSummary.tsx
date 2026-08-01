import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CartLineItem } from './CartLineItem';
import { useCart } from '../../context/CartContext';
import type { OnyItem } from '../../../constants/ony_interfaces';
import { formatPrice } from '../../../constants/ony_products';

export interface CartLine {
  product: OnyItem;
  quantite: number;
}

interface CartSummaryProps {
  lines: CartLine[];
}

export function CartSummary({ lines }: CartSummaryProps) {
  const { clearCart, totalPrice } = useCart();

  if (lines.length === 0) {
    return (
      <div className="text-center py-12">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={18} />
          Parcourir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-border rounded-lg divide-y divide-border mb-6">
        {lines.map(({ product, quantite }) => (
          <CartLineItem key={product.id} product={product} quantite={quantite} />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={clearCart}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          Vider le panier
        </button>
        <div className="text-xl">
          Total :{' '}
          <span className="font-[var(--font-serif)]" style={{ fontFamily: 'var(--font-serif)' }}>
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Ces montants sont indicatifs. Complétez le formulaire ci-dessous pour recevoir un devis définitif.
      </p>
    </div>
  );
}