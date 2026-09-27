import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { QuoteForm } from '../components/QuoteForm';
import { CartSummary } from '../components/devis/CartSummary';
import { useCart } from '../context/CartContext';
import { useDevisCart } from './useDevisCart';
import { usePageTitle } from '../../lib/usePageTitle';

export function DevisPage() {
  usePageTitle({
    title: 'Votre devis',
    description: 'Finalisez votre demande de devis pour la location de mobilier et équipements événementiels au Gabon.',
  });

  const { items, totalPrice } = useCart();
  const { lines, quoteItems } = useDevisCart(items);

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
