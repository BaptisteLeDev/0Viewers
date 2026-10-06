# Vote

Un viewer connecté avec Twitch soutient ou signale un streamer depuis sa card ou la vue gros plan (Theater).

## Langage

- **Soutien** (like) : valeur `1`.
- **Signalement** (dislike) : valeur `-1`. Le live ne correspond pas à l'esprit 0Viewers.
- Un vote par viewer et par streamer (Twitch **broadcaster id**, pas l'id du stream qui change à chaque live).

## API publique

`index.ts`, serveur uniquement : `castVote(viewerId, broadcasterId, value)` (0 retire le vote) renvoie le nombre de Signalements, `getHiddenBroadcasters()` liste les streamers masqués (en cache). Pour l'admin, sans cache : `listHidden()` (masqués, plus ancien d'abord, avec leur nombre de Signalements), `unhide(broadcasterId)`, `communityActivity()` (nouveaux viewers et Signalements par jour UTC sur 7 jours). Actions serveur `vote()` et `unhideBroadcaster()` dans `actions.ts`. Règles pures dans `rule.ts` (`parseVote`, `parseBroadcasterId`, `nextVote`, `hiddenSince`, `HIDE_AT`).

## Invariants

- Seul un viewer connecté vote : l'action relit `currentViewer()` (`src/compte`), jamais un id venu du client.
- À `HIDE_AT = 10` Signalements, le streamer sort de toutes les listes et passe dans `/mis-de-cote` (raison `signalements`). Réversible : retirer des votes le fait revenir.
- **Masqué depuis** : date du 10e Signalement compté (`hiddenSince`). C'est l'ordre de la liste admin.
- **Réafficher** (admin) : écrit `vote_override.unhidden_at = now()`, aucun vote supprimé. Seuls les Signalements postérieurs comptent ensuite : 10 nouveaux Signalements masquent de nouveau le streamer.
- `/admin` : réservé au viewer dont l'id Twitch vaut `OWNER_TWITCH_ID` (`isOwner`, `src/compte/session.ts`). Variable absente ou vide : personne. `src/proxy.ts` répond 404 aux autres, la page et `unhideBroadcaster()` revérifient.
- Aucune lecture Neon par visite : `getHiddenBroadcasters()` est en cache 1 h, tag `hidden` invalidé par un vote proche du seuil. Le filtre est appliqué hors du cache du crawl, pour qu'un vote ne relance pas le crawl Twitch.
- Ses propres votes sont gardés dans le `localStorage` du navigateur pour l'état des boutons. Sur un autre appareil les boutons partent neutres, la base reste la référence.

## Provenance des données

Tables `vote`, `vote_override` et vue `broadcaster_score` dans Neon (`db/schema.sql`), client partagé `src/db.ts`.
