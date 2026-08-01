import { motion } from 'motion/react';
import { agencyInfo } from '../../../constants/agency_info';

export function AboutHero() {
  return (
    <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          backgroundImage: 'url(/images/deco.jpg)',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
      </motion.div>

      <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6">
        <motion.h1
          className="font-[var(--font-serif)] text-5xl md:text-6xl mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          À propos de {agencyInfo.nom}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/90"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          {agencyInfo.slogan}
        </motion.p>
      </div>
    </section>
  );
}