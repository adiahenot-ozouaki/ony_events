import { Award, Users, Clock, Star } from 'lucide-react';

const REASONS = [
  {
    icon: Award,
    title: 'Qualité premium',
    description: 'Matériaux haut de gamme sélectionnés avec soin',
  },
  {
    icon: Users,
    title: 'Service professionnel',
    description: 'Équipe experte à votre écoute',
  },
  {
    icon: Clock,
    title: 'Flexibilité',
    description: 'Tarifs adaptés à votre budget',
  },
  {
    icon: Star,
    title: 'Expertise événementielle',
    description: "Plus de 10 ans d'expérience",
  },
];

export function WhyChooseUsSection() {
  return (
    <section id="apropos" className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="text-center mb-16">
          <h2 className="font-[var(--font-serif)] text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Pourquoi nous choisir
          </h2>
          <p className="text-muted-foreground text-lg">
            Une expertise reconnue dans l'événementiel de luxe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon size={32} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-[var(--font-serif)] text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                {title}
              </h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}