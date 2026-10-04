# Vote

Un viewer connecté avec Twitch soutient ou signale un streamer depuis sa card ou la vue gros plan (Theater).

## Langage

- **Soutien** (like) : valeur `1`.
- **Signalement** (dislike) : valeur `-1`. Le live ne correspond pas à l'esprit 0Viewers.
- Un vote par viewer et par streamer (Twitch **broadcaster id**, pas l'id du stream qui change à chaque live).

## API publique

`index.ts`, serveur uniquement : `castVote(viewerId, broadcasterId, value)` (0 retire le vote) renvoie le nombre de Signalements, `getHiddenBroadcasters()` liste les streamers masqués. Action serveur `vote()` dans `actions.ts`. Règles pures dans `rule.ts` (`parseVote`, `nextVote`, `HIDE_AT`).

## Invariants

- Seul un viewer connecté vote : l'action relit `currentViewer()` (`src/compte`), jamais un id venu du client.
- À `HIDE_AT = 10` Signalements, le streamer sort de toutes les listes et passe dans `/mis-de-cote` (raison `signalements`). Réversible : retirer des votes le fait revenir.
- Aucune lecture Neon par visite : `getHiddenBroadcasters()` est en cache 1 h, tag `hidden` invalidé par un vote proche du seuil. Le filtre est appliqué hors du cache du crawl, pour qu'un vote ne relance pas le crawl Twitch.
- Ses propres votes sont gardés dans le `localStorage` du navigateur pour l'état des boutons. Sur un autre appareil les boutons partent neutres, la base reste la référence.

## Provenance des données

Table `vote` et vue `broadcaster_score` dans Neon (`db/schema.sql`), client partagé `src/db.ts`.
