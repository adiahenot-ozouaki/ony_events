import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  to: string;
  image: string;
  name: string;
  price: string;
  description: string;
  category: string;
  isVIP?: boolean;
  onAddToCart?: () => void;
}

/**
 * Carte produit : le lien couvre l'image + les infos (inset-0),
 * le bouton "Ajouter" est positionné en absolute hors du <Link>
 * pour éviter le bouton imbriqué dans un lien (HTML invalide + a11y).
 */
export function ProductCard({
  to,
  image,
  name,
  price,
  description,
  category,
  isVIP,
  onAddToCart,
}: ProductCardProps) {
  return (
    <motion.div
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300"
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* Lien pleine carte — pas de bouton descendant */}
      <Link to={to} className="absolute inset-0 z-0" aria-label={`Voir ${name}`}>
        <span className="sr-only">{name}</span>
      </Link>

      <div className="relative overflow-hidden aspect-[4/3] pointer-events-none">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isVIP && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--gold)] text-white text-xs tracking-wider">
            VIP
          </div>
        )}
      </div>

      <div className="relative p-6 pointer-events-none">
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{category}</div>
        <h3
          className="font-[var(--font-serif)] text-xl mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-2xl font-[var(--font-serif)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {price}
            </span>
            <span className="text-sm text-muted-foreground ml-1">/ unité</span>
          </div>
          {/* Espace réservé pour le bouton (évite le chevauchement du prix) */}
          <div className="w-10 h-10" aria-hidden="true" />
        </div>
      </div>

      {/* Bouton hors du <Link> — z-10 pour rester cliquable au-dessus du lien */}
      {onAddToCart && (
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          className="absolute bottom-6 right-6 z-10 p-2 bg-[var(--gold)] text-white rounded-full hover:opacity-90 transition-opacity pointer-events-auto"
          aria-label={`Ajouter ${name} au devis`}
        >
          <Plus size={20} />
        </motion.button>
      )}
    </motion.div>
  );
}
