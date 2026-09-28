import type { OnyItem } from './ony_interfaces';
import { availableProductImages } from './product_images';

export const categoryOrder = ['Chaise', 'Couvert', 'Habillage', 'Plateau', 'Table', 'Tente', 'Service'] as const;

export const categoryLabels: Record<string, string> = {
  Chaise: 'Chaises',
  Couvert: 'Couverts',
  Habillage: 'Habillages',
  Plateau: 'Plateaux & service',
  Table: 'Tables',
  Tente: 'Tentes',
  Service: 'Prestations',
};

// Image de repère par catégorie : utilisée pour les vignettes de catégorie
// et comme repli pour les produits qui n'ont pas encore de photo assignée
// dans leur champ `image`.
export const categoryPlaceholderImages: Record<string, string> = {
  Chaise: '/images/fauteuil_tradition_simple_1.jpg',
  Couvert: '/images/couvert_complet_churchill.jpg',
  Habillage: '/images/jupon_multi_fleur_afrik.jpg',
  Plateau: '/images/chaffing_dish_rectangle_4.jpg',
  Table: '/images/table_ronde_2.jpg',
  Tente: '/images/tente_special.jpg',
  Service: '/images/service_hotesse_3.jpg',
};

export function isVIP(item: OnyItem) {
  return /vip/i.test(item.subCategorie) || /vip/i.test(item.nom);
}

export function productImage(item: OnyItem) {
  const match = item.image.find((filename) => availableProductImages.has(filename));
  if (match) {
    return `/images/${match}.jpg`;
  }
  return categoryPlaceholderImages[item.categorie];
}

// Toutes les photos disponibles pour ce produit (pour une future galerie
// produit) — vide si aucune ne figure dans le manifeste.
export function productImages(item: OnyItem): string[] {
  return item.image
    .filter((filename) => availableProductImages.has(filename))
    .map((filename) => `/images/${filename}.jpg`);
}
