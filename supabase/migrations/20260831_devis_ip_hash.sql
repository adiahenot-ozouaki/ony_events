-- Optionnel mais recommandé pour le rate-limit par IP
alter table public.devis_requests
  add column if not exists ip_hash text;

create index if not exists devis_requests_ip_hash_created_at_idx
  on public.devis_requests (ip_hash, created_at desc);

-- Une fois l'Edge Function déployée et testée, restreindre l'insert anon :
-- drop policy if exists "Permettre l'insertion publique de devis" on public.devis_requests;
-- (les insertions passent alors uniquement via la service role de l'Edge Function)
