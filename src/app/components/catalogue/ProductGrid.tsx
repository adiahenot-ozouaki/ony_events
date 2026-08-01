import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCard } from '../ProductCard';
import { useCart } from '../../context/CartContext';
import type { OnyItem } from '../../../constants/ony_interfaces';
import { categoryLabels, formatProductName, formatPrice, isVIP, productImage } from '../../../constants/ony_products';

interface ProductGridProps {
  items: OnyItem[];
}

export function ProductGrid({ items }: ProductGridProps) {
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-24">
        Aucun produit ne correspond à votre recherche.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <Link to={`/produit/${item.id}`} className="block">
              <ProductCard
                image={productImage(item)}
                name={formatProductName(item)}
                price={formatPrice(item.prix)}
                description={item.description}
                category={categoryLabels[item.categorie] ?? item.categorie}
                isVIP={isVIP(item)}
                onAddToCart={() => addItem(item.id, 1)}
              />
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}