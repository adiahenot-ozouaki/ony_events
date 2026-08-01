import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <motion.button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        whileHover={{ scale: page === 1 ? 1 : 1.05 }}
        whileTap={{ scale: page === 1 ? 1 : 0.95 }}
        className="p-2.5 rounded-md border border-border text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--gold)] transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft size={18} />
      </motion.button>

      {pages.map((p) => (
        <motion.button
          key={p}
          onClick={() => onChange(p)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-10 h-10 rounded-md text-sm transition-colors ${
            p === page
              ? 'bg-[var(--gold)] text-white'
              : 'border border-border text-foreground hover:border-[var(--gold)]'
          }`}
        >
          {p}
        </motion.button>
      ))}

      <motion.button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        whileHover={{ scale: page === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: page === totalPages ? 1 : 0.95 }}
        className="p-2.5 rounded-md border border-border text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--gold)] transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}