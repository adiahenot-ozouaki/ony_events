import { beforeEach, describe, expect, it, vi } from 'vitest';

const hookRuntime = vi.hoisted(() => ({
  effect: undefined as (() => void) | undefined,
  state: undefined as unknown,
  render: undefined as (() => unknown) | undefined,
}));

vi.mock('react', () => ({
  useState: (initialValue: unknown) => {
    hookRuntime.state =
      hookRuntime.state === undefined
        ? typeof initialValue === 'function'
          ? initialValue()
          : initialValue
        : hookRuntime.state;

    const setState = (nextValue: unknown) => {
      hookRuntime.state =
        typeof nextValue === 'function'
          ? nextValue(hookRuntime.state)
          : nextValue;

      hookRuntime.render?.();
    };

    return [hookRuntime.state, setState];
  },
  useEffect: (effect: () => void) => {
    hookRuntime.effect = effect;
    effect();
  },
}));

function createLocalStorageMock() {
  const storage = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
  };
}

describe('useCartStorage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    hookRuntime.effect = undefined;
    hookRuntime.state = undefined;
    hookRuntime.render = undefined;

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        localStorage: createLocalStorageMock(),
      },
    });
  });

  async function getUseCartStorage() {
    const module = await import('../src/app/context/useCartStorage');
    return module.useCartStorage;
  }

  async function renderUseCartStorage() {
    const useCartStorage = await getUseCartStorage();

    let result = useCartStorage();
    hookRuntime.render = () => {
      result = useCartStorage();
      return result;
    };

    return {
      get result() {
        return result;
      },
    };
  }

  it('retourne un panier vide si aucun panier n’est sauvegardé', async () => {
    const { result } = await renderUseCartStorage();

    expect(result[0]).toEqual([]);
  });

  it('restaure un panier valide depuis localStorage', async () => {
    const storedCart = [
      { id: 'p-1', quantite: 2 },
      { id: 'p-2', quantite: 1 },
    ];

    window.localStorage.setItem('ony_cart', JSON.stringify(storedCart));

    const { result } = await renderUseCartStorage();

    expect(result[0]).toEqual(storedCart);
  });

  it('retourne un panier vide si le JSON est invalide', async () => {
    window.localStorage.setItem('ony_cart', '{invalid-json');

    const { result } = await renderUseCartStorage();

    expect(result[0]).toEqual([]);
  });

  it('retourne un panier vide si la donnée sauvegardée n’est pas un tableau', async () => {
    window.localStorage.setItem(
      'ony_cart',
      JSON.stringify({ id: 'p-1', quantite: 2 })
    );

    const { result } = await renderUseCartStorage();

    expect(result[0]).toEqual([]);
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

    const { result } = await renderUseCartStorage();

    expect(result[0]).toEqual([
      { id: 'p-1', quantite: 2 },
      { id: 'p-4', quantite: 3 },
    ]);
  });

  it('persiste les modifications du panier dans localStorage', async () => {
    const { result } = await renderUseCartStorage();

    result[1]([
      { id: 'p-1', quantite: 2 },
      { id: 'p-2', quantite: 1 },
    ]);

    expect(JSON.parse(window.localStorage.getItem('ony_cart') ?? 'null')).toEqual([
      { id: 'p-1', quantite: 2 },
      { id: 'p-2', quantite: 1 },
    ]);
  });

  it('ignore une erreur de localStorage lors de la persistance', async () => {
    window.localStorage.setItem.mockImplementation(() => {
      throw new Error('Quota dépassé');
    });

    await expect(renderUseCartStorage()).resolves.not.toThrow();
  });

  it('retourne un panier vide si localStorage échoue à la lecture', async () => {
    window.localStorage.getItem.mockImplementation(() => {
      throw new Error('Accès localStorage refusé');
    });

    const { result } = await renderUseCartStorage();

    expect(result[0]).toEqual([]);
  });
});