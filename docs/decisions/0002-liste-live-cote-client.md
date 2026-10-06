# 0002. Liste live chargée côté client via un endpoint caché CDN

Statut : acceptée. Remplace le point ISR de 0001.

## Contexte

Toutes les pages qui lisaient `getCrawl()` héritaient de son `revalidate` de 240 s : `/`, `/streamers`, `/categories`, chaque `/categories/[slug]`, chaque image OG de catégorie, `sitemap.xml` et `llms.txt`. Chaque cycle réécrivait toutes ces entrées ISR et refaisait leur rendu. Mesure sur Vercel Hobby, 4 jours après la mise en ligne : environ 107 000 ISR write units sur 200 000 par mois (99,8 % du compte) et 41 % du Fluid CPU de tous les projets.

## Décision

- `GET /api/crawl` est la seule route qui lit le crawl pour les visiteurs. Elle est dynamique (`connection()`) et renvoie `Cache-Control: public, s-maxage=900, stale-while-revalidate=3600`. Le cache CDN ne coûte aucune écriture ISR.
- `/`, `/streamers`, `/categories` et `/categories/[slug]` deviennent des coquilles statiques. Les blocs live (`useCrawl`, `src/ui/useCrawl.ts`) récupèrent le JSON une fois par vue de page.
- `/categories/[slug]` garde un `<h1>` et un `<title>` rendus côté serveur grâce au nom Twitch (`findCategory`, `/search/categories`, en cache plusieurs semaines). Une catégorie que Twitch ne connaît pas est en `noindex`.
- L'image OG par catégorie est supprimée : la page hérite de celle de `/categories`.
- `sitemap.xml` ne liste plus les catégories live (elles changent plus vite que Google ne repasse) : il devient statique. `llms.txt` passe à 1 jour (`cacheLife("days")` explicite sur la fonction englobante).
- Les jaquettes de catégorie sont gardées en mémoire par instance : seuls les ids jamais vus appellent `/games`.
- `/mis-de-cote` (noindex, peu visitée) est rendue à la requête.
- Le crawl passe de 4 à 15 minutes.

## Conséquences

- Les écritures ISR ne viennent plus que des pages de catégorie (une fois par semaine et par slug), et de `llms.txt` (une fois par jour).
- Le HTML ne contient plus la liste des streamers : moins de contenu indexable sur ces pages. `/streamers` garde un JSON-LD `ItemList` des catégories en direct, via `getDailyCategories` (1 jour, même coût que `llms.txt`).
- Un signalement qui masque un streamer met jusqu'à 15 min à atteindre le cache CDN.
- `findCategory` fait une recherche floue : une catégorie au nom exotique peut ne pas être retrouvée et passer en `noindex`.

## Alternatives rejetées

- Changer de framework (Nuxt, Nest) : le coût vient du découpage du cache, pas de Next. Le même ISR sur Vercel coûterait autant.
- Seulement allonger le `revalidate` : on divise le coût mais il reste proportionnel au nombre de pages.
- Un cron sur le VPS qui pousse un JSON statique : supprime aussi le CPU du crawl, mais ajoute une machine à surveiller. À reconsidérer si le CPU reste trop haut.
