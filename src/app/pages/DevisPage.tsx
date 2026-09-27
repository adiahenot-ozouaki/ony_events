import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { QuoteForm, type QuoteFormItem } from '../components/QuoteForm';
import { CartSummary, type CartLine } from '../components/devis/CartSummary';
import { useCart } from '../context/CartContext';
import type { OnyItem } from '../../constants/ony_interfaces';
import { categoryLabels, formatProductName } from '../../constants/ony_products';
import { fetchProducts } from '../../lib/products';
import { usePageTitle } from '../../lib/usePageTitle';

export function DevisPage() {
  usePageTitle({
    title: 'Votre devis',
    description: 'Finalisez votre demande de devis pour la location de mobilier et équipements événementiels au Gabon.',
  });

  const { items, totalPrice } = useCart();
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto px-20">
          <div className="text-center mb-12">
            <h1 className="font-[var(--font-serif)] text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Votre devis
            </h1>
            <p className="text-muted-foreground text-lg">
              {lines.length === 0
                ? 'Ajoutez des articles depuis le catalogue pour commencer'
                : `${lines.length} article${lines.length > 1 ? 's' : ''} sélectionné${lines.length > 1 ? 's' : ''}`}
            </p>
          </div>

          <CartSummary lines={lines} />
        </div>
      </section>

      <QuoteForm
        title="Finaliser ma demande"
        subtitle="Vérifiez vos coordonnées, nous vous recontactons avec un devis détaillé"
        items={quoteItems}
        total={totalPrice}
      />

      <Footer />
    </div>
  );
}
