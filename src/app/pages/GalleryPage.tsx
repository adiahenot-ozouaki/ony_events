import { useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GalleryFilters } from '../components/gallery/GalleryFilters';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { Lightbox } from '../components/gallery/Lightbox';
import { usePageTitle } from '../../lib/usePageTitle';
import { useGalleryFilter } from '../components/gallery/useGalleryFilter';

export function GalleryPage() {
  usePageTitle({
    title: 'Galerie',
    description: 'Découvrez en images nos installations et réalisations : mariages, conférences et cérémonies équipés par ONY.',
  });

  const { activeFilter, setActiveFilter, filteredImages } = useGalleryFilter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            backgroundImage: 'url(/images/decov.jpg)',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
        </motion.div>

        <div className="relative z-10 text-center text-white max-w-7xl mx-auto px-6">
          <motion.h1
            className="font-[var(--font-serif)] text-5xl md:text-6xl mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Galerie
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          >
            Un aperçu de nos installations et réalisations
          </motion.p>
          <br />
          <GalleryFilters active={activeFilter} onChange={setActiveFilter} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-20">
          <GalleryGrid items={filteredImages} onSelect={setLightboxIndex} />
        </div>
      </section>

      <Lightbox
        items={filteredImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <Footer />
    </div>
  );
}
