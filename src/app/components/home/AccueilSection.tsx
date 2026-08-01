import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AccueilSection() {
  return ( 
    <section id="accueil" className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1768777270882-9f74939fee50?w=1600)',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1
            className="font-[var(--font-serif)] text-6xl md:text-7xl mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Équipez vos événements avec élégance
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Chaises, couverts, mobilier VIP et équipements professionnels
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogue"
              className="px-8 py-4 bg-[var(--gold)] text-white rounded-md hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Voir le catalogue
              <ArrowRight size={20} />
            </Link>
            <a
              href="#devis"
              className="px-8 py-4 bg-white text-black rounded-md hover:bg-white/90 transition-colors inline-flex items-center justify-center"
            >
              Demander un devis
            </a>
          </div>
        </div>
      </section>
  );
}