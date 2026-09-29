import type { OnyItem } from './ony_interfaces';
import { availableProductImages } from './product_images';

const PRODUCT_IMAGE_BASE_URL =
  'https://apurbjscsrvczmcdwyku.supabase.co/storage/v1/object/public/images';

export const categoryOrder = ['Chaise', 'Couvert', 'Habillage', 'Plateau', 'Table', 'Tente', 'Service'] as const;

export type ProductCategory = (typeof categoryOrder)[number];

export const categoryLabels: Record<ProductCategory, string> = {
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
export const categoryPlaceholderImages: Record<ProductCategory, string> = {
  Chaise: `${PRODUCT_IMAGE_BASE_URL}/fauteuil_tradition_simple_1.jpg`,
  Couvert: `${PRODUCT_IMAGE_BASE_URL}/couvert_complet_churchill.jpg`,
  Habillage: `${PRODUCT_IMAGE_BASE_URL}/jupon_multi_fleur_afrik.jpg`,
  Plateau: `${PRODUCT_IMAGE_BASE_URL}/chaffing_dish_rectangle_4.jpg`,
  Table: `${PRODUCT_IMAGE_BASE_URL}/table_ronde_2.jpg`,
  Tente: `${PRODUCT_IMAGE_BASE_URL}/tente_special.jpg`,
  Service: `${PRODUCT_IMAGE_BASE_URL}/service_hotesse_3.jpg`,
};

export function isVIP(item: OnyItem) {
  return /vip/i.test(item.subCategorie) || /vip/i.test(item.nom);
}

export function productImage(item: OnyItem) {
  const match = item.image.find((filename) => availableProductImages.has(filename));
  if (match) {
    return `${PRODUCT_IMAGE_BASE_URL}/${match}.jpg`;
  }
  return categoryPlaceholderImages[item.categorie];
}

// Toutes les photos disponibles pour ce produit (pour une future galerie
// produit) — vide si aucune ne figure dans le manifeste.
export function productImages(item: OnyItem): string[] {
  return item.image
    .filter((filename) => availableProductImages.has(filename))
    .map((filename) => `${PRODUCT_IMAGE_BASE_URL}/${filename}.jpg`);
}
