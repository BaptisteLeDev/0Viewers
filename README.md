# 0Viewers

Projet Camille & Baptiste, MDS B3.

0Viewers trouve les streamers Twitch français en direct devant (presque) personne : 5 viewers ou moins, en live depuis plus de 10 minutes. L'accueil met en avant un streamer (la Reco) et six autres lives, `/streamers` liste les 100 premiers avec recherche et filtres (dont public tout public / adulte), `/jeux` cherche une catégorie Twitch ; un clic ouvre le live en mode cinéma (grand lecteur et chat).

## Lancer

```bash
pnpm i
cp .env.example .env.local   # renseigner TWITCH_CLIENT_ID et TWITCH_CLIENT_SECRET
pnpm dev
```

Sans clés Twitch : `TWITCH_FIXTURES=1 pnpm dev` utilise un jeu de données figé.

## Tests et CI

```bash
pnpm typecheck && pnpm lint && pnpm test
TWITCH_FIXTURES=1 pnpm build && pnpm start   # puis pnpm smoke
```

La CI GitHub ajoute le smoke test et Lighthouse (budgets dans `lighthouserc.json`). En local : `/ci-local`.

## Déploiement (Vercel)

Variables d'environnement : `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` (optionnel). Les déploiements preview sont en `noindex`.

Après le premier déploiement en production :

1. Ajouter la propriété dans Google Search Console.
2. Mettre le code de vérification dans `GOOGLE_SITE_VERIFICATION` et redéployer.
3. Soumettre `/sitemap.xml`.
4. Bing Webmaster Tools : importer la propriété depuis Search Console, ou renseigner `BING_SITE_VERIFICATION`.

## Structure

- `src/app` : pages et SEO
- `src/decouverte` : contexte serveur (Twitch, règle de sélection)
- `src/ui` : composants client
- `docs/decisions` : ADR
- `slide/` : présentation du projet
- `doc/` : notes d'API et TODO

Détails : [ARCHITECTURE.md](ARCHITECTURE.md), [src/decouverte/README.md](src/decouverte/README.md).
