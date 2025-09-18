# 🚀 Guide de déploiement 0Viewers

## Backend sur Vercel

### 1. Préparation des fichiers
✅ `vercel.json` créé
✅ `server.js` modifié pour Vercel
✅ Variables d'environnement définies

### 2. Déploiement
1. Va sur [vercel.com](https://vercel.com)
2. Importe le repo `0Viewers`
4. Configure le **Root Directory** sur `back/`
5. Ajoute les variables d'environnement :
   - `TWITCH_CLIENT_ID=ton_client_id`
   - `TWITCH_CLIENT_SECRET=ton_client_secret`
   - `NODE_ENV=production`
   - `TWITCH_LANGUAGE=fr`
   - `TWITCH_MAX_PAGES=100`
   - `CACHE_DURATION_MINUTES=10`
   - `FRONTEND_URL=https://ton-frontend.vercel.app`

### 3. URL de l'API
Une fois déployé, tu auras une URL comme :
`https://ton-backend-xyz.vercel.app`

## Frontend sur Vercel

### 1. Variables d'environnement
Dans ton projet frontend sur Vercel, ajoute :
- `VITE_BACKEND_URL=https://ton-backend-xyz.vercel.app`
- `VITE_TWITCH_CLIENT_ID=ton_client_id`

### 2. Configuration
- **Root Directory** : `front/`
- **Build Command** : `pnpm build`
- **Output Directory** : `dist`

## 🎯 Modifications pour l'embed Twitch

### Nouveau comportement :
- ✅ Iframe Twitch non-interactive par défaut
- ✅ Overlay au survol avec bouton "Cliquer pour regarder"
- ✅ Domaine parent automatique (localhost/production)
- ✅ Optimisé pour la performance (lazy loading)

### Paramètres de l'iframe :
- `autoplay=false` : Pas de lecture automatique
- `muted=true` : Son coupé par défaut
- `controls=false` : Pas de contrôles interactifs
- `pointer-events: none` : Désactive l'interaction
- Overlay cliquable pour ouvrir le stream sur Twitch

## 🔧 Test en local
1. `cd front && pnpm dev`
2. `cd back && npm start`
3. Vérifie que les embeds s'affichent avec l'overlay

## 📱 URLs de production
- Backend API : `https://ton-backend.vercel.app`
- Frontend : `https://ton-frontend.vercel.app`
- Test embed : Vérifie que `parent=ton-domaine.vercel.app`