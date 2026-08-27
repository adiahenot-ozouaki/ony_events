import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchBar } from '../components/catalogue/SearchBar';
import { CategoryFilters, catalogueFilters, type CatalogueFilter } from '../components/catalogue/CategoryFilters';
import { ProductGrid } from '../components/catalogue/ProductGrid';
import { Pagination } from '../components/catalogue/Pagination';
import { onyItems } from '../../constants/ony_items';
import { usePageTitle } from '../../lib/usePageTitle';

const PAGE_SIZE = 15;

// Vérifie que la valeur reçue en query param correspond bien à un filtre
// connu, pour éviter d'accepter une catégorie inventée/arbitraire dans l'URL.
function parseFilterFromParams(value: string | null): CatalogueFilter {
  if (value && (catalogueFilters as readonly string[]).includes(value)) {
    return value as CatalogueFilter;
  }
  return 'Tous';
}

export function CataloguePage() {
  usePageTitle({
    title: 'Catalogue',
    description: `Parcourez nos ${onyItems.length} références de mobilier et équipements événementiels à louer : chaises, tables, tentes, couverts et prestations.`,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilterState] = useState<CatalogueFilter>(() =>
    parseFilterFromParams(searchParams.get('categorie'))
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLElement>(null);

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
    return onyItems.filter((item) => {
      const matchesCategory = activeFilter === 'Tous' || item.categorie === activeFilter;
      if (!matchesCategory) return false;
      if (!query) return true;
      const haystack = `${item.categorie} ${item.subCategorie} ${item.nom} ${item.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeFilter, search]);

  // Revenir à la première page à chaque changement de filtre ou de recherche.
  useEffect(() => {
    setPage(1);
  }, [activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = filteredItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredItems.length);

  function handlePageChange(newPage: number) {
    setPage(newPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            backgroundImage: 'url(/images/table_ronde_2.jpg)',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
        </motion.div>

        <div className="relative z-10 text-center text-white max-w-7xl mx-auto px-6">
          <motion.h1
            className="font-[var(--font-serif)] text-5xl md:text-6xl mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Catalogue complet
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          >
            {onyItems.length} références disponibles à la location
          </motion.p>
          <br />
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilters activeFilter={activeFilter} onChange={handleFilterChange} />
        </div>
      </section>

      <section ref={resultsRef} className="py-16 bg-white scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-20">
          <p className="text-sm text-muted-foreground mb-6">
            {filteredItems.length === 0
              ? 'Aucun résultat'
              : `Affichage ${rangeStart}-${rangeEnd} sur ${filteredItems.length} résultat${filteredItems.length > 1 ? 's' : ''}`}
          </p>

          <ProductGrid items={paginatedItems} />

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
