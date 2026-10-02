# Architecture

Une app Next.js (App Router, TypeScript). Contexte et choix : [ADR 0001](docs/decisions/0001-single-nextjs-app.md).

## Couches

| Dossier | Rôle | Environnement |
|---|---|---|
| `src/app` | Pages, métadonnées SEO, `sitemap`, `robots`, image OpenGraph (`opengraph-image.tsx`, générée par `next/og`) | Serveur |
| `src/decouverte` | Contexte Découverte : appels Twitch, règle de sélection, regroupement par jeu, fixtures | Serveur (`server-only`), sauf `games.ts` et `types.ts` (purs) |
| `src/ui` | Composants interactifs (Reco, recherche, lecteur Twitch, mode cinéma) | Client |

Les dépendances vont dans un seul sens : `app` utilise `decouverte` et `ui`, `ui` ne connaît que le type `Streamer0V` et les fonctions pures de `games.ts` (`slugifyGame`, `groupByGame`).

## Flux de données

```
Twitch Helix -> twitch.ts (couche anticorruption) -> rule.ts (règle)
  -> getZeroViewersStreamers() (cache partagé 240 s) -> pages ISR (/, /streamers, /jeux, /jeux/[slug], sitemap) -> composants client
```

1. `twitch.ts` obtient un token d'application, lit les streams `language=fr` (100 par page, 100 pages max) puis les profils des streamers retenus.
2. `rule.ts` garde les lives de plus de 10 minutes avec 5 viewers ou moins, trie par `viewer_count` croissant puis `started_at` croissant, et coupe à 50.
3. `getZeroViewersStreamers()` renvoie des `Streamer0V`. Un seul crawl Twitch est partagé par toutes les pages via `unstable_cache` (`revalidate: 240`, tag `streams`), plus `React.cache` pour un rendu. Les pages sont rendues avec `revalidate = 60` (sitemap 300) : une page régénérée sur une donnée périmée attend le nouveau crawl, donc les listes ont au plus 5 minutes environ sous trafic.
4. Les composants client reçoivent la liste en props : recherche, tirage de la Reco et lecteur Twitch n'appellent jamais Twitch.

## Cache et échec Twitch

- Token manquant ou erreur HTTP : `twitch.ts` lève une erreur, rien n'est mis en cache (`unstable_cache` n'enregistre que les succès). Si une donnée périmée existe, `unstable_cache` la renvoie et journalise l'erreur ; sinon l'erreur remonte, Next garde la page précédente, et au premier rendu `error.tsx` s'affiche.
- Plafond de 100 pages : un `console.warn` est émis et la liste partielle est quand même renvoyée.
- Une liste vide est un résultat valide (nuit, ou tous les streams ont plus de 5 viewers) : les pages affichent un état vide.

## Mode fixtures

`TWITCH_FIXTURES=1` remplace Twitch par un jeu de données figé (`src/decouverte/fixtures.ts`). Il sert à la CI, au smoke test et à Lighthouse, sans clés.

## Qualité

La CI (`.github/workflows/ci.yml`) enchaîne typecheck, lint, tests, build, smoke test et Lighthouse mobile sur `/`, `/streamers` et `/jeux/minecraft` (budgets dans `lighthouserc.json` : performance 0,90, accessibilité 1, SEO 1, bonnes pratiques 0,95). Dependabot tourne chaque semaine.
