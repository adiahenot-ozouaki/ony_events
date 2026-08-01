// ⚠️ DONNÉES FICTIVES — à remplacer par les vraies informations de l'agence.
// Ce fichier centralise tout ce qui apparaît sur le site (page "À propos",
// pied de page, etc.) : modifie ici, ça se répercute partout.

export const agencyInfo = {
  nom: 'ONY',
  slogan: 'Équipez vos événements avec élégance',

  description: [
    "ONY est une agence gabonaise spécialisée dans la location de mobilier et d'équipements pour événements. Depuis notre création, nous accompagnons mariages, conférences, cérémonies et événements d'entreprise à Libreville et dans ses environs.",
    "Notre catalogue compte plus de 70 références — chaises, couverts, habillages, tables, tentes et prestations de service — sélectionnées pour leur qualité et leur élégance.",
    "Notre mission : rendre chaque événement mémorable, en combinant du mobilier haut de gamme, un service professionnel et une grande flexibilité tarifaire.",
  ],

  adresse: {
    ligne1: 'Quartier Glass, Boulevard Triomphal Omar Bongo',
    ville: 'Libreville',
    pays: 'Gabon',
  },

  telephone: '+241 74 12 34 56',
  email: 'contact@ony.fr',

  horaires: [
    { jour: 'Lundi - Vendredi', heures: '8h00 - 18h00' },
    { jour: 'Samedi', heures: '9h00 - 15h00' },
    { jour: 'Dimanche', heures: 'Fermé' },
  ],

  // Coordonnées approximatives du centre de Libreville — à remplacer par
  // la position exacte de l'agence.
  coordonnees: {
    lat: 0.42255386731038475,
    lng: 9.483275970699863,
  },

  reseaux: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
  },
} as const;

export function googleMapsEmbedUrl() {
  const { lat, lng } = agencyInfo.coordonnees;
  return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

export function googleMapsLinkUrl() {
  const { lat, lng } = agencyInfo.coordonnees;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}