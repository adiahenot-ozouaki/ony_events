import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { QuoteForm } from '../components/QuoteForm';
import { HeroSection } from '../components/home/HeroSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { RealisationsSection } from '../components/home/RealisationsSection';
import { GallerySection } from '../components/home/GallerySection';

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <WhyChooseUsSection />
      <RealisationsSection />
      <GallerySection />
      <QuoteForm />
      <Footer />
    </div>
  );
}