import { motion } from 'motion/react';
import { onyItems } from '../../../constants/ony_items';
import { categoryOrder, categoryLabels, categoryCount } from '../../../constants/ony_products';

export const catalogueFilters = ['Tous', ...categoryOrder] as const;
export type CatalogueFilter = (typeof catalogueFilters)[number];

interface CategoryFiltersProps {
  activeFilter: CatalogueFilter;
  onChange: (filter: CatalogueFilter) => void;
}

export function CategoryFilters({ activeFilter, onChange }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {catalogueFilters.map((filter) => {
        const isActive = activeFilter === filter;
        const count = filter === 'Tous' ? onyItems.length : categoryCount(filter);
        const label = filter === 'Tous' ? 'Tous' : categoryLabels[filter];
        return (
          <motion.button
            key={filter}
            onClick={() => onChange(filter)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-full text-sm transition-colors ${
              isActive
                ? 'bg-[var(--gold)] text-white'
                : 'bg-white text-foreground border border-border hover:border-[var(--gold)]'
            }`}
          >
            {label} <span className={isActive ? 'text-white/80' : 'text-muted-foreground'}>({count})</span>
          </motion.button>
        );
      })}
    </div>
  );
}