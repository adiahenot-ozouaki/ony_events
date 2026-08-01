import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { agencyInfo, googleMapsEmbedUrl } from '../../../constants/agency_info';

export function AboutMap() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-20">
        <Reveal className="text-center mb-10">
          <h2 className="font-[var(--font-serif)] text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Nous trouver
          </h2>
        </Reveal>

        <Reveal>
          <div className="rounded-lg overflow-hidden border border-border shadow-sm aspect-[16/7]">
            <iframe
              title={`Localisation ${agencyInfo.nom}`}
              src={googleMapsEmbedUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <Reveal className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/devis"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Demander un devis
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground rounded-md hover:bg-foreground hover:text-white transition-colors"
              >
                Voir le catalogue
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}