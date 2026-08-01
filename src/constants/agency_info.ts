// Informations réelles de l'agence ONY. Ce fichier centralise tout ce qui
// apparaît sur le site (page "À propos", pied de page, etc.) : modifie ici,
// ça se répercute partout.

export const agencyInfo = {
  nom: 'ONY',
  slogan: 'Équipez vos événements avec élégance',

  description: [
    "ONY est une agence gabonaise spécialisée dans la location de mobilier et d'équipements pour événements. Depuis notre création, nous accompagnons mariages, conférences, cérémonies et événements d'entreprise à Libreville et dans ses environs.",
    "Notre catalogue compte plus de 70 références — chaises, couverts, habillages, tables, tentes et prestations de service — sélectionnées pour leur qualité et leur élégance.",
    "Notre mission : rendre chaque événement mémorable, en combinant du mobilier haut de gamme, un service professionnel et une grande flexibilité tarifaire.",
  ],

  adresse: {
    ligne1: '239 Rue Nzoughe Mendome Edang, Nzeng-Ayong',
    ville: 'Libreville',
    pays: 'Gabon',
  },

  telephone: '+241 74 80 64 68',
  email: 'ony.locations.services@gmail.com',

  horaires: [
    { jour: 'Lundi - Vendredi', heures: '8h00 - 18h00' },
    { jour: 'Samedi', heures: '9h00 - 15h00' },
    { jour: 'Dimanche', heures: 'Fermé' },
  ],

  coordonnees: {
    lat: 0.42278151509863277,
    lng: 9.483240460882305,
  },

  // Champs vides = pas encore de page active. Le footer masque
  // automatiquement les icônes correspondantes tant qu'un lien n'est pas
  // renseigné ici.
  reseaux: {
    facebook: '',
    instagram: '',
    linkedin: '',
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