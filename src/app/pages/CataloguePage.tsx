import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchBar } from '../components/catalogue/SearchBar';
import { CategoryFilters } from '../components/catalogue/CategoryFilters';
import { ProductGrid } from '../components/catalogue/ProductGrid';
import { Pagination } from '../components/catalogue/Pagination';
import { usePageTitle } from '../../lib/usePageTitle';
import { useCatalogue } from '../components/catalogue/useCatalogue';
import { galleryImages } from '../../constants/gallery_images';

export function CataloguePage() {
  const {
    search,
    setSearch,
    activeFilter,
    handleFilterChange,
    paginatedItems,
    filteredItems,
    isLoading,
    error,
    page,
    totalPages,
    rangeStart,
    rangeEnd,
    productCount,
    categoryCounts,
    handlePageChange,
    resultsRef,
  } = useCatalogue();

  usePageTitle({
    title: 'Catalogue',
    description: `Parcourez nos ${productCount} références de mobilier et équipements événementiels à louer : chaises, tables, tentes, couverts et prestations.`,
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative min-h-[400px] md:h-[70vh] md:min-h-[480px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            backgroundImage: `url(${galleryImages.find((image) => image.id === 'g2')?.src ?? ''})`,
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
            {productCount} références disponibles à la location
          </motion.p>
          <br />
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilters
            activeFilter={activeFilter}
            onChange={handleFilterChange}
            categoryCounts={categoryCounts}
          />
        </div>
      </section>

      <section ref={resultsRef} className="py-16 bg-white scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-24" role="status">
              Chargement du catalogue…
            </p>
          ) : error ? (
            <p className="text-center text-red-600 py-24" role="alert">
              {error}
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filteredItems.length === 0
                  ? 'Aucun résultat'
                  : `Affichage ${rangeStart}-${rangeEnd} sur ${filteredItems.length} résultat${filteredItems.length > 1 ? 's' : ''}`}
              </p>

              <ProductGrid items={paginatedItems} />

              <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
