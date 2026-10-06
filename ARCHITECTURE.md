# Architecture

Une app Next.js (App Router, TypeScript). Contexte et choix : [ADR 0001](docs/decisions/0001-single-nextjs-app.md).

## Couches

| Dossier | Rôle | Environnement |
|---|---|---|
| `src/app` | Pages, métadonnées SEO, `sitemap`, `robots`, image OpenGraph (`opengraph-image.tsx`, générée par `next/og`) | Serveur |
| `src/decouverte` | Contexte Découverte : appels Twitch, règle de sélection, regroupement par catégorie, fixtures | Serveur (`server-only`), sauf `categories.ts` et `types.ts` (purs) |
| `src/compte` | Contexte Compte : connexion Twitch OAuth, cookie de session signé (HMAC), table `viewer` sur Neon | Serveur |
| `src/ui` | Composants interactifs (Reco, recherche, lecteur Twitch, mode cinéma) | Client |

Les dépendances vont dans un seul sens : `app` utilise `decouverte` et `ui`, `ui` ne connaît que le type `Streamer0V` et les fonctions pures de `categories.ts` (`slugifyCategory`, `groupByCategory`).

## Flux de données

```
Twitch Helix -> twitch.ts (couche anticorruption) -> rule.ts (règle)
  -> getCrawl() ("use cache: remote", 900 s) -> GET /api/crawl (CDN s-maxage 900) -> useCrawl() dans les composants client
  pages = coquilles statiques (/, /streamers, /categories, /categories/[slug]) ; sitemap statique, llms.txt en cache 1 jour
```

Pourquoi la liste n'est pas dans le HTML : [ADR 0002](docs/decisions/0002-liste-live-cote-client.md).

1. `twitch.ts` obtient un token d'application, lit les streams `language=fr` (100 par page, 100 pages max) puis, en parallèle, les profils (`/users`) et les labels de classification de contenu (`/channels`, `content_classification_labels`) des streamers retenus, et les jaquettes des catégories (`/games`, non bloquant : un échec donne des tuiles sans image). Un streamer est `mature` dès qu'il a un label : `is_mature` de `/streams` est déprécié et vaut toujours `false`.
2. `rule.ts` garde les lives de plus de 10 minutes avec 5 viewers ou moins, trie par `viewer_count` croissant puis `started_at` croissant, et coupe à 150.
3. `getCrawl()` renvoie les `Streamer0V`, `boxArt` (id de catégorie -> jaquette) et `crawledAt`. Le crawl est en `"use cache: remote"`, partagé entre instances Vercel (`cacheLife` stale 60 / revalidate 900 / expire 3600, tag `streams`). Les visiteurs ne le lisent qu'à travers `GET /api/crawl`, une route dynamique mise en cache par le CDN 15 min (aucune écriture ISR). Les pages ne lisent pas le crawl : leur HTML est statique.
4. `useCrawl()` (`src/ui/useCrawl.ts`) fait une requête par vue de page, partagée par tous les blocs live (pile de cartes, compteurs, catégories, liste filtrable). Recherche, tirage et lecteur Twitch n'appellent jamais Twitch. Les durées de live se calculent à partir de `crawledAt`.
5. Seule exception : la recherche de catégorie de `/categories` appelle `GET /api/categories?q=` (2 à 100 caractères), qui passe par `searchCategories()` (`/search/categories`, `"use cache: remote"` 1 jour par requête).

## Connexion Twitch

`/api/auth/twitch` redirige vers Twitch avec un `state` en cookie. `/api/auth/twitch/callback` vérifie ce `state`, échange le code, lit `/users`, fait un upsert dans `viewer` (Neon, `src/db.ts`) puis pose deux cookies de 30 jours : `0v_session` (httpOnly, signé avec `SESSION_SECRET`, seul cookie de confiance côté serveur, lu par `currentViewer()`) et `0v_viewer` (pseudo + avatar, lisible en JS, affichage seul). Le header lit `0v_viewer` côté client : les pages restent statiques et une visite ne déclenche aucune fonction Vercel ni requête Neon. Seules `/profil`, `/admin` (propriétaire seul, 404 pour les autres via `src/proxy.ts`, voir `src/vote/README.md`), les routes d'auth et les votes s'exécutent côté serveur. Schéma : `db/schema.sql`.

## Cache et échec Twitch

- Token manquant ou erreur HTTP : `twitch.ts` lève une erreur, rien n'est mis en cache. Si une donnée périmée existe, elle reste servie jusqu'à son expiration (1 h) ; sinon l'erreur remonte, Next garde la page précédente, et au premier rendu `error.tsx` s'affiche.
- Plafond de 100 pages : un `console.warn` est émis et la liste partielle est quand même renvoyée.
- Une liste vide est un résultat valide (nuit, ou tous les streams ont plus de 5 viewers) : les pages affichent un état vide.

## Mode fixtures

`TWITCH_FIXTURES=1` remplace Twitch par un jeu de données figé (`src/decouverte/fixtures.ts`). Il sert à la CI, au smoke test et à Lighthouse, sans clés.

## Qualité

La CI (`.github/workflows/ci.yml`) enchaîne typecheck, lint, tests, build, smoke test et Lighthouse mobile sur `/`, `/streamers` et `/categories/minecraft` (budgets dans `lighthouserc.json` : performance 0,90, accessibilité 1, SEO 1, bonnes pratiques 0,95). Dependabot tourne chaque semaine.
