import { describe, expect, it } from 'vitest';
import { getFeaturedProducts } from '../src/app/components/home/featuredProductsUtils';
import type { OnyItem } from '../src/constants/ony_interfaces';

function createProduct(
  id: string,
  categorie: string,
  subCategorie = 'standard'
): OnyItem {
  return {
    id,
    categorie,
    subCategorie,
    nom: id,
    prix: 1000,
    description: 'Produit de test',
    image: [],
    quantite: 1,
    unite: 'piece',
  };
}

describe('getFeaturedProducts', () => {
  it('préfère le produit VIP dans chaque catégorie', () => {
    const products = [
      createProduct('chaise-standard', 'Chaise'),
      createProduct('chaise-vip', 'Chaise', 'VIP'),
    ];

    expect(getFeaturedProducts(products)).toEqual([products[1]]);
  });

  it('utilise le premier produit quand aucune version VIP n’existe', () => {
    const products = [
      createProduct('table-1', 'Table'),
      createProduct('table-2', 'Table'),
    ];

    expect(getFeaturedProducts(products)).toEqual([products[0]]);
  });

  it('ignore les catégories sans produit', () => {
    const products = [
      createProduct('table-1', 'Table'),
      createProduct('chaise-1', 'Chaise'),
    ];

    expect(getFeaturedProducts(products)).toEqual([products[1], products[0]]);
  });

  it('respecte l’ordre des catégories mises en avant', () => {
    const products = [
      createProduct('service-1', 'Service'),
      createProduct('tente-1', 'Tente'),
      createProduct('chaise-1', 'Chaise'),
    ];

    expect(getFeaturedProducts(products)).toEqual([
      products[2],
      products[1],
      products[0],
    ]);
  });
});
