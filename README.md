# 0Viewers

Projet Camille & Baptiste, MDS B3.

0Viewers trouve les streamers Twitch français en direct devant (presque) personne : 5 viewers ou moins, en live depuis plus de 10 minutes. L'accueil montre cinq lives pris au hasard (pile de cartes) et un carrousel des lives du moment, `/streamers` liste les 150 premiers (10 au départ, puis par 25) avec recherche et filtres (dont public tout public / adulte), `/categories` liste les catégories Twitch en live avec leur jaquette (`/jeux` redirige) ; un clic ouvre le live en mode cinéma (grand lecteur et chat).

## Lancer

```bash
bun install
cp .env.example .env.local   # renseigner TWITCH_CLIENT_ID et TWITCH_CLIENT_SECRET
bun run dev
```

Sans clés Twitch : `TWITCH_FIXTURES=1 bun run dev` utilise un jeu de données figé.

## Tests et CI

```bash
bun run typecheck && bun run lint && bun run test
TWITCH_FIXTURES=1 bun run build && bun run start   # puis bun run smoke
```

La CI tourne uniquement en local avec `gh act` (rien ne part sur GitHub Actions) : `bun run ci`. Elle ajoute le smoke test et Lighthouse (budgets dans `lighthouserc.json`). Prérequis : `gh extension install nektos/gh-act`, plus Podman sous Windows (le script démarre la machine) ou Docker sous Linux.

## Déploiement (Vercel)

Variables d'environnement : `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`. Les déploiements preview sont en `noindex`.

Après le premier déploiement en production :

1. Ajouter la propriété dans Google Search Console.
2. Mettre le code de vérification dans `GOOGLE_SITE_VERIFICATION` et redéployer.
3. Soumettre `/sitemap.xml`.
4. Idem sur Bing Webmaster Tools (`BING_SITE_VERIFICATION`), ou importer le site depuis la Search Console.

`/robots.txt` autorise nommément les crawlers IA (`AI_CRAWLERS` dans `src/site.ts`), `/llms.txt` décrit le site aux LLM.

## Structure

- `src/app` : pages et SEO
- `src/decouverte` : contexte serveur (Twitch, règle de sélection)
- `src/ui` : composants client
- `docs/decisions` : ADR
- `slide/` : présentation du projet
- `doc/` : notes d'API et TODO

Détails : [ARCHITECTURE.md](ARCHITECTURE.md), [src/decouverte/README.md](src/decouverte/README.md).
