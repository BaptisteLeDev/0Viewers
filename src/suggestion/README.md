# Suggestion

Boîte à idées : un viewer connecté avec Twitch envoie une proposition d'amélioration du site, d'une fonctionnalité ou de l'algo.

## Langage

- **Suggestion** : une proposition, avec un type (`feature`, `bug`, `algo`, `autre`) et un texte.
- **Statut** : `nouvelle`, `lue`, `faite`, `refusee`. Changé à la main dans Neon, pas d'interface d'admin pour l'instant.

## API publique

`index.ts`, serveur uniquement : `parseSuggestion(kind, body)` valide l'entrée du formulaire (pur, dans `rule.ts`), `saveSuggestion(viewerId, suggestion)` l'enregistre et renvoie `ok`, `limit` ou `unavailable`.

## Invariants

- Seul un viewer connecté envoie : l'action serveur relit `currentViewer()` (`src/compte`), jamais un id venu du client.
- Texte de 10 à 2000 caractères après `trim`, vérifié côté serveur et par la contrainte SQL.
- Au plus `MAX_PER_DAY = 5` suggestions par viewer sur 24 h glissantes, compté et inséré en une seule requête.
- Erreur Neon ou `DATABASE_URL` absente : `unavailable`, message générique au viewer, détail en log.

## Provenance des données

Table `suggestion` dans Neon (`db/schema.sql`), client partagé `src/db.ts`. Page `/suggestions`.
