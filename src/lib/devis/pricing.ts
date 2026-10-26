/**
 * Calcul de devis ONY, sans dépendance UI.
 * Les montants sont exprimés en FCFA entiers.
 * Le calcul serveur doit rester l'autorité pour tout devis officiel.
 */
export type DevisLine = {
  quantity: number;
  unitPrice: number;
};

export type DevisPricingInput = {
  lines: DevisLine[];
  services?: number;
  delivery?: number;
  discount?: number;
  depositRate: number;
  securityDeposit: number;
};

export type DevisPricingResult = {
  itemsSubtotal: number;
  commercialTotal: number;
  advanceDue: number;
  remainingCommercialBalance: number;
  securityDeposit: number;
  totalToCollect: number;
};

function nonNegativeInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${field} doit être un entier positif ou nul`);
  }
  return value;
}

export function calculateDevis(input: DevisPricingInput): DevisPricingResult {
  if (!Array.isArray(input.lines)) throw new TypeError('Lignes de devis invalides');
  if (!Number.isFinite(input.depositRate) || input.depositRate < 0 || input.depositRate > 1) {
    throw new RangeError('Taux d’acompte invalide');
  }

  const itemsSubtotal = input.lines.reduce((sum, line) => {
    const quantity = nonNegativeInteger(line.quantity, 'Quantité');
    const unitPrice = nonNegativeInteger(line.unitPrice, 'Prix unitaire');
    return nonNegativeInteger(sum + quantity * unitPrice, 'Sous-total');
  }, 0);
  const services = nonNegativeInteger(input.services ?? 0, 'Prestations');
  const delivery = nonNegativeInteger(input.delivery ?? 0, 'Livraison');
  const discount = nonNegativeInteger(input.discount ?? 0, 'Remise');
  const securityDeposit = nonNegativeInteger(input.securityDeposit, 'Caution');
  const beforeDiscount = nonNegativeInteger(itemsSubtotal + services + delivery, 'Total brut');

  if (discount > beforeDiscount) throw new RangeError('Remise supérieure au total brut');

  const commercialTotal = beforeDiscount - discount;
  const advanceDue = Math.round(commercialTotal * input.depositRate);
  const totalToCollect = nonNegativeInteger(commercialTotal + securityDeposit, 'Total à encaisser');

  return {
    itemsSubtotal,
    commercialTotal,
    advanceDue,
    remainingCommercialBalance: commercialTotal - advanceDue,
    securityDeposit,
    totalToCollect,
  };
}
