# Découverte

Contexte qui trouve les streamers Twitch français en live devant (presque) personne.

## Langage

- **Streamer0V** : streamer français en live avec 5 viewers ou moins depuis plus de 10 minutes.
- **Reco** : le Streamer0V mis en avant sur l'accueil, tiré au hasard côté client.
- **Jeu** (`Game`) : regroupement des Streamer0V par jeu, identifié par son **slug** (`slugifyGame`, ex. `league-of-legends`). Une page `/jeux/{slug}` par jeu en live.
- **Découverte** : ce contexte.

## API publique

`getCrawl(): Promise<{ streamers, crawledAt }>` dans `index.ts`, réservé au serveur : un crawl partagé entre pages (`"use cache"`, `cacheLife` stale 60 s / revalidate 240 s / expire 1 h, tag `streams`). `crawledAt` sert d'heure de référence aux pages (durées de live, filtres, sitemap). `getZeroViewersStreamers()` en renvoie juste la liste. `searchCategories(q)` cherche une **Catégorie** Twitch (`Category` : id, nom, slug, jaquette), mise en cache 1 jour par requête. Le type `Streamer0V` est ré-exporté, ainsi que `groupByGame` et `slugifyGame` (purs, `games.ts`, aussi importables côté client). Le reste du dossier est interne.

## Invariants

- Au plus `MAX_VIEWERS = 5` viewers.
- En live depuis plus de `MIN_LIVE_MINUTES = 10` minutes.
- Tri par viewers croissants, puis par `started_at` croissant.
- Au plus `MAX_STREAMERS = 100` résultats (une seule requête `/users` et `/channels`, plafond Helix 100 ids).
- `mature` vaut `true` si la chaîne a au moins un label de classification de contenu (CCL).
- Une erreur Twitch ou un token manquant lève une exception, jamais mise en cache : jamais de liste vide à la place, la donnée ou la page précédente reste servie.
- Plafond de 100 pages de streams : `console.warn`, liste partielle renvoyée.

## Provenance des données

API Twitch Helix avec un token d'application (`TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`) : `/streams?language=fr`, puis `/users` (profils) et `/channels` (CCL), et `/search/categories` pour la recherche de catégorie. Rien d'autre n'appelle Twitch. Avec `TWITCH_FIXTURES=1`, les données viennent de `fixtures.ts`.

Tests : `rule.test.ts` (règle), `twitch.test.ts` (appels et erreurs), `games.test.ts` (slug et regroupement).

## Décision

[ADR 0001](../../docs/decisions/0001-single-nextjs-app.md)
