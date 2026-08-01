import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '../../../constants/gallery_images';

interface LightboxProps {
  items: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const isOpen = index !== null;
  const current = index !== null ? items[index] : null;

  useEffect(() => {
    if (!isOpen || index === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index! + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((index! - 1 + items.length) % items.length);
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, index, items.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && current && index !== null && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={28} />
          </button>

          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((index - 1 + items.length) % items.length);
              }}
              className="absolute left-4 md:left-8 text-white/80 hover:text-white transition-colors"
              aria-label="Image précédente"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          <motion.img
            key={current.id}
            src={current.src}
            alt={current.alt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full rounded-lg object-contain"
          />

          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((index + 1) % items.length);
              }}
              className="absolute right-4 md:right-8 text-white/80 hover:text-white transition-colors"
              aria-label="Image suivante"
            >
              <ChevronRight size={36} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}