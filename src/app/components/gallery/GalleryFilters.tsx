import { motion } from 'motion/react';

const CATEGORIES = ['Tous', 'Mobilier', 'Décoration', 'Service', 'Extérieur'] as const;
export type GalleryFilter = (typeof CATEGORIES)[number];

interface GalleryFiltersProps {
  active: GalleryFilter;
  onChange: (filter: GalleryFilter) => void;
}

export function GalleryFilters({ active, onChange }: GalleryFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`min-h-11 px-5 py-2.5 rounded-full text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-[var(--gold)] text-white'
                : 'bg-white text-foreground border border-border hover:border-[var(--gold)]'
            }`}
          >
            {cat}
          </motion.button>
        );
      })}
    </div>
  );
}