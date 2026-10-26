import { describe, expect, it } from 'vitest';
import { calculateDevis } from './pricing';

describe('calculateDevis', () => {
  it('calcule séparément acompte, caution et solde commercial', () => {
    expect(calculateDevis({
      lines: [{ quantity: 10, unitPrice: 28000 }],
      services: 40000,
      delivery: 15000,
      discount: 0,
      depositRate: 0.30,
      securityDeposit: 50000,
    })).toEqual({
      itemsSubtotal: 280000,
      commercialTotal: 335000,
      advanceDue: 100500,
      remainingCommercialBalance: 234500,
      securityDeposit: 50000,
      totalToCollect: 385000,
    });
  });

  it('n’ajoute pas la caution au chiffre commercial soumis à acompte', () => {
    const result = calculateDevis({
      lines: [{ quantity: 1, unitPrice: 100000 }],
      depositRate: 0.3,
      securityDeposit: 50000,
    });
    expect(result.advanceDue).toBe(30000);
    expect(result.totalToCollect).toBe(150000);
  });

  it('rejette une remise supérieure au montant et les données invalides', () => {
    expect(() => calculateDevis({
      lines: [{ quantity: 1, unitPrice: 100 }],
      discount: 101,
      depositRate: 0.3,
      securityDeposit: 0,
    })).toThrow(RangeError);
    expect(() => calculateDevis({
      lines: [{ quantity: -1, unitPrice: 100 }],
      depositRate: 0.3,
      securityDeposit: 0,
    })).toThrow(RangeError);
  });
});
