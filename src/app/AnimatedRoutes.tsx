import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const CataloguePage = lazy(() => import('./pages/CataloguePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const DevisPage = lazy(() => import('./pages/DevisPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/catalogue/:slug" element={<ProductDetailPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/galerie" element={<GalleryPage />} />
            <Route path="/devis" element={<DevisPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}
