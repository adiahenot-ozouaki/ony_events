// Régénère public/sitemap.xml avant chaque build : pages fixes du site +
// une entrée par produit du catalogue.
//
// Les IDs produits viennent de Supabase, qui est désormais la source de
// vérité du catalogue. Le script ne récupère que les données nécessaires
// au sitemap.
//
// Branché automatiquement via le hook npm "prebuild" dans package.json :
// `npm run build` l'exécute donc toujours avant `vite build`.

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://ony.ga';

const STATIC_URLS = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/catalogue', changefreq: 'weekly', priority: '0.9' },
  { loc: '/galerie', changefreq: 'monthly', priority: '0.6' },
  { loc: '/a-propos', changefreq: 'monthly', priority: '0.5' },
  { loc: '/devis', changefreq: 'monthly', priority: '0.4' },
];

function buildXml(urls) {
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

async function main() {
  const env = loadEnv('production', process.cwd(), '');

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Variables d\'environnement Supabase manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY doivent être définies.'
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: products, error } = await supabase
    .from('products')
    .select('id')
    .order('id');

  if (error) {
    throw new Error(`Impossible de récupérer les produits pour le sitemap : ${error.message}`);
  }

  const productUrls = (products ?? []).map((product) => ({
    loc: `/produit/${product.id}`,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const xml = buildXml([...STATIC_URLS, ...productUrls]);
  const outPath = path.resolve(process.cwd(), 'public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');

  console.log(
    `✓ sitemap.xml généré : ${STATIC_URLS.length} pages fixes + ${productUrls.length} fiches produits`
  );
}

main().catch((err) => {
  console.error('✗ Échec de la génération du sitemap :', err);
  // On ne bloque pas le build pour autant : un sitemap manquant/périmé est
  // gênant pour le SEO, mais ne doit jamais empêcher un déploiement.
  process.exitCode = 0;
});
