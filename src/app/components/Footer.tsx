import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import { agencyInfo } from '../../constants/agency_info';

const SOCIAL_LINKS = [
  { key: 'facebook', href: agencyInfo.reseaux.facebook, Icon: Facebook, label: 'Facebook' },
  { key: 'instagram', href: agencyInfo.reseaux.instagram, Icon: Instagram, label: 'Instagram' },
  { key: 'linkedin', href: agencyInfo.reseaux.linkedin, Icon: Linkedin, label: 'LinkedIn' },
].filter((social) => social.href);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0B0B] text-white">
      <div className="max-w-[1440px] mx-auto px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-[var(--font-serif)] text-2xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              {agencyInfo.nom}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {agencyInfo.slogan}. Location de mobilier et équipements professionnels pour tous vos événements.
            </p>
          </div>

          <div>
            <h4 className="mb-4">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/catalogue" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Catalogue</Link>
              <Link to="/galerie" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Galerie</Link>
              <Link to="/a-propos" className="text-gray-400 hover:text-[var(--gold)] transition-colors">À propos</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4">Catégories</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/catalogue" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Chaises</Link>
              <Link to="/catalogue" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Couverts</Link>
              <Link to="/catalogue" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Habillages</Link>
              <Link to="/catalogue" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Tables</Link>
              <Link to="/catalogue" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Tentes</Link>
              <Link to="/catalogue" className="text-gray-400 hover:text-[var(--gold)] transition-colors">Prestations</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>{agencyInfo.adresse.ligne1}, {agencyInfo.adresse.ville}, {agencyInfo.adresse.pays}</span>
              </div>
              <a href={`tel:${agencyInfo.telephone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-gray-400 hover:text-[var(--gold)] transition-colors">
                <Phone size={18} className="flex-shrink-0" />
                <span>{agencyInfo.telephone}</span>
              </a>
              <a href={`mailto:${agencyInfo.email}`} className="flex items-center gap-2 text-gray-400 hover:text-[var(--gold)] transition-colors">
                <Mail size={18} className="flex-shrink-0" />
                <span>{agencyInfo.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {currentYear} {agencyInfo.nom}. Tous droits réservés.</p>
          {SOCIAL_LINKS.length > 0 && (
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ key, href, Icon, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-gray-400 hover:text-[var(--gold)] transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
