import { beforeEach, describe, expect, it, vi } from 'vitest';

const hookRuntime = vi.hoisted(() => ({
  productState: undefined as unknown,
  cartState: undefined as unknown,
  effectInitialized: false,
  rerender: undefined as (() => void) | undefined,
}));

const products = [
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
];

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
      if (!hookRuntime.effectInitialized) {
        hookRuntime.effectInitialized = true;
        effect();
      }
    },
    useMemo: (factory: () => unknown) => factory(),
    useState: (initialValue: unknown) => {
      if (hookRuntime.productState === undefined) {
        hookRuntime.productState =
          typeof initialValue === 'function' ? initialValue() : initialValue;
      }

      const setState = (nextValue: unknown) => {
        hookRuntime.productState =
          typeof nextValue === 'function'
            ? nextValue(hookRuntime.productState)
            : nextValue;

        hookRuntime.rerender?.();
      };

      return [hookRuntime.productState, setState];
    },
  };
});

vi.mock('../src/app/context/useCartStorage', () => ({
  useCartStorage: () => {
    if (hookRuntime.cartState === undefined) {
      hookRuntime.cartState = [];
    }

    const setItems = (nextValue: unknown) => {
      hookRuntime.cartState =
        typeof nextValue === 'function'
          ? nextValue(hookRuntime.cartState)
          : nextValue;

      hookRuntime.rerender?.();
    };

    return [hookRuntime.cartState, setItems];
  },
}));

vi.mock('../src/lib/products', () => ({
  fetchProducts: vi.fn(() => ({
    then(callback: (value: typeof products) => void) {
      callback(products);
      return {
        catch() {
          return this;
        },
      };
    },
  })),
}));

import { CartProvider, useCart } from '../src/app/context/CartContext';

describe('CartContext', () => {
  beforeEach(() => {
    hookRuntime.productState = undefined;
    hookRuntime.cartState = undefined;
    hookRuntime.effectInitialized = false;
    hookRuntime.rerender = undefined;
  });

  function renderCart() {
    let currentValue: {
      items: { id: string; quantite: number }[];
      addItem: (id: string, quantite?: number) => void;
      removeItem: (id: string) => void;
      updateQuantite: (id: string, quantite: number) => void;
      clearCart: () => void;
      totalCount: number;
      totalPrice: number;
    };

    const render = () => {
      const element = CartProvider({ children: null });
      currentValue = (element as { props: { value: typeof currentValue } }).props.value;
    };

    hookRuntime.rerender = render;
    render();

    return {
      get value() {
        return currentValue;
      },
    };
  }

  it('ajoute un nouvel article au panier', () => {
    const cart = renderCart();

    cart.value.addItem('p-1');

    expect(cart.value.items).toEqual([{ id: 'p-1', quantite: 1 }]);
  });

  it('ajoute une quantité à un article déjà présent', () => {
    const cart = renderCart();

    cart.value.addItem('p-1', 2);
    cart.value.addItem('p-1', 3);

    expect(cart.value.items).toEqual([{ id: 'p-1', quantite: 5 }]);
  });

  it('supprime un article du panier', () => {
    const cart = renderCart();

    cart.value.addItem('p-1', 2);
    cart.value.removeItem('p-1');

    expect(cart.value.items).toEqual([]);
  });

  it('modifie la quantité d’un article', () => {
    const cart = renderCart();

    cart.value.addItem('p-1', 2);
    cart.value.updateQuantite('p-1', 5);

    expect(cart.value.items).toEqual([{ id: 'p-1', quantite: 5 }]);
  });

  it('supprime un article lorsque sa quantité devient nulle ou négative', () => {
    const cart = renderCart();

    cart.value.addItem('p-1', 2);
    cart.value.updateQuantite('p-1', 0);

    expect(cart.value.items).toEqual([]);

    cart.value.addItem('p-1', 2);
    cart.value.updateQuantite('p-1', -1);

    expect(cart.value.items).toEqual([]);
  });

  it('vide complètement le panier', () => {
    const cart = renderCart();

    cart.value.addItem('p-1', 2);
    cart.value.addItem('p-2', 1);
    cart.value.clearCart();

    expect(cart.value.items).toEqual([]);
  });

  it('calcule le nombre total d’articles', () => {
    const cart = renderCart();

    cart.value.addItem('p-1', 2);
    cart.value.addItem('p-2', 3);

    expect(cart.value.totalCount).toBe(5);
  });

  it('calcule le prix total', () => {
    const cart = renderCart();

    cart.value.addItem('p-1', 2);
    cart.value.addItem('p-2', 3);

    expect(cart.value.totalPrice).toBe(9500);
  });

  it('ignore les articles dont le produit est absent du catalogue', () => {
    const cart = renderCart();

    cart.value.addItem('unknown', 3);

    expect(cart.value.totalCount).toBe(0);
    expect(cart.value.totalPrice).toBe(0);
  });

  it('lève une erreur si useCart est utilisé hors du provider', () => {
    expect(() => useCart()).toThrow(
      "useCart doit être utilisé à l'intérieur d'un CartProvider"
    );
  });
});
