import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { QuantityInput } from '../components/QuantityInput';
import { useProductDetail } from '../components/useProductDetail';
import { useCart } from '../context/CartContext';
import {
  formatProductName,
  formatPrice,
  productImage,
} from '../../constants/ony_products';
import { usePageTitle } from '../../lib/usePageTitle';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { product, categoryLabel, vip, relatedProducts } = useProductDetail(id);
  const [quantite, setQuantite] = useState(1);

  // Le hook doit être appelé inconditionnellement (règles des Hooks) : on
  // calcule donc un titre différent selon que le produit existe ou non,
  // avant le return anticipé ci-dessous.
  usePageTitle(
    product
      ? {
          title: formatProductName(product),
          description: product.description,
        }
      : {
          title: 'Produit introuvable',
        }
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-20 pt-40 pb-24 text-center">
          <h1 className="font-[var(--font-serif)] text-4xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Produit introuvable
          </h1>
          <p className="text-muted-foreground mb-8">Ce produit n'existe pas ou plus.</p>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={18} />
            Retour au catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-20 pt-32 pb-4">
        <nav className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[var(--gold)] transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-[var(--gold)] transition-colors">Catalogue</Link>
          <span>/</span>
          <span className="text-foreground">{categoryLabel}</span>
        </nav>
      </div>

      <section className="pb-24">
        <div className="max-w-[1440px] mx-auto px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
              <img
                src={productImage(product)}
                alt={formatProductName(product)}
                className="w-full h-full object-cover"
              />
              {vip && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--gold)] text-white text-xs tracking-wider">
                  VIP
                </div>
              )}
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                {categoryLabel}
              </div>
              <h1
                className="font-[var(--font-serif)] text-4xl mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {formatProductName(product)}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              <div className="mb-8">
                <span className="text-3xl font-[var(--font-serif)]" style={{ fontFamily: 'var(--font-serif)' }}>
                  {formatPrice(product.prix)}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  / {product.unite === 'prestation' ? 'prestation' : 'unité'}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm">Quantité</span>
                <QuantityInput value={quantite} onChange={setQuantite} />
              </div>

              <button
                onClick={() => {
                  addItem(product.id, quantite);
                  navigate('/devis');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                <span>Ajouter au devis</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-24 bg-[var(--secondary)]">
          <div className="max-w-[1440px] mx-auto px-20">
            <h2
              className="font-[var(--font-serif)] text-3xl mb-10"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Autres articles {categoryLabel.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  to={`/produit/${item.id}`}
                  image={productImage(item)}
                  name={formatProductName(item)}
                  price={formatPrice(item.prix)}
                  description={item.description}
                  category={item.categorie}
                  isVIP={item.categorie ? undefined : undefined}
                  onAddToCart={() => addItem(item.id, 1)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
