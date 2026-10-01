import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../ProductCard';
import { Reveal } from '../motion/Reveal';
import { useCart } from '../../context/CartContext';
import type { OnyItem } from '../../../constants/ony_interfaces';
import { fetchProducts } from '../../../lib/products';
import {
  categoryLabels,
  isVIP,
  productImage,
} from '../../../constants/ony_products';
import { formatProductName, formatPrice } from '../../../lib/productFormatting';
import { getFeaturedProducts } from './featuredProductsUtils';

export function FeaturedProductsSection() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<OnyItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchProducts().then((data) => {
      if (!cancelled) setProducts(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredProducts = getFeaturedProducts(products);

  return (
    <section id="catalogue" className="py-24 bg-[var(--secondary)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <Reveal className="text-center mb-16">
          <h2
            className="font-[var(--font-serif)] text-5xl mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Notre catalogue
          </h2>
          <p className="text-muted-foreground text-lg">Un aperçu de nos équipements</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <ProductCard
                to={`/produit/${product.id}`}
                image={productImage(product)}
                name={formatProductName(product)}
                price={formatPrice(product.prix)}
                description={product.description}
                category={categoryLabels[product.categorie] ?? product.categorie}
                isVIP={isVIP(product)}
                onAddToCart={() => addItem(product.id, 1)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mt-12">
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-4 border border-foreground rounded-md hover:bg-foreground hover:text-white transition-colors"
            >
              Voir tout le catalogue
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
