import type { OnyItem } from '../constants/ony_interfaces';

export function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function formatProductName(item: OnyItem) {
  const label = [item.subCategorie, item.nom].filter(Boolean).map(capitalize).join(' ');
  return label || capitalize(item.categorie);
}

export function formatPrice(prix: number) {
  return `${prix.toLocaleString('fr-FR')} FCFA`;
}
