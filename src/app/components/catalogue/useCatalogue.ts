import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { OnyItem } from '../../../constants/ony_interfaces';
import { fetchProducts } from '../../../lib/products';
import { catalogueFilters, type CatalogueFilter } from './CategoryFilters';
import { filterProducts, getCategoryCounts, paginateProducts } from './catalogueUtils';

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
  const [isMobile, setIsMobile] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobileState = () => setIsMobile(mediaQuery.matches);

    updateMobileState();
    mediaQuery.addEventListener('change', updateMobileState);
    return () => mediaQuery.removeEventListener('change', updateMobileState);
  }, []);

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

  const filteredItems = useMemo(
    () => filterProducts(products, activeFilter, search),
    [activeFilter, search, products]
  );

  const pageSize = isMobile ? 7 : 9;

  // Revenir à la première page à chaque changement de filtre, de recherche ou de taille d'écran.
  useEffect(() => {
    setPage(1);
  }, [activeFilter, search, pageSize]);
  const { totalPages, paginatedItems, rangeStart, rangeEnd } = paginateProducts(filteredItems, page, pageSize);
  const categoryCounts = getCategoryCounts(products, catalogueFilters);

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
