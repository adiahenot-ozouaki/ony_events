# ONY — intégration progressive des devis web et mobile

## Diagnostic confirmé (lecture seule, 26 octobre 2026)

- Frontend React 18 / TypeScript / Vite, route `/devis`, panier `CartContext`, formulaire `QuoteForm`.
- Les articles affichés proviennent de `products` via `src/lib/products.ts`.
- `useQuoteForm` appelle la fonction Supabase `submit-devis`.
- La version 4 de `submit-devis` vérifie les entrées, récupère les prix de `products`, recalcule le total et enregistre dans `devis_requests`.
- Les projets Supabase `ony` et `Stock+` sont signalés INACTIVE lors de l'audit : schémas, politiques RLS, données et intégration de stock non inspectables actuellement.

## Principes validés

- Client : demande depuis le catalogue sans validation automatique du devis.
- Personnel ONY : création manuelle, ajustement et validation d'un devis définitif.
- La caution remboursable est distincte du montant commercial.
- Calcul et vérification des droits définitifs côté serveur. Aucun secret Supabase dans le frontend.
- Ne pas recopier automatiquement les quantités de `Stock+` : définir d'abord le système source des disponibilités et un flux de synchronisation sûr.
- Prévoir numérotation atomique, instantané des prix, versionnement des devis envoyés, audit et protection contre les doubles réservations.
- Conserver le formulaire public existant pendant la migration.

## Module de calcul préparatoire

`src/lib/devis/pricing.ts` est pur et testable. Il requiert explicitement un taux d'acompte et une caution. Il n'impose pas la règle contractuelle actuelle, qui doit devenir paramétrable et être approuvée avant mise en production. Les lignes et montants sont des entiers FCFA.

Ce module n'est pas encore branché sur l'interface publique : la fonction serveur existante reste la seule source de vérité des montants soumis.

## Travaux bloquants avant mise en production

1. Restaurer l'accès aux bases et inspecter les structures réelles sans les modifier.
2. Vérifier les politiques RLS, rôles administrateurs et limites d'accès aux informations clients.
3. Concevoir des migrations compatibles avec `devis_requests` et `products`, puis tester hors production.
4. Implémenter les endpoints authentifiés : créer, modifier, valider, accepter, générer PDF et enregistrer les paiements.
5. Gérer les disponibilités par intervalle de dates avec réservation atomique.
6. Ajouter des tests d'intégration et tester le parcours web.
7. Réutiliser la logique serveur pour la future application mobile après audit de compatibilité Capacitor.

## Statut

Cette branche introduit uniquement la fondation de calcul et des tests ; aucune table, Edge Function ou donnée de production n'a été modifiée.
