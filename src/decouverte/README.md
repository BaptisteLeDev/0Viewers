# Découverte

Contexte qui trouve les streamers Twitch français en live devant (presque) personne.

## Langage

- **Streamer0V** : streamer français en live avec 5 viewers ou moins depuis plus de 10 minutes.
- **Reco** : le Streamer0V mis en avant sur l'accueil, tiré au hasard côté client.
- **Catégorie** (`LiveCategory`, catégorie Twitch) : regroupement des Streamer0V par catégorie, identifiée par son **slug** (`slugifyCategory`, ex. `league-of-legends`), avec sa jaquette (`boxArtUrl`, via Helix `/games`). Une page `/categories/{slug}` par catégorie en live.
- **Découverte** : ce contexte.

## API publique

`getCrawl(): Promise<{ streamers, setAside, boxArt, crawledAt }>` dans `index.ts`, réservé au serveur : un crawl partagé (`"use cache: remote"`, revalidate `CRAWL_SECONDS` = 900 s, tag `streams`). Les visiteurs le lisent via `getLiveCrawl()` (sans `setAside`) derrière `GET /api/crawl`, mis en cache par le CDN : une page qui appelle `getCrawl()` redevient une entrée ISR réécrite à chaque crawl ([ADR 0002](../../docs/decisions/0002-liste-live-cote-client.md)). `findCategory(slug)` retrouve le nom Twitch d'un slug (cache de plusieurs semaines). `setAside` liste les **Streams mis de côté** avec leur raison (`media`, `crypto`, `gambling`), affichés sur `/mis-de-cote`. `crawledAt` sert d'heure de référence aux pages (durées de live, filtres, sitemap). `getZeroViewersStreamers()` en renvoie juste la liste. `searchCategories(q)` cherche une **Catégorie** Twitch (`Category` : id, nom, slug, jaquette), mise en cache 1 jour par requête. Le type `Streamer0V` est ré-exporté, ainsi que `groupByCategory` et `slugifyCategory` (purs, `categories.ts`, aussi importables côté client). Le reste du dossier est interne.

## Invariants

- Au plus `MAX_VIEWERS = 5` viewers.
- En live depuis plus de `MIN_LIVE_MINUTES = 10` minutes.
- Exclus : streams dont le titre ou la catégorie contient le mot `radio`, `tv`, `france`, `ville`, `media` ou `journal`/`journaux` (mot entier, camelCase découpé : `FranceTV` exclu, `souffrance` gardé), ou dont un tag contient ces mots, `oldies`, `annee70` ou `annee80` (sous-chaîne, accents ignorés : `webradio`, `Années80`).
- Un pseudo (login) contenant un de ces mots n'exclut pas : le streamer passe en fin de liste.
- Crypto (`trading`, `crypto`, `btc`) : exclu si dans le pseudo, un tag, la catégorie ou la bio de la chaîne (`/users`), en fin de liste si seulement dans le titre. La bio arrive après la coupe à 150 : la liste peut finir un peu en dessous.
- Tri par viewers croissants, puis par `started_at` croissant.
- Au plus `MAX_STREAMERS = 150` résultats (`/users` et `/channels` découpés en lots de 100 ids, plafond Helix).
- Paris : chaîne avec le CCL `Gambling` exclue (vient de `/channels`, après la coupe à 150).
- Les exclusions (pas les critères viewers/durée) vont dans `setAside`, au plus 150 par étape.
- `mature` vaut `true` si la chaîne a au moins un label de classification de contenu (CCL).
- Une erreur Twitch ou un token manquant lève une exception, jamais mise en cache : jamais de liste vide à la place, la donnée ou la page précédente reste servie.
- Plafond de 100 pages de streams : `console.warn`, liste partielle renvoyée.

## Provenance des données

API Twitch Helix avec un token d'application (`TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`) : `/streams?language=fr`, puis `/users` (profils) et `/channels` (CCL), et `/search/categories` pour la recherche de catégorie. Rien d'autre n'appelle Twitch. Avec `TWITCH_FIXTURES=1`, les données viennent de `fixtures.ts`.

Tests : `rule.test.ts` (règle), `twitch.test.ts` (appels et erreurs), `games.test.ts` (slug et regroupement).

## Neon (compteur de lives FR)

`live-count.ts` écrit le nombre total de lives FR vus par le crawl dans `live_count`, une ligne par heure UTC (le max de l'heure). La page `/stats` les relit (cache 1 h).

Budget du plan gratuit Neon (compute 0,25 CU fixe, mise en veille après 5 min) :

| Limite | Plafond | Usage visé |
|---|---|---|
| Compute | 100 CU-h/mois, soit ~400 h éveillé | 1 écriture par heure et par instance + 1 lecture par heure : ~10 à 20 min éveillé par heure, 30 à 60 CU-h/mois |
| Stockage | 1 Go | 24 lignes/jour, purgées après 1 an : moins de 1 Mo |

Règle : aucune requête Neon par visite. Toute lecture passe par `"use cache: remote"` (le `"use cache"` par défaut vit en mémoire de chaque instance Vercel : chaque instance neuve relit Neon et recrawle Twitch), sinon le compute ne dort jamais (730 h x 0,25 = 182 CU-h, limite dépassée). Plafond atteint : Neon suspend le compute jusqu'au mois suivant, sans facturation ; l'écriture et `/stats` échouent sans casser le crawl.

## Décision

[ADR 0001](../../docs/decisions/0001-single-nextjs-app.md)
