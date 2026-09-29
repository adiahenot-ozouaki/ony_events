import { describe, expect, it } from 'vitest';
import { createQuoteItems } from '../src/app/components/devis/devisUtils';

describe('devisUtils', () => {
  it('transforme les lignes du panier en éléments de devis', () => {
    const lines = [
      {
        product: {
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
        quantite: 3,
      },
      {
        product: {
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
        quantite: 2,
      },
    ];

    expect(createQuoteItems(lines)).toEqual([
      {
        id: 'p-1',
        nom: 'Chaise Napoléon',
        categorie: 'Mobilier',
        quantite: 3,
        prixUnitaire: 2500,
      },
      {
        id: 'p-2',
        nom: 'Enceinte Premium',
        categorie: 'Sonorisation',
        quantite: 2,
        prixUnitaire: 15000,
      },
    ]);
  });

  it('retourne un tableau vide pour des lignes vides', () => {
    expect(createQuoteItems([])).toEqual([]);
  });
});
