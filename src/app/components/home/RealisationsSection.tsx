const REALISATIONS = [
  {
    title: 'Mariages',
    description: 'Des cérémonies inoubliables avec notre mobilier élégant',
    image: 'https://images.unsplash.com/photo-1769812344142-00c7f6584885?w=800',
  },
  {
    title: 'Conférences',
    description: 'Équipements professionnels pour vos événements corporatifs',
    image: 'https://images.unsplash.com/photo-1735547928495-262fc71a4677?w=800',
  },
  {
    title: 'Cérémonies',
    description: 'Une atmosphère unique pour vos moments spéciaux',
    image: 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=800',
  },
];

export function RealisationsSection() {
  return (
    <section className="py-24 bg-[var(--beige)]">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="text-center mb-16">
          <h2 className="font-[var(--font-serif)] text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Nos réalisations
          </h2>
          <p className="text-muted-foreground text-lg">
            Mariages, conférences et cérémonies d'exception
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {REALISATIONS.map(({ title, description, image }) => (
            <div key={title} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
              <img
                src={image}
                alt={title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-[var(--font-serif)] text-3xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    {title}
                  </h3>
                  <p className="text-white/90 text-sm">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
