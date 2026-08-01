import { motion } from 'motion/react';
import { Reveal } from '../motion/Reveal';
import { agencyInfo } from '../../../constants/agency_info';
import { onyItems } from '../../../constants/ony_items';
import { categoryOrder } from '../../../constants/ony_products';

const STATS = [
  { value: `${onyItems.length}+`, label: 'références au catalogue' },
  { value: `${categoryOrder.length}`, label: "catégories d'équipements" },
  { value: '100%', label: 'sur mesure' },
];

export function AboutIntro() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <Reveal>
            <h2 className="font-[var(--font-serif)] text-3xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Qui sommes-nous
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {agencyInfo.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <motion.div
              className="rounded-lg overflow-hidden aspect-[4/3] shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            >
              <img
                src="/images/tente_special.jpg"
                alt={`Mobilier ${agencyInfo.nom}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </Reveal>
        </div>

        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-lg bg-[var(--secondary)] py-10 px-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-[var(--font-serif)] text-4xl text-[var(--gold)] mb-1"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}