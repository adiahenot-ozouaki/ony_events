import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { agencyInfo, googleMapsLinkUrl } from '../../../constants/agency_info';

const INFO_CARDS = [
  {
    icon: MapPin,
    label: 'Adresse',
    lines: [agencyInfo.adresse.ligne1, `${agencyInfo.adresse.ville}, ${agencyInfo.adresse.pays}`],
    href: googleMapsLinkUrl(),
  },
  {
    icon: Phone,
    label: 'Téléphone',
    lines: [agencyInfo.telephone],
    href: `tel:${agencyInfo.telephone.replace(/\s/g, '')}`,
  },
  {
    icon: Mail,
    label: 'Email',
    lines: [agencyInfo.email],
    href: `mailto:${agencyInfo.email}`,
  },
  {
    icon: Clock,
    label: 'Horaires',
    lines: agencyInfo.horaires.map((h) => `${h.jour} : ${h.heures}`),
    href: undefined,
  },
];

export function InfoCards() {
  return (
    <section className="py-24 bg-[var(--beige)]">
      <div className="max-w-[1440px] mx-auto px-20">
        <Reveal className="text-center mb-12">
          <h2 className="font-[var(--font-serif)] text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Nous contacter
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INFO_CARDS.map(({ icon: Icon, label, lines, href }, index) => {
            const content = (
              <motion.div
                className="h-full bg-white rounded-lg p-6 text-center shadow-sm"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <div className="w-14 h-14 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-[var(--gold)]" />
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
                {lines.map((line, i) => (
                  <div key={i} className="text-sm">{line}</div>
                ))}
              </motion.div>
            );

            return (
              <Reveal key={label} delay={index * 0.08}>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="block h-full"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}