import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="accueil" className="relative h-screen flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          backgroundImage: 'url(/images/deco.jpg)',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <motion.h1
          className="font-[var(--font-serif)] text-6xl md:text-7xl mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          Équipez vos événements avec élégance
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-white/90"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          Chaises, couverts, mobilier VIP et équipements professionnels
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/catalogue"
              className="px-8 py-4 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Voir le catalogue
              <ArrowRight size={20} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#devis"
              className="px-8 py-4 bg-white text-black rounded-md hover:bg-white/90 transition-colors inline-flex items-center justify-center"
            >
              Demander un devis
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}