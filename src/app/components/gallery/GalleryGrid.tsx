import { AnimatePresence, motion } from 'motion/react';
import type { GalleryImage } from '../../../constants/gallery_images';

interface GalleryGridProps {
  items: GalleryImage[];
  onSelect: (index: number) => void;
}

export function GalleryGrid({ items, onSelect }: GalleryGridProps) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-24">
        Aucune photo dans cette catégorie pour l'instant.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((image, index) => (
          <motion.button
            key={image.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            onClick={() => onSelect(index)}
            className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer text-left"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">{image.categorie}</span>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}