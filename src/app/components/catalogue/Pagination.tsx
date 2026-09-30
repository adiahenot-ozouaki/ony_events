import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);
  if (page > 1) pages.add(page - 1);
  if (page < totalPages) pages.add(page + 1);
  if (page <= 3) {
    pages.add(2);
    pages.add(3);
  }
  if (page >= totalPages - 2) {
    pages.add(totalPages - 2);
    pages.add(totalPages - 1);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];

  sortedPages.forEach((currentPage, index) => {
    if (index > 0 && currentPage - sortedPages[index - 1] > 1) {
      result.push('ellipsis');
    }
    result.push(currentPage);
  });

  return result;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(page, totalPages);

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

      <div className="flex items-center gap-2">
        {pages.map((p, index) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
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
              aria-label={`Aller à la page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </motion.button>
          )
        )}
      </div>

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