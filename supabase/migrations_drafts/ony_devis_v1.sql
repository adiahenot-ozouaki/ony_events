-- ONY / devis : migration preparatoire, NON APPLIQUEE EN PRODUCTION.
-- A revoir en environnement de test avant execution.
-- Ne modifie ni public.products ni public.devis_requests.
-- Acces direct refuse : les operations seront exposees via API serveur avec controles de roles.
begin;

create table public.ony_clients (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  nom text not null check (length(trim(nom)) between 1 and 120),
  telephone text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table public.ony_devis (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  demande_id uuid unique references public.devis_requests(id) on delete set null,
  client_id uuid not null references public.ony_clients(id),
  cree_par uuid references auth.users(id) on delete set null,
  statut text not null default 'brouillon'
    check (statut in ('brouillon','en_preparation','envoye','accepte','refuse','expire','annule')),
  version integer not null default 1 check (version >= 1),
  type_evenement text,
  date_evenement date,
  lieu_evenement text,
  date_sortie timestamptz,
  date_retour timestamptz,
  expiration_at timestamptz,
  montant_articles bigint not null default 0 check (montant_articles >= 0),
  montant_prestations bigint not null default 0 check (montant_prestations >= 0),
  frais_livraison bigint not null default 0 check (frais_livraison >= 0),
  remise bigint not null default 0 check (remise >= 0),
  caution bigint not null default 0 check (caution >= 0),
  total_commercial bigint not null default 0 check (total_commercial >= 0),
  acompte_requis bigint not null default 0 check (acompte_requis >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ony_devis_dates_valid check (date_retour is null or date_sortie is null or date_retour > date_sortie),
  constraint ony_devis_remise_valid check (remise <= montant_articles + montant_prestations + frais_livraison),
  constraint ony_devis_acompte_valid check (acompte_requis <= total_commercial)
);

create table public.ony_devis_lignes (
  id uuid primary key default gen_random_uuid(),
  devis_id uuid not null references public.ony_devis(id) on delete cascade,
  produit_id text references public.products(id) on delete set null,
  designation text not null,
  unite text,
  quantite integer not null check (quantite > 0),
  prix_unitaire bigint not null check (prix_unitaire >= 0),
  montant bigint generated always as (quantite::bigint * prix_unitaire) stored,
  ordre integer not null default 0
);

create table public.ony_devis_versions (
  id uuid primary key default gen_random_uuid(),
  devis_id uuid not null references public.ony_devis(id) on delete cascade,
  version integer not null check (version > 0),
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique(devis_id,version)
);

create table public.ony_reservations (
  id uuid primary key default gen_random_uuid(),
  devis_id uuid not null unique references public.ony_devis(id),
  statut text not null default 'en_attente'
    check (statut in ('en_attente','confirmee','en_cours','terminee','annulee')),
  date_sortie timestamptz not null,
  date_retour timestamptz not null,
  created_at timestamptz not null default now(),
  constraint ony_reservation_dates_valid check (date_retour > date_sortie)
);

create table public.ony_reservation_lignes (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.ony_reservations(id) on delete cascade,
  produit_id text not null references public.products(id),
  quantite integer not null check (quantite > 0),
  unique(reservation_id,produit_id)
);

create table public.ony_paiements (
  id uuid primary key default gen_random_uuid(),
  devis_id uuid not null references public.ony_devis(id),
  montant bigint not null check (montant > 0),
  nature text not null check (nature in ('acompte','solde','caution','remboursement','autre')),
  methode text,
  reference_externe text,
  enregistre_par uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.ony_documents (
  id uuid primary key default gen_random_uuid(),
  devis_id uuid not null references public.ony_devis(id),
  version integer not null,
  chemin_storage text not null,
  created_at timestamptz not null default now(),
  unique(devis_id,version)
);

create table public.ony_devis_evenements (
  id bigint generated always as identity primary key,
  devis_id uuid not null references public.ony_devis(id),
  acteur_id uuid references auth.users(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index ony_devis_client_idx on public.ony_devis(client_id,created_at desc);
create index ony_devis_statut_idx on public.ony_devis(statut,created_at desc);
create index ony_reservation_dates_idx on public.ony_reservations(date_sortie,date_retour);
create index ony_reservation_lignes_produit_idx on public.ony_reservation_lignes(produit_id);

-- Defense in depth : aucune policy de lecture/ecriture ouverte sur les donnees privees.
alter table public.ony_clients enable row level security;
alter table public.ony_devis enable row level security;
alter table public.ony_devis_lignes enable row level security;
alter table public.ony_devis_versions enable row level security;
alter table public.ony_reservations enable row level security;
alter table public.ony_reservation_lignes enable row level security;
alter table public.ony_paiements enable row level security;
alter table public.ony_documents enable row level security;
alter table public.ony_devis_evenements enable row level security;

revoke all on public.ony_clients,public.ony_devis,public.ony_devis_lignes,
public.ony_devis_versions,public.ony_reservations,public.ony_reservation_lignes,
public.ony_paiements,public.ony_documents,public.ony_devis_evenements
from anon,authenticated;

commit;

-- IMPORTANT :
-- 1. Ne pas appliquer avant definition des roles, API et tests.
-- 2. Le numero du devis sera attribue par transaction serveur (pas MAX(numero)+1).
-- 3. La verification des disponibilites doit etre atomique.
-- 4. Les totaux devront etre recalcules serveur a chaque validation.
-- 5. Les remboursements doivent avoir une comptabilisation distincte ; aucun montant negatif.
