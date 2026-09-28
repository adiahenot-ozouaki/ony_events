import type { OnyItem } from '../../../constants/ony_interfaces';
import type { CatalogueFilter } from './CategoryFilters';

export const PAGE_SIZE = 15;

export function filterProducts(
  products: OnyItem[],
  activeFilter: CatalogueFilter,
  search: string
): OnyItem[] {
  const query = search.trim().toLowerCase();

  return products.filter((item) => {
    const matchesCategory = activeFilter === 'Tous' || item.categorie === activeFilter;
    if (!matchesCategory) return false;
    if (!query) return true;

    const haystack = `${item.categorie} ${item.subCategorie} ${item.nom} ${item.description}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function paginateProducts(items: OnyItem[], page: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, items.length);

  return { totalPages, paginatedItems, rangeStart, rangeEnd };
}

export function getCategoryCounts(
  products: OnyItem[],
  filters: readonly CatalogueFilter[]
): Record<CatalogueFilter, number> {
  const counts = Object.fromEntries(filters.map((filter) => [filter, 0])) as Record<CatalogueFilter, number>;

  for (const product of products) {
    if (counts[product.categorie as CatalogueFilter] !== undefined) {
      counts[product.categorie as CatalogueFilter] += 1;
    }
  }

  counts.Tous = products.length;
  return counts;
}