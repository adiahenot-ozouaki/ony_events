const REALISATIONS = [
  {
    title: 'Mariages',
    description: 'Des cérémonies inoubliables avec notre mobilier élégant',
    image: 'https://images.unsplash.com/photo-1769812344142-00c7f6584885',
  },
  {
    title: 'Conférences',
    description: 'Équipements professionnels pour vos événements corporatifs',
    image: 'https://images.unsplash.com/photo-1735547928495-262fc71a4677',
  },
  {
    title: 'Cérémonies',
    description: 'Une atmosphère unique pour vos moments spéciaux',
    image: 'https://images.unsplash.com/photo-1763553113391-a659bee36e06',
  },
];

// Ajoute les paramètres de l'API dynamique Unsplash (compatible imgix) :
// - w : largeur cible en pixels
// - q=75 : compression correcte sans perte visible notable
// - auto=format : laisse Unsplash servir du WebP/AVIF aux navigateurs qui
//   le supportent, JPEG sinon, sans qu'on ait à gérer plusieurs formats
// - fit=crop : garde le cadrage 4/3 du conteneur plutôt que de déformer
function unsplashUrl(baseUrl: string, width: number) {
  return `${baseUrl}?w=${width}&q=75&auto=format&fit=crop`;
}

// Un mobile affiche cette image sur ~100% de la largeur d'écran, un desktop
// (grille à 3 colonnes à partir de md) sur environ 1/3 — inutile de lui
// envoyer les mêmes octets qu'à un mobile en pleine largeur.
const RESPONSIVE_WIDTHS = [400, 800, 1200];
const IMG_SIZES = '(max-width: 768px) 100vw, 33vw';

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
                src={unsplashUrl(image, 800)}
                srcSet={RESPONSIVE_WIDTHS.map((w) => `${unsplashUrl(image, w)} ${w}w`).join(', ')}
                sizes={IMG_SIZES}
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
