# Découverte

Contexte qui trouve les streamers Twitch français en live devant (presque) personne.

## Langage

- **Streamer0V** : streamer français en live avec 5 viewers ou moins depuis plus de 10 minutes.
- **Reco** : le Streamer0V mis en avant sur l'accueil, tiré au hasard côté client.
- **Découverte** : ce contexte.

## API publique

`getZeroViewersStreamers(): Promise<Streamer0V[]>` dans `index.ts`, réservé au serveur. Le type `Streamer0V` est ré-exporté. Le reste du dossier est interne.

## Invariants

- Au plus `MAX_VIEWERS = 5` viewers.
- En live depuis plus de `MIN_LIVE_MINUTES = 10` minutes.
- Tri par viewers croissants, puis par `started_at` croissant.
- Au plus `MAX_STREAMERS = 50` résultats.
- Une erreur Twitch ou un token manquant lève une exception : jamais de liste vide à la place, la page précédente reste servie.
- Plafond de 100 pages de streams : `console.warn`, liste partielle renvoyée.

## Provenance des données

API Twitch Helix avec un token d'application (`TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`) : `/streams?language=fr` puis `/users` pour les profils. Rien d'autre n'appelle Twitch. Avec `TWITCH_FIXTURES=1`, les données viennent de `fixtures.ts`.

Tests : `rule.test.ts` (règle), `twitch.test.ts` (appels et erreurs).

## Décision

[ADR 0001](../../docs/decisions/0001-single-nextjs-app.md)
