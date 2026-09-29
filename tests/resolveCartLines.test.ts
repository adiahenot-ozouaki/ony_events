import { describe, expect, it } from 'vitest';
import { resolveCartLines } from '../src/app/components/devis/resolveCartLines';

const products = [
  {
    id: 'p-1',
    categorie: 'Chaise',
    subCategorie: 'chaise',
    nom: 'Napoléon',
    prix: 2500,
    description: 'Chaise élégante',
    image: 'chaise.jpg',
    quantite: '1',
    unite: 'pièce',
  },
  {
    id: 'p-2',
    categorie: 'Tente',
    subCategorie: 'enceinte',
    nom: 'Premium',
    prix: 15000,
    description: 'Enceinte événementielle',
    image: 'enceinte.jpg',
    quantite: '1',
    unite: 'pièce',
  },
];

describe('resolveCartLines', () => {
  it('résout les articles du panier vers les produits du catalogue', () => {
    const items = [
      { id: 'p-1', quantite: 3 },
      { id: 'p-2', quantite: 2 },
    ];

    expect(resolveCartLines(items, products)).toEqual([
      { product: products[0], quantite: 3 },
      { product: products[1], quantite: 2 },
    ]);
  });

  it('ignore les articles dont le produit est absent du catalogue', () => {
    const items = [
      { id: 'p-1', quantite: 3 },
      { id: 'unknown', quantite: 4 },
    ];

    expect(resolveCartLines(items, products)).toEqual([
      { product: products[0], quantite: 3 },
    ]);
  });

  it('retourne un tableau vide sans articles', () => {
    expect(resolveCartLines([], products)).toEqual([]);
  });
});
