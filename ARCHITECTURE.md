# Architecture

Une app Next.js (App Router, TypeScript). Contexte et choix : [ADR 0001](docs/decisions/0001-single-nextjs-app.md).

## Couches

| Dossier | Rôle | Environnement |
|---|---|---|
| `src/app` | Pages, métadonnées SEO, `sitemap`, `robots`, image OpenGraph (`opengraph-image.tsx`, générée par `next/og`) | Serveur |
| `src/decouverte` | Contexte Découverte : appels Twitch, règle de sélection, fixtures | Serveur (`server-only`) |
| `src/ui` | Composants interactifs (Reco, recherche, lecteur Twitch, mode cinéma) | Client |

Les dépendances vont dans un seul sens : `app` utilise `decouverte` et `ui`, `ui` ne connaît que le type `Streamer0V`.

## Flux de données

```
Twitch Helix -> twitch.ts (couche anticorruption) -> rule.ts (règle)
  -> getZeroViewersStreamers() -> pages ISR (/ et /streamers) -> composants client
```

1. `twitch.ts` obtient un token d'application, lit les streams `language=fr` (100 par page, 100 pages max) puis les profils des streamers retenus.
2. `rule.ts` garde les lives de plus de 10 minutes avec 5 viewers ou moins, trie par `viewer_count` croissant puis `started_at` croissant, et coupe à 50.
3. `getZeroViewersStreamers()` renvoie des `Streamer0V`. Les pages `/` et `/streamers` sont rendues avec `revalidate = 300`.
4. Les composants client reçoivent la liste en props : recherche, tirage de la Reco et lecteur Twitch n'appellent jamais Twitch.

## Cache et échec Twitch

- Token manquant ou erreur HTTP : `twitch.ts` lève une erreur, rien n'est mis en cache. Pendant une revalidation, Next garde la page précédente. Au premier rendu, `error.tsx` s'affiche.
- Plafond de 100 pages : un `console.warn` est émis et la liste partielle est quand même renvoyée.
- Une liste vide est un résultat valide (nuit, ou tous les streams ont plus de 5 viewers) : les pages affichent un état vide.

## Mode fixtures

`TWITCH_FIXTURES=1` remplace Twitch par un jeu de données figé (`src/decouverte/fixtures.ts`). Il sert à la CI, au smoke test et à Lighthouse, sans clés.

## Qualité

La CI (`.github/workflows/ci.yml`) enchaîne typecheck, lint, tests, build, smoke test et Lighthouse mobile sur `/` et `/streamers` (budgets dans `lighthouserc.json` : performance 0,90, accessibilité 1, SEO 1, bonnes pratiques 0,95). Dependabot tourne chaque semaine.
