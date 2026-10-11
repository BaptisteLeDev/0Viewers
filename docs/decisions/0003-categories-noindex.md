# 0003. Pages catégories en noindex

Statut : acceptée. Complète 0002 (sitemap et ISR des catégories).

## Contexte

Search Console signale `/categories` et `/categories/[slug]` en « Détectée, actuellement non indexée » (59 pages, depuis le 05/10/2026). Ce sont des pages de listing qui changent sans cesse : peu de valeur de recherche, beaucoup de pages pauvres.

## Décision

- `/categories` et `/categories/[slug]` portent `robots: { index: false, follow: true }`. Les liens restent suivis.
- Elles sont retirées de `PUBLIC_PATHS`, donc absentes de `sitemap.xml`.
- Pas de `Disallow` dans `robots.txt` : Google doit crawler la page pour voir le `noindex`.

## Conséquences

- Les pages déjà indexées sortent de Google au prochain passage. Les retirer tout de suite demande une suppression dans Search Console (action manuelle, hors code).
- `scripts/smoke.mjs` vérifie que seules les pages `/categories*` sont `noindex`.
