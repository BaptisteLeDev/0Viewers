# 0001. Une seule app Next.js

Statut : acceptée

## Contexte

Le projet était une SPA Vite (`front/`) plus un serveur Express (`back/`). Le cache fichier et le cron du back ne tournent pas sur Vercel (système de fichiers éphémère, pas de processus long). Le rendu côté client ne donnait aucun SEO. Des secrets avaient été commités et restent exposés dans l'historique git.

## Décision

- Une seule app Next.js (App Router, TypeScript strict), déployée sur Vercel.
- L'ISR (`revalidate = 300`) remplace le cache fichier et le cron : Twitch est interrogé au plus toutes les 5 minutes par page.
- Supabase, comptes utilisateur et avatars sont retirés.
- Le tri par followers est retiré : Get Channel Followers exige un token utilisateur, pas seulement un token d'application.
- Neon et la connexion Twitch (OAuth) sont reportés en v1.1 (Epic #9).
- Miniatures Twitch en `<img>` simple, pas `next/image`.

## Conséquences

- Plus de base de données, plus de backend, un seul déploiement.
- Si Twitch échoue pendant une revalidation, Next continue de servir la dernière page valide. Au tout premier échec, `error.tsx` s'affiche.
- À faire hors code : changer le mot de passe de la base et le secret Twitch exposés dans l'historique git. Les supprimer des fichiers ne suffit pas.

## Alternatives rejetées

- Garder Express en fonctions serverless Vercel : on garde deux apps et un cache à réinventer.
- Cron plus stockage externe : une base de plus pour une liste qui vit 5 minutes.
- `next/image` pour les miniatures : les URL Twitch changent à chaque live, aucun gain de cache.
