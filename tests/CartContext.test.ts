import { beforeEach, describe, expect, it, vi } from 'vitest';

const hookRuntime = vi.hoisted(() => ({
  state: undefined as unknown,
  effect: undefined as (() => void) | undefined,
}));

vi.mock('react', () => {
  const context = {
    current: undefined as unknown,
    Provider: (props: { value: unknown; children: unknown }) => {
      context.current = props.value;
      return { props };
    },
  };

  return {
    createContext: (defaultValue: unknown) => {
      context.current = defaultValue;
      return context;
    },
    createElement: (
      type: (props: { value: unknown; children: unknown }) => unknown,
      props: { value: unknown; children: unknown }
    ) => type(props),
    useContext: () => context.current,
    useEffect: (effect: () => void) => {
      hookRuntime.effect = effect;
      effect();
    },
    useMemo: (factory: () => unknown) => factory(),
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
      };

      return [hookRuntime.state, setState];
    },
  };
});

vi.mock('../src/app/context/useCartStorage', () => ({
  useCartStorage: () => {
    if (hookRuntime.state === undefined) {
      hookRuntime.state = [];
    }

    const setItems = (nextValue: unknown) => {
      hookRuntime.state =
        typeof nextValue === 'function'
          ? nextValue(hookRuntime.state)
          : nextValue;
    };

    return [hookRuntime.state, setItems];
  },
}));

vi.mock('../src/lib/products', () => ({
  fetchProducts: vi.fn(() =>
    Promise.resolve([
      {
        id: 'p-1',
        categorie: 'Catégorie',
        subCategorie: 'Sous-catégorie',
        nom: 'Produit 1',
        prix: 1000,
        description: 'Produit de test',
        image: '/image-1.jpg',
        quantite: '1',
        unite: 'pièce',
      },
      {
        id: 'p-2',
        categorie: 'Catégorie',
        subCategorie: 'Sous-catégorie',
        nom: 'Produit 2',
        prix: 2500,
        description: 'Produit de test',
        image: '/image-2.jpg',
        quantite: '1',
        unite: 'pièce',
      },
    ]),
  ),
}));

import { CartProvider, useCart } from '../src/app/context/CartContext';

describe('CartContext', () => {
  beforeEach(() => {
    hookRuntime.state = undefined;
    hookRuntime.effect = undefined;
  });

  function renderCart() {
    const element = CartProvider({ children: null });

    return (element as { props: { value: unknown } }).props.value as {
      items: { id: string; quantite: number }[];
      addItem: (id: string, quantite?: number) => void;
      removeItem: (id: string) => void;
      updateQuantite: (id: string, quantite: number) => void;
      clearCart: () => void;
      totalCount: number;
      totalPrice: number;
    };
  }

  it('ajoute un nouvel article au panier', () => {
    const cart = renderCart();

    cart.addItem('p-1');

    expect(cart.items).toEqual([{ id: 'p-1', quantite: 1 }]);
  });

  it('ajoute une quantité à un article déjà présent', () => {
    const cart = renderCart();

    cart.addItem('p-1', 2);
    cart.addItem('p-1', 3);

    expect(cart.items).toEqual([{ id: 'p-1', quantite: 5 }]);
  });

  it('supprime un article du panier', () => {
    const cart = renderCart();

    cart.addItem('p-1', 2);
    cart.removeItem('p-1');

    expect(cart.items).toEqual([]);
  });

  it('modifie la quantité d’un article', () => {
    const cart = renderCart();

    cart.addItem('p-1', 2);
    cart.updateQuantite('p-1', 5);

    expect(cart.items).toEqual([{ id: 'p-1', quantite: 5 }]);
  });

  it('supprime un article lorsque sa quantité devient nulle ou négative', () => {
    const cart = renderCart();

    cart.addItem('p-1', 2);
    cart.updateQuantite('p-1', 0);

    expect(cart.items).toEqual([]);

    cart.addItem('p-1', 2);
    cart.updateQuantite('p-1', -1);

    expect(cart.items).toEqual([]);
  });

  it('vide complètement le panier', () => {
    const cart = renderCart();

    cart.addItem('p-1', 2);
    cart.addItem('p-2', 1);
    cart.clearCart();

    expect(cart.items).toEqual([]);
  });

  it('calcule le nombre total d’articles', () => {
    const cart = renderCart();

    cart.addItem('p-1', 2);
    cart.addItem('p-2', 3);

    const updatedCart = renderCart();

    expect(updatedCart.totalCount).toBe(5);
  });

  it('calcule le prix total', () => {
    const cart = renderCart();

    cart.addItem('p-1', 2);
    cart.addItem('p-2', 3);

    const updatedCart = renderCart();

    expect(updatedCart.totalPrice).toBe(9500);
  });

  it('ignore les articles dont le produit est absent du catalogue', () => {
    const cart = renderCart();

    cart.addItem('unknown', 3);

    const updatedCart = renderCart();

    expect(updatedCart.totalCount).toBe(0);
    expect(updatedCart.totalPrice).toBe(0);
  });

  it('lève une erreur si useCart est utilisé hors du provider', () => {
    expect(() => useCart()).toThrow(
      "useCart doit être utilisé à l'intérieur d'un CartProvider"
    );
  });
});
