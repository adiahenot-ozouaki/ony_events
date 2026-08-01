import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  description: string;
  category: string;
  isVIP?: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({ image, name, price, description, category, isVIP, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isVIP && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--gold)] text-white text-xs tracking-wider">
            VIP
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{category}</div>
        <h3 className="font-[var(--font-serif)] text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-[var(--font-serif)]" style={{ fontFamily: 'var(--font-serif)' }}>{price}</span>
            <span className="text-sm text-muted-foreground ml-1">/ unité</span>
          </div>
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            className="p-2 bg-[var(--gold)] text-white rounded-full hover:opacity-90 transition-opacity"
            aria-label="Ajouter au devis"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}