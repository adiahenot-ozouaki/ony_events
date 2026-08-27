import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  // À l'ouverture, envoie le focus clavier directement sur le premier lien
  // du menu — sans ça, un utilisateur au clavier devrait retraverser toute
  // la barre de navigation pour atteindre un panneau pourtant déjà visible.
  useEffect(() => {
    if (isMenuOpen) {
      firstMobileLinkRef.current?.focus();
    }
  }, [isMenuOpen]);

  // Ferme le menu ET rend le focus au bouton hamburger — pertinent quand la
  // fermeture ne s'accompagne pas d'une navigation (ex. touche Échap),
  // contrairement au clic sur un lien qui fait déjà quitter la page.
  function closeMenuAndRefocusButton() {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  // Support standard des menus/panneaux : Échap referme et rend la main au
  // bouton qui a ouvert le menu, sans quoi le focus resterait "perdu" dans
  // un panneau désormais invisible.
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenuAndRefocusButton();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-[var(--font-serif)] text-2xl tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              ONY
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/catalogue" className="hover:text-[var(--gold)] transition-colors">Catalogue</Link>
            <Link to="/galerie" className="hover:text-[var(--gold)] transition-colors">Galerie</Link>
            <Link to="/a-propos" className="hover:text-[var(--gold)] transition-colors">À propos</Link>

            <Link
              to="/devis"
              className="relative hover:text-[var(--gold)] transition-colors"
              aria-label={totalCount > 0 ? `Voir mon devis (${totalCount} article${totalCount > 1 ? 's' : ''})` : 'Voir mon devis'}
            >
              <ShoppingBag size={22} aria-hidden="true" />
              <AnimatePresence>
                {totalCount > 0 && (
                  <motion.span
                    key={totalCount}
                    aria-hidden="true"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-[var(--gold)] text-white text-[10px] rounded-full flex items-center justify-center"
                  >
                    {totalCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/devis"
                className="px-6 py-2.5 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity inline-block"
              >
                Demander un devis
              </Link>
            </motion.div>
          </div>

          <button
            ref={menuButtonRef}
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden overflow-hidden border-t border-border"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="flex flex-col gap-4 py-4">
                <Link
                  ref={firstMobileLinkRef}
                  to="/catalogue"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[var(--gold)] transition-colors"
                >
                  Catalogue
                </Link>
                <Link
                  to="/galerie"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[var(--gold)] transition-colors"
                >
                  Galerie
                </Link>
                <Link
                  to="/a-propos"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[var(--gold)] transition-colors"
                >
                  À propos
                </Link>
                <Link
                  to="/devis"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[var(--gold)] transition-colors"
                >
                  Mon devis {totalCount > 0 ? `(${totalCount})` : ''}
                </Link>
                <Link
                  to="/devis"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-2.5 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity inline-block text-center"
                >
                  Demander un devis
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
