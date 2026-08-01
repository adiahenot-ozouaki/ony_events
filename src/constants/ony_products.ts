import { onyItems } from './ony_items';
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

export function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function isVIP(item: OnyItem) {
  return /vip/i.test(item.subCategorie) || /vip/i.test(item.nom);
}

export function formatProductName(item: OnyItem) {
  const label = [item.subCategorie, item.nom].filter(Boolean).map(capitalize).join(' ');
  return label || capitalize(item.categorie);
}

export function formatPrice(prix: number) {
  return `${prix.toLocaleString('fr-FR')} FCFA`;
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

export function categoryCount(cat: string) {
  return onyItems.filter((item) => item.categorie === cat).length;
}

// Catégories mises en avant sur la page d'accueil (aperçu, pas le catalogue entier).
const featuredCategoryOrder = ['Chaise', 'Couvert', 'Habillage', 'Table', 'Tente', 'Service'] as const;

export function pickFeaturedProducts(): OnyItem[] {
  return featuredCategoryOrder
    .map((cat) => {
      const items = onyItems.filter((item) => item.categorie === cat);
      return items.find(isVIP) ?? items[0];
    })
    .filter((item): item is OnyItem => Boolean(item));
}