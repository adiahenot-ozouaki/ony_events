import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useCartStorage', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
  });

  async function getUseCartStorage() {
    const module = await import('../src/app/context/useCartStorage');
    return module.useCartStorage;
  }

  it('retourne un panier vide si aucun panier n’est sauvegardé', async () => {
    const useCartStorage = await getUseCartStorage();

    const { result } = renderHook(() => useCartStorage());

    expect(result.current[0]).toEqual([]);
  });

  it('restaure un panier valide depuis localStorage', async () => {
    const storedCart = [
      { id: 'p-1', quantite: 2 },
      { id: 'p-2', quantite: 1 },
    ];

    window.localStorage.setItem('ony_cart', JSON.stringify(storedCart));

    const useCartStorage = await getUseCartStorage();

    const { result } = renderHook(() => useCartStorage());

    expect(result.current[0]).toEqual(storedCart);
  });

  it('retourne un panier vide si le JSON est invalide', async () => {
    window.localStorage.setItem('ony_cart', '{invalid-json');

    const useCartStorage = await getUseCartStorage();

    const { result } = renderHook(() => useCartStorage());

    expect(result.current[0]).toEqual([]);
  });

  it('retourne un panier vide si la donnée sauvegardée n’est pas un tableau', async () => {
    window.localStorage.setItem('ony_cart', JSON.stringify({ id: 'p-1', quantite: 2 }));

    const useCartStorage = await getUseCartStorage();

    const { result } = renderHook(() => useCartStorage());

    expect(result.current[0]).toEqual([]);
  });

  it('filtre les éléments invalides du panier sauvegardé', async () => {
    const storedCart = [
      { id: 'p-1', quantite: 2 },
      { id: 'p-2', quantite: '1' },
      { id: 42, quantite: 1 },
      null,
      { id: 'p-3' },
      { id: 'p-4', quantite: 3 },
    ];

    window.localStorage.setItem('ony_cart', JSON.stringify(storedCart));

    const useCartStorage = await getUseCartStorage();

    const { result } = renderHook(() => useCartStorage());

    expect(result.current[0]).toEqual([
      { id: 'p-1', quantite: 2 },
      { id: 'p-4', quantite: 3 },
    ]);
  });

  it('persiste les modifications du panier dans localStorage', async () => {
    const useCartStorage = await getUseCartStorage();

    const { result } = renderHook(() => useCartStorage());

    act(() => {
      result.current[1]([
        { id: 'p-1', quantite: 2 },
        { id: 'p-2', quantite: 1 },
      ]);
    });

    expect(JSON.parse(window.localStorage.getItem('ony_cart') ?? 'null')).toEqual([
      { id: 'p-1', quantite: 2 },
      { id: 'p-2', quantite: 1 },
    ]);
  });

  it('ignore une erreur de localStorage lors de la persistance', async () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Quota dépassé');
      });

    const useCartStorage = await getUseCartStorage();

    expect(() => renderHook(() => useCartStorage())).not.toThrow();

    setItemSpy.mockRestore();
  });
});
