// Régénère public/sitemap.xml avant chaque build : pages fixes du site +
// une entrée par produit du catalogue (src/constants/ony_items.ts).
//
// Utilise directement l'API interne de Vite (déjà une dépendance du projet)
// pour charger ony_items.ts tel quel, sans avoir besoin d'ajouter ts-node,
// tsx ou un autre outil pour exécuter du TypeScript en dehors de Vite.
//
// Branché automatiquement via le hook npm "prebuild" dans package.json :
// `npm run build` l'exécute donc toujours avant `vite build`.

import { createServer } from 'vite';
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
  // middlewareMode + appType 'custom' : on ne démarre pas de vrai serveur
  // HTTP, on veut juste la capacité de Vite à transformer/charger un
  // fichier .ts comme le ferait le navigateur en dev.
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });

  let onyItems;
  try {
    ({ onyItems } = await server.ssrLoadModule('/src/constants/ony_items.ts'));
  } finally {
    await server.close();
  }

  if (!Array.isArray(onyItems)) {
    throw new Error(
      "ony_items.ts n'exporte pas 'onyItems' comme un tableau — vérifie que l'export nommé n'a pas changé de nom."
    );
  }

  const productUrls = onyItems.map((item) => ({
    loc: `/produit/${item.id}`,
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
