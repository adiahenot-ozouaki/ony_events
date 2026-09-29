const GALLERY_IMAGE_BASE_URL =
  'https://apurbjscsrvczmcdwyku.supabase.co/storage/v1/object/public/images';

export type GalleryCategory = 'Mobilier' | 'Décoration' | 'Service' | 'Extérieur';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  categorie: GalleryCategory;
}

// Catégories volontairement neutres : basées sur ce que les noms de
// fichiers indiquent (mobilier, décoration, service, extérieur), pas sur un
// type d'événement que je ne peux pas vérifier sans voir les photos.
// À affiner une fois que tu me dis ce que chaque photo représente vraiment.
export const galleryImages: GalleryImage[] = [
  { id: 'g1', src: `${GALLERY_IMAGE_BASE_URL}/chaise_vip_napoleon_1.jpg`, alt: 'Chaise VIP Napoléon', categorie: 'Mobilier' },
  { id: 'g2', src: `${GALLERY_IMAGE_BASE_URL}/table_ronde_2.jpg`, alt: 'Table ronde stratifiée', categorie: 'Mobilier' },
  { id: 'g3', src: `${GALLERY_IMAGE_BASE_URL}/fauteuil_tradition_double_2.jpg`, alt: 'Fauteuil traditionnel double', categorie: 'Mobilier' },
  { id: 'g4', src: `${GALLERY_IMAGE_BASE_URL}/deco.jpg`, alt: 'Décoration événementielle', categorie: 'Décoration' },
  { id: 'g5', src: `${GALLERY_IMAGE_BASE_URL}/decovi.jpg`, alt: 'Décoration événementielle', categorie: 'Décoration' },
  { id: 'g6', src: `${GALLERY_IMAGE_BASE_URL}/decoiii.jpg`, alt: 'Décoration événementielle', categorie: 'Décoration' },
  { id: 'g7', src: `${GALLERY_IMAGE_BASE_URL}/service_hotesse_2.jpg`, alt: "Service d'hôtesse", categorie: 'Service' },
  { id: 'g8', src: `${GALLERY_IMAGE_BASE_URL}/service_sonorisation_2.jpg`, alt: 'Service de sonorisation', categorie: 'Service' },
  { id: 'g9', src: `${GALLERY_IMAGE_BASE_URL}/service_photo.jpg`, alt: 'Service photo', categorie: 'Service' },
  { id: 'g10', src: `${GALLERY_IMAGE_BASE_URL}/tente_special.jpg`, alt: 'Tente événementielle', categorie: 'Extérieur' },
  { id: 'g11', src: `${GALLERY_IMAGE_BASE_URL}/tente_ext.jpg`, alt: 'Installation de tente en extérieur', categorie: 'Extérieur' },
  { id: 'g12', src: `${GALLERY_IMAGE_BASE_URL}/table_exterieur.jpg`, alt: 'Table en extérieur', categorie: 'Extérieur' },
];
