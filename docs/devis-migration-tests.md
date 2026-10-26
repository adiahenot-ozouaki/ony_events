# ONY — protocole de verification de migration

Migration proposee : `supabase/migrations_drafts/ony_devis_v1.sql` (brouillon NON APPLIQUE).

## Preflight sur un environnement de test
1. Sauvegarder les definitions du schema et verifier la migration contre une copie representative.
2. Verifier l'existence de `auth.users`, `public.products(id text)`, `public.devis_requests(id uuid)`.
3. Executer la migration dans une base ISOLEE, pas dans la production ONY.
4. Verifier avec `information_schema.tables` que les 9 tables `ony_*` ont ete creees.
5. Verifier avec `pg_class` que RLS est active et avec `pg_policies` qu'aucune politique publique n'expose les donnees privees.
6. Verifier que les roles anon/authenticated ne peuvent lire, inserer ou modifier directement ces tables.
7. Tester les contraintes FK, les valeurs de statut, les dates et les montants invalides.
8. Tester que les deux tables existantes et leurs donnees sont intactes.
9. Implementer ensuite les routes serveur avec authorization fondee sur des roles securises avant ouverture fonctionnelle.

## Hors portee volontaire
- Numero automatique, verrous anti-double-reservation, versements/remboursements, validation de devis, generation PDF et politiques client/admin.
- Aucune integration de `Stock+` avant validation du referentiel de stock.
- La migration ne cree aucune policy client/admin et ne rend donc pas encore ces tables directement accessibles a l'application.

## Etat constate le 26 octobre 2026
Base ONY active et accessible. Comptages SQL reels : `public.products=72`, `public.devis_requests=3`. Le chiffre `rows=0` de `list_tables` n'etait qu'une estimation non representative.
`public.products` possede une policy SELECT publique.
`public.devis_requests` a RLS active sans policy, les demandes sont creees via Edge Function serveur `submit-devis`.
