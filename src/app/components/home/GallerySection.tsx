import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { galleryImages } from '../../../constants/gallery_images';

export function GallerySection() {
  const previewImages = galleryImages.slice(0, 6);

  return (
    <section id="galerie" className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-20">
        <Reveal className="text-center mb-16">
          <h2 className="font-[var(--font-serif)] text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Galerie
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez nos installations et réalisations
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewImages.map((image, index) => (
            <Reveal key={image.id} delay={(index % 3) * 0.08}>
              <div className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mt-12">
          <motion.div className="inline-block" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/galerie"
              className="inline-flex items-center gap-2 px-8 py-4 border border-foreground rounded-md hover:bg-foreground hover:text-white transition-colors"
            >
              Voir toute la galerie
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}