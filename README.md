# ONY — Site vitrine & catalogue

Site web pour **ONY**, agence gabonaise de location de mobilier et
d'équipements événementiels (chaises, couverts, habillages, tables,
tentes, prestations de service) basée à Libreville.

Le site permet de parcourir le catalogue, filtrer et rechercher des
produits, constituer une demande de devis avec panier, et l'envoyer via un
formulaire connecté à Supabase — avec notification email automatique à
l'agence à chaque nouvelle demande.

## Stack technique

- **React 18** + **TypeScript**
- **Vite 6** — build & dev server
- **React Router v7** — navigation (`/`, `/catalogue`, `/produit/:id`,
  `/devis`, `/a-propos`, `/galerie`)
- **Tailwind CSS v4**
- **Motion** (Framer Motion) — animations et transitions de page
- **Supabase** — stockage des demandes de devis (`devis_requests`) +
  Edge Function pour la notification email
- **Resend** — envoi de l'email de notification à l'agence
- **lucide-react** — icônes

## Démarrage local

```bash
npm install
```

Crée un fichier `.env.local` à la racine avec les identifiants Supabase :

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=xxxxxxxxxxxxxxxx
```

(Ces valeurs se trouvent dans le dashboard Supabase → **Project Settings →
API**.)

```bash
npm run dev
```

Le site est servi sur `http://localhost:5173` (port par défaut de Vite).

## Scripts disponibles

| Commande          | Description                                  |
|--------------------|-----------------------------------------------|
| `npm run dev`      | Serveur de développement avec hot-reload      |
| `npm run build`    | Build de production dans `dist/`              |
| `npm run preview`  | Sert le build de production en local          |

## Optimisation des images

Les photos produits/galerie vivent dans `public/images/`. Pour les
recompresser après ajout de nouvelles photos :

```bash
npm install -D sharp
node scripts/optimize-images.mjs
```

Le script redimensionne (max 1600px de large) et recompresse (JPEG
qualité 78) toutes les images du dossier, en conservant une sauvegarde des
originaux dans `public/images-originals/` (non versionné, voir
`.gitignore`).

## Structure du projet

```
src/
├── app/
│   ├── App.tsx              # routes, providers
│   ├── pages/                # une page par route
│   └── components/
│       ├── home/              # sections de la page d'accueil
│       ├── about/              # sections de la page "À propos"
│       ├── catalogue/          # recherche, filtres, grille produits
│       ├── gallery/             # galerie photo + lightbox
│       ├── devis/               # panier / résumé de devis
│       └── motion/              # transitions & animations partagées
│   └── context/
│       └── CartContext.tsx    # état du panier (persisté en localStorage)
├── constants/
│   ├── agency_info.ts         # coordonnées de l'agence (adresse, tél, etc.)
│   ├── ony_items.ts            # catalogue produit
│   ├── ony_products.ts         # helpers (formatage prix, images, filtres)
│   ├── gallery_images.ts       # galerie photo
│   └── product_images.ts       # manifeste des photos disponibles
├── lib/
│   └── supabaseClient.ts       # client Supabase (variables d'env requises)
└── styles/                     # theme.css, tailwind, fonts
```

## Demandes de devis & notification email

Le formulaire de devis (`/devis` et section devis de l'accueil) insère
chaque demande dans la table Supabase `devis_requests`. Un **Database
Webhook** Supabase déclenche une **Edge Function**
(`send-devis-notification`) à chaque insertion, qui envoie un email
récapitulatif via l'API Resend à l'adresse de l'agence.

Schéma de la table :

```sql
create table public.devis_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nom text not null,
  telephone text not null,
  email text not null,
  type_evenement text,
  message text,
  items jsonb,
  total numeric
);

alter table public.devis_requests enable row level security;

create policy "Permettre l'insertion publique de devis"
on public.devis_requests
for insert
to anon
with check (true);
```

La clé API Resend est stockée comme secret Supabase (`RESEND_API_KEY`),
jamais exposée côté client.

## Déploiement

Le site est déployé sur **Netlify**, configuré via `netlify.toml` :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Le bloc `redirects` est nécessaire pour que le routing côté client
(React Router) fonctionne correctement sur un rafraîchissement de page ou
un accès direct à une sous-route (ex: `/catalogue`).

**Variables d'environnement à configurer sur Netlify** (Site settings →
Environment variables) :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Tout push sur la branche `main` déclenche un nouveau build et déploiement
automatique.

## Origine du projet

Ce projet a été initialement généré via Figma Make à partir de
[ce design Figma](https://www.figma.com/design/4fl9CQr8ur20oWcyIfhqfx/Design-ONY-Website),
puis développé et adapté (Supabase, notifications email, optimisation des
performances, données réelles de l'agence).