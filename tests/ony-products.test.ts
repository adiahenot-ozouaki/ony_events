import { describe, expect, it } from 'vitest';
import { isVIP, productImage, productImages } from '../src/constants/ony_products';
import {
  capitalize,
  formatProductName,
  formatPrice,
} from '../src/lib/productFormatting';

const baseProduct = {
  id: 'test-1',
  categorie: 'Chaise',
  subCategorie: 'standard',
  nom: 'napoleon',
  prix: 12500,
  description: 'Produit de test',
  image: [],
  quantite: 1,
  unite: 'piece' as const,
};

describe('ony_products', () => {
  it('capitalize met la première lettre en majuscule', () => {
    expect(capitalize('napoleon')).toBe('Napoleon');
    expect(capitalize('')).toBe('');
  });

  it('isVIP détecte VIP dans la sous-catégorie ou le nom', () => {
    expect(isVIP({ ...baseProduct, subCategorie: 'VIP' })).toBe(true);
    expect(isVIP({ ...baseProduct, subCategorie: 'standard', nom: 'Fauteuil VIP' })).toBe(true);
    expect(isVIP(baseProduct)).toBe(false);
  });

  it('formatProductName construit le nom à partir de la sous-catégorie et du nom', () => {
    expect(
      formatProductName({ ...baseProduct, subCategorie: 'vip', nom: 'napoleon' })
    ).toBe('Vip Napoleon');

    expect(
      formatProductName({ ...baseProduct, subCategorie: '', nom: '', categorie: 'chaise' })
    ).toBe('Chaise');
  });

  it('formatPrice formate un montant en FCFA', () => {
    expect(formatPrice(12500)).toBe('12 500 FCFA');
    expect(formatPrice(0)).toBe('0 FCFA');
  });

  it('productImage utilise une image disponible', () => {
    const product = {
      ...baseProduct,
      image: ['image-inexistante', 'chaise_vip_napoleon_1'],
    };

    expect(productImage(product)).toBe('/images/chaise_vip_napoleon_1.jpg');
  });

  it('productImage utilise le placeholder si aucune image n’est disponible', () => {
    const product = {
      ...baseProduct,
      image: ['image-inexistante'],
    };

    expect(productImage(product)).toBe('/images/fauteuil_tradition_simple_1.jpg');
  });

  it('productImages retourne uniquement les images disponibles', () => {
    const product = {
      ...baseProduct,
      image: ['image-inexistante', 'chaise_vip_napoleon_1', 'chaise_vip_napoleon_2'],
    };

    expect(productImages(product)).toEqual([
      '/images/chaise_vip_napoleon_1.jpg',
      '/images/chaise_vip_napoleon_2.jpg',
    ]);
  });
});
