import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CartProvider } from './context/CartContext';
import { PageTransition } from './components/motion/PageTransition';

// Chaque page est chargée à la demande (dynamic import) au lieu d'être
// incluse dans le bundle initial. Le navigateur ne télécharge le code de
// /catalogue, /devis, /galerie, etc. que lorsque l'utilisateur y navigue.
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const CataloguePage = lazy(() =>
  import('./pages/CataloguePage').then((m) => ({ default: m.CataloguePage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const DevisPage = lazy(() => import('./pages/DevisPage').then((m) => ({ default: m.DevisPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);

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
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/catalogue" element={<PageTransition><CataloguePage /></PageTransition>} />
          <Route path="/produit/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
          <Route path="/devis" element={<PageTransition><DevisPage /></PageTransition>} />
          <Route path="/a-propos" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/galerie" element={<PageTransition><GalleryPage /></PageTransition>} />
        </Routes>
      </Suspense>
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
