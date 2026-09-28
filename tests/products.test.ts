import { beforeEach, describe, expect, it, vi } from 'vitest';

const supabaseMock = vi.hoisted(() => ({
  from: vi.fn(),
}));

vi.mock('../src/lib/supabaseClient', () => ({
  supabase: supabaseMock,
}));

const productRows = [
  {
    id: 'p-2',
    categorie: 'Table',
    sub_categorie: 'ronde',
    nom: 'Table ronde',
    prix: 25000,
    description: 'Table de test',
    image: ['table_ronde_2'],
    quantite: 1,
    unite: 'piece' as const,
  },
  {
    id: 'p-1',
    categorie: 'Chaise',
    sub_categorie: 'standard',
    nom: 'Chaise test',
    prix: 5000,
    description: 'Chaise de test',
    image: ['chaise_test'],
    quantite: 1,
    unite: 'piece' as const,
  },
];

function mockSuccessfulQuery(data = productRows) {
  const query = {
    select: vi.fn(),
    order: vi.fn(),
    then: vi.fn(),
  };

  query.select.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.then.mockImplementation((onFulfilled: (result: unknown) => unknown) =>
    Promise.resolve(onFulfilled({ data, error: null }))
  );

  supabaseMock.from.mockReturnValue(query);

  return query;
}

function mockFailedQuery(message = 'Erreur de test') {
  const query = {
    select: vi.fn(),
    order: vi.fn(),
    then: vi.fn(),
  };

  query.select.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.then.mockImplementation((onFulfilled: (result: unknown) => unknown) =>
    Promise.resolve(onFulfilled({ data: null, error: { message } }))
  );

  supabaseMock.from.mockReturnValue(query);

  return query;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

async function getFetchProducts() {
  const module = await import('../src/lib/products');
  return module.fetchProducts;
}

describe('fetchProducts', () => {
  it('récupère et transforme les produits Supabase', async () => {
    const query = mockSuccessfulQuery();
    const fetchProducts = await getFetchProducts();

    const products = await fetchProducts();

    expect(supabaseMock.from).toHaveBeenCalledWith('products');
    expect(query.select).toHaveBeenCalledWith(
      'id, categorie, sub_categorie, nom, prix, description, image, quantite, unite'
    );
    expect(query.order).toHaveBeenCalledWith('id');
    expect(products).toEqual([
      {
        id: 'p-2',
        categorie: 'Table',
        subCategorie: 'ronde',
        nom: 'Table ronde',
        prix: 25000,
        description: 'Table de test',
        image: ['table_ronde_2'],
        quantite: 1,
        unite: 'piece',
      },
      {
        id: 'p-1',
        categorie: 'Chaise',
        subCategorie: 'standard',
        nom: 'Chaise test',
        prix: 5000,
        description: 'Chaise de test',
        image: ['chaise_test'],
        quantite: 1,
        unite: 'piece',
      },
    ]);
  });

  it('réutilise le cache après un chargement réussi', async () => {
    mockSuccessfulQuery();
    const fetchProducts = await getFetchProducts();

    const first = await fetchProducts();
    const second = await fetchProducts();

    expect(second).toBe(first);
    expect(supabaseMock.from).toHaveBeenCalledTimes(1);
  });

  it('partage la Promise pendant un chargement en cours', async () => {
    let resolveQuery: (() => void) | undefined;

    const query = {
      select: vi.fn(),
      order: vi.fn(),
      then: vi.fn(),
    };

    query.select.mockReturnValue(query);
    query.order.mockReturnValue(query);
    query.then.mockImplementation((onFulfilled: (result: unknown) => unknown) => {
      const promise = new Promise<void>((resolve) => {
        resolveQuery = resolve;
      });

      return promise.then(() => onFulfilled({ data: productRows, error: null }));
    });

    supabaseMock.from.mockReturnValue(query);

    const fetchProducts = await getFetchProducts();
    const firstPromise = fetchProducts();
    const secondPromise = fetchProducts();

    expect(secondPromise).toBe(firstPromise);
    expect(supabaseMock.from).toHaveBeenCalledTimes(1);

    resolveQuery?.();
    await firstPromise;
  });

  it('rejette la Promise en cas d’erreur Supabase', async () => {
    mockFailedQuery('Connexion impossible');
    const fetchProducts = await getFetchProducts();

    await expect(fetchProducts()).rejects.toThrow(
      'Impossible de récupérer les produits : Connexion impossible'
    );
  });

  it('autorise une nouvelle tentative après une erreur', async () => {
    mockFailedQuery('Erreur temporaire');
    const fetchProducts = await getFetchProducts();

    await expect(fetchProducts()).rejects.toThrow('Erreur temporaire');

    mockSuccessfulQuery();

    const products = await fetchProducts();

    expect(products).toEqual(productRows);
    expect(supabaseMock.from).toHaveBeenCalledTimes(2);
  });
});
