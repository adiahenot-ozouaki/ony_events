import { useEffect } from 'react';

const SITE_NAME = 'ONY';
const DEFAULT_DESCRIPTION =
  "Location de mobilier et équipements événementiels au Gabon : chaises, tables, tentes, couverts, habillages et prestations pour tous vos événements.";

interface PageMeta {
  /** Titre de la page, sans le nom du site (ajouté automatiquement). */
  title: string;
  /** Description spécifique à la page (fallback sur la description générale sinon). */
  description?: string;
}

function setMetaTag(selector: string, attribute: string, content: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attribute, content);
}

/**
 * Met à jour le <title> et les meta description / Open Graph / Twitter à
 * chaque montage de page. index.html ne définit que des valeurs par défaut
 * (utilisées pour le tout premier chargement, avant l'hydratation React) ;
 * ce hook les personnalise ensuite par route côté client.
 *
 * Limite connue : comme le site est une SPA sans SSR/prerendering, les
 * crawlers qui n'exécutent pas JS (certains bots de réseaux sociaux, aperçu
 * de lien basique) verront toujours les meta par défaut d'index.html plutôt
 * que celles-ci.
 */
export function usePageTitle({ title, description }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const desc = description ?? DEFAULT_DESCRIPTION;

    document.title = fullTitle;
    setMetaTag('meta[name="description"]', 'content', desc);
    setMetaTag('meta[property="og:title"]', 'content', fullTitle);
    setMetaTag('meta[property="og:description"]', 'content', desc);
    setMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', desc);
  }, [title, description]);
}
