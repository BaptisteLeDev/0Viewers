# 📊 Dashboard Backend 0Viewers

## Vue d'ensemble

Ce dashboard offre une interface web simple pour monitorer l'état de votre backend 0Viewers déployé sur Vercel. Il affiche des informations en temps réel sur l'état du serveur, l'utilisation mémoire, le cache, et les endpoints disponibles.

## 🚀 Accès au Dashboard

### Local
- **URL Dashboard Web**: `http://localhost:3001/dashboard`
- **API Dashboard JSON**: `http://localhost:3001/dashboard/api`

### Production (Vercel)
- **URL Dashboard Web**: `https://votre-app.vercel.app/dashboard`
- **API Dashboard JSON**: `https://votre-app.vercel.app/dashboard/api`

## 📋 Fonctionnalités

### 🖥️ Dashboard Web (`/dashboard`)
Interface graphique complète avec :
- **État du serveur** : Status, uptime, dernière vérification
- **Mémoire** : Utilisation RSS, Heap Used/Total
- **Cache** : État de validité, dernière actualisation
- **Endpoints API** : Liste complète des routes disponibles
- **Actualisation** : Bouton pour refresh en temps réel

### 🔌 API Dashboard (`/dashboard/api`)
Retourne les données au format JSON pour intégration :
```json
{
  "status": "healthy",
  "timestamp": "2025-09-18T14:19:57.127Z",
  "uptime": 3600,
  "memory": {
    "rss": 41943040,
    "heapUsed": 18467712,
    "heapTotal": 29396992
  },
  "cache": {
    "valid": true,
    "lastRefresh": "2025-09-18T14:00:00.000Z"
  },
  "endpoints": [...]
}
```

## 🛠️ Déploiement sur Vercel

### Prérequis
1. Compte Vercel configuré
2. Variables d'environnement configurées :
   - `TWITCH_CLIENT_ID`
   - `TWITCH_CLIENT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Commandes de déploiement
```bash
# Depuis le dossier /back
vercel --prod
```

### Configuration Vercel
Le fichier `vercel.json` est configuré pour :
- Déployer `server.js` comme fonction serverless
- Timeout de 30 secondes
- Toutes les routes sont dirigées vers le serveur principal

## 📁 Structure des fichiers

```
back/
├── src/
│   └── routes/
│       └── dashboard.js    # Routes du dashboard
├── server.js              # Serveur principal (modifié)
├── vercel.json            # Configuration Vercel
└── README_DASHBOARD.md    # Cette documentation
```

## 🔧 Modifications apportées

### `server.js`
- Ajout de l'import des routes dashboard
- Intégration du middleware `/dashboard`
- Mise à jour de la route racine avec lien dashboard

### `src/routes/dashboard.js` (nouveau)
- Route GET `/dashboard` : Interface web complète
- Route GET `/dashboard/api` : API JSON
- Utilisation du service de cache existant
- Design responsive avec CSS intégré

## 🎨 Interface Dashboard

Le dashboard inclut :
- **Design moderne** avec gradient et cartes
- **Responsive** pour mobile et desktop
- **Indicateurs visuels** : couleurs pour les statuts
- **Métriques temps réel** : mémoire, uptime, cache
- **Liste des endpoints** avec méthodes HTTP

## 🔍 Monitoring

Le dashboard affiche :
- ✅ **Status healthy/unhealthy**
- ⏱️ **Uptime en heures et minutes**
- 💾 **Utilisation mémoire en MB**
- 🗄️ **État du cache Twitch**
- 📡 **Liste complète des endpoints**

## 🚨 Dépannage

### Le dashboard ne s'affiche pas
1. Vérifiez que le serveur est démarré
2. Testez l'URL `/dashboard` directement
3. Vérifiez les logs du serveur

### Erreur 500 sur le dashboard
1. Vérifiez les variables d'environnement
2. Testez d'abord `/api/health`
3. Consultez les logs Vercel

### Cache affiché comme expiré
C'est normal au démarrage. Le cache se rafraîchit automatiquement toutes les 10 minutes.

## 📞 Support

Pour toute question sur le dashboard, consultez :
- Les logs Vercel
- L'endpoint `/api/health` pour diagnostiquer
- L'API `/dashboard/api` pour les données brutes