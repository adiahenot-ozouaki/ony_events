import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Home } from './pages/Home';
import { CataloguePage } from './pages/CataloguePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DevisPage } from './pages/DevisPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { CartProvider } from './context/CartContext';
import { PageTransition } from './components/motion/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  // React Router ne remet jamais le scroll en haut tout seul lors d'une
  // navigation — on le fait nous-mêmes à chaque changement de route.
  // behavior: 'instant' est nécessaire car theme.css active
  // `scroll-behavior: smooth` globalement sur <html> (sinon la remontée
  // s'anime à chaque changement de page, ce qui ralentit la transition).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/catalogue" element={<PageTransition><CataloguePage /></PageTransition>} />
        <Route path="/produit/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
        <Route path="/devis" element={<PageTransition><DevisPage /></PageTransition>} />
        <Route path="/a-propos" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/galerie" element={<PageTransition><GalleryPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}