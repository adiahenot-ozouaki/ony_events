import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AboutHero } from '../components/about/AboutHero';
import { AboutIntro } from '../components/about/AboutIntro';
import { InfoCards } from '../components/about/InfoCards';
import { AboutMap } from '../components/about/AboutMap';
import { usePageTitle } from '../../lib/usePageTitle';

export function AboutPage() {
  usePageTitle({
    title: 'À propos',
    description: 'Découvrez ONY, agence gabonaise de location de mobilier et équipements événementiels basée à Libreville.',
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AboutHero />
      <AboutIntro />
      <InfoCards />
      <AboutMap />
      <Footer />
    </div>
  );
}
