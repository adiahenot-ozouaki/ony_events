import test from 'node:test';
import assert from 'node:assert/strict';
import {
  capitalize,
  isVIP,
  formatProductName,
  formatPrice,
  productImage,
  productImages,
} from '../src/constants/ony_products.ts';

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

test('capitalize met la première lettre en majuscule', () => {
  assert.equal(capitalize('napoleon'), 'Napoleon');
  assert.equal(capitalize(''), '');
});

test('isVIP détecte VIP dans la sous-catégorie ou le nom', () => {
  assert.equal(isVIP({ ...baseProduct, subCategorie: 'VIP' }), true);
  assert.equal(isVIP({ ...baseProduct, subCategorie: 'standard', nom: 'Fauteuil VIP' }), true);
  assert.equal(isVIP(baseProduct), false);
});

test('formatProductName construit le nom à partir de la sous-catégorie et du nom', () => {
  assert.equal(
    formatProductName({ ...baseProduct, subCategorie: 'vip', nom: 'napoleon' }),
    'Vip Napoleon'
  );
  assert.equal(
    formatProductName({ ...baseProduct, subCategorie: '', nom: '', categorie: 'chaise' }),
    'Chaise'
  );
});

test('formatPrice formate un montant en FCFA', () => {
  assert.equal(formatPrice(12500), '12 500 FCFA');
  assert.equal(formatPrice(0), '0 FCFA');
});

test('productImage utilise une image disponible', () => {
  const product = {
    ...baseProduct,
    image: ['image-inexistante', 'chaise_vip_napoleon_1'],
  };

  assert.equal(productImage(product), '/images/chaise_vip_napoleon_1.jpg');
});

test('productImage utilise le placeholder si aucune image n’est disponible', () => {
  const product = {
    ...baseProduct,
    image: ['image-inexistante'],
  };

  assert.equal(productImage(product), '/images/fauteuil_tradition_simple_1.jpg');
});

test('productImages retourne uniquement les images disponibles', () => {
  const product = {
    ...baseProduct,
    image: ['image-inexistante', 'chaise_vip_napoleon_1', 'chaise_vip_napoleon_2'],
  };

  assert.deepEqual(productImages(product), [
    '/images/chaise_vip_napoleon_1.jpg',
    '/images/chaise_vip_napoleon_2.jpg',
  ]);
});
