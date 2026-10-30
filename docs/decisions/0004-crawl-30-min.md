# 0004. Crawl toutes les 30 minutes

Statut : acceptée. Remplace la durée de crawl de 0002 (15 min).

## Contexte

Après 0002, les pages sont statiques mais le Fluid CPU Vercel reste haut : 1 h 05, environ 30 % du total du compte Hobby. Le crawl (jusqu'à 100 pages Helix, puis `/users` et `/channels`) en est l'essentiel. Helix trie `/streams` par viewers décroissants : les petits lives sont sur les dernières pages, impossible de ne récupérer que les 200 ou 300 derniers.

## Décision

- `CRAWL_SECONDS` passe de 900 à 1800 : `cacheLife` revalidate et `s-maxage` de `/api/crawl` suivent.
- Le crawl reste paresseux : aucun cron, il ne se relance qu'à une visite qui trouve une liste de plus de 30 min (stale-while-revalidate). Sans visite pendant plus d'une heure (`expire`), la visite suivante attend un crawl complet.
- Les textes « mis à jour toutes les 15 minutes » passent à 30.

## Conséquences

- Environ deux fois moins de CPU de crawl.
- La liste peut avoir jusqu'à 30 min de retard : un live peut avoir fini, un signalement met jusqu'à 30 min à s'appliquer.

## Suite

Si le CPU reste trop haut : sortir le crawl de Vercel dans un cron GitHub Actions (repo public, minutes gratuites) qui publie un JSON statique, l'alternative rejetée de 0002.
