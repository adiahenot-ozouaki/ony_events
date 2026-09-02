import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Search } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageTitle } from '../../lib/usePageTitle';
import { useRobotsMeta } from '../components/useRobotsMeta';

export function NotFoundPage() {
  usePageTitle({ title: 'Page introuvable' });
  useRobotsMeta('noindex, nofollow');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 pt-32 pb-24">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div
              className="font-[var(--font-serif)] text-8xl text-[var(--gold)] mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              404
            </div>
            <h1
              className="font-[var(--font-serif)] text-3xl mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Cette page n'existe pas
            </h1>
            <p className="text-muted-foreground mb-10">
              La page que vous recherchez a peut-être été déplacée ou supprimée.
              Retrouvez notre catalogue ou revenez à l'accueil.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  <ArrowLeft size={18} />
                  Retour à l'accueil
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/catalogue"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground rounded-md hover:bg-foreground hover:text-white transition-colors"
                >
                  <Search size={18} />
                  Voir le catalogue
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
