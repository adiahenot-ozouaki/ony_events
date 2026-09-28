import { describe, expect, it } from 'vitest';
import {
  filterProducts,
  getCategoryCounts,
  paginateProducts,
} from '../src/app/components/catalogue/catalogueUtils';
import type { CatalogueFilter } from '../src/app/components/catalogue/CategoryFilters';
import type { OnyItem } from '../src/constants/ony_interfaces';

const products: OnyItem[] = [
  {
    id: 'p-1',
    categorie: 'Table',
    subCategorie: 'ronde',
    nom: 'Table ronde',
    prix: 25000,
    description: 'Grande table pour réception',
    image: ['table'],
    quantite: 1,
    unite: 'piece',
  },
  {
    id: 'p-2',
    categorie: 'Table',
    subCategorie: 'haute',
    nom: 'Table haute',
    prix: 30000,
    description: 'Table pour cocktail',
    image: ['table-haute'],
    quantite: 1,
    unite: 'piece',
  },
  {
    id: 'p-3',
    categorie: 'Chaise',
    subCategorie: 'standard',
    nom: 'Chaise standard',
    prix: 5000,
    description: 'Chaise confortable',
    image: ['chaise'],
    quantite: 1,
    unite: 'piece',
  },
];

const filters = ['Tous', 'Table', 'Chaise'] as const satisfies readonly CatalogueFilter[];

describe('filterProducts', () => {
  it('retourne tous les produits sans filtre ni recherche', () => {
    expect(filterProducts(products, 'Tous', '')).toEqual(products);
  });

  it('filtre par catégorie', () => {
    expect(filterProducts(products, 'Table', '')).toEqual(products.slice(0, 2));
  });

  it('recherche sans tenir compte de la casse et des espaces', () => {
    expect(filterProducts(products, 'Tous', '  COCKTAIL  ')).toEqual([products[1]]);
  });

  it('recherche dans les différents champs du produit', () => {
    expect(filterProducts(products, 'Tous', 'confortable')).toEqual([products[2]]);
  });

  it('combine catégorie et recherche', () => {
    expect(filterProducts(products, 'Table', 'cocktail')).toEqual([products[1]]);
  });
});

describe('paginateProducts', () => {
  it('découpe les résultats et calcule la plage affichée', () => {
    const items = Array.from({ length: 7 }, (_, index) => products[index % products.length]);

    expect(paginateProducts(items, 2, 3)).toEqual({
      totalPages: 3,
      paginatedItems: items.slice(3, 6),
      rangeStart: 4,
      rangeEnd: 6,
    });
  });

  it('retourne une page unique pour une liste vide', () => {
    expect(paginateProducts([], 1, 15)).toEqual({
      totalPages: 1,
      paginatedItems: [],
      rangeStart: 0,
      rangeEnd: 0,
    });
  });
});

describe('getCategoryCounts', () => {
  it('compte les produits par catégorie et totalise Tous', () => {
    expect(getCategoryCounts(products, filters)).toEqual({
      Tous: 3,
      Table: 2,
      Chaise: 1,
    });
  });

  it('ignore les catégories absentes des filtres', () => {
    const productsWithUnknownCategory = [
      ...products,
      { ...products[0], id: 'p-4', categorie: 'Décoration' },
    ];

    expect(getCategoryCounts(productsWithUnknownCategory, filters)).toEqual({
      Tous: 4,
      Table: 2,
      Chaise: 1,
    });
  });
});
