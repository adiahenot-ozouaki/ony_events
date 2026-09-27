import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { OnyItem } from '../../../constants/ony_interfaces';
import { fetchProducts } from '../../../lib/products';
import { catalogueFilters, type CatalogueFilter } from './CategoryFilters';

const PAGE_SIZE = 15;

// Vérifie que la valeur reçue en query param correspond bien à un filtre
// connu, pour éviter d'accepter une catégorie inventée/arbitraire dans l'URL.
function parseFilterFromParams(value: string | null): CatalogueFilter {
  if (value && (catalogueFilters as readonly string[]).includes(value)) {
    return value as CatalogueFilter;
  }
  return 'Tous';
}

export function useCatalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilterState] = useState<CatalogueFilter>(() =>
    parseFilterFromParams(searchParams.get('categorie'))
  );
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<OnyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProducts();
        if (!cancelled) setProducts(data);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les produits.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  // Garde le filtre synchronisé avec l'URL (permet de partager/rafraîchir un
  // lien filtré, ex. venant de la page d'accueil).
  function handleFilterChange(filter: CatalogueFilter) {
    setActiveFilterState(filter);
    if (filter === 'Tous') {
      searchParams.delete('categorie');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ categorie: filter }, { replace: true });
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCategory = activeFilter === 'Tous' || item.categorie === activeFilter;
      if (!matchesCategory) return false;
      if (!query) return true;
      const haystack = `${item.categorie} ${item.subCategorie} ${item.nom} ${item.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeFilter, search, products]);

  // Revenir à la première page à chaque changement de filtre ou de recherche.
  useEffect(() => {
    setPage(1);
  }, [activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = filteredItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredItems.length);

  const categoryCounts = Object.fromEntries(
    catalogueFilters.map((filter) => [
      filter,
      filter === 'Tous' ? products.length : products.filter((item) => item.categorie === filter).length,
    ])
  ) as Record<CatalogueFilter, number>;

  function handlePageChange(newPage: number) {
    setPage(newPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return {
    search,
    isLoading,
    error,
    setSearch,
    activeFilter,
    handleFilterChange,
    paginatedItems,
    filteredItems,
    page,
    totalPages,
    rangeStart,
    rangeEnd,
    productCount: products.length,
    categoryCounts,
    handlePageChange,
    resultsRef,
  };
}
