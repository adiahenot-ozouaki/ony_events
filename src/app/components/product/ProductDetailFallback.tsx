import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface ProductDetailFallbackProps {
  error?: string | null;
  isLoading?: boolean;
}

export function ProductDetailFallback({ error, isLoading = false }: ProductDetailFallbackProps) {
  const title = isLoading
    ? 'Chargement du produit'
    : error
      ? 'Impossible de charger le produit'
      : 'Produit introuvable';

  const message = isLoading
    ? 'Veuillez patienter pendant le chargement.'
    : error ?? "Ce produit n'existe pas ou plus.";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 pt-40 pb-24 text-center">
        <h1
          className="font-[var(--font-serif)] text-4xl mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h1>
        <p className="text-muted-foreground mb-8">{message}</p>
        {!isLoading && (
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={18} />
            Retour au catalogue
          </Link>
        )}
      </div>
      <Footer />
    </div>
  );
}
