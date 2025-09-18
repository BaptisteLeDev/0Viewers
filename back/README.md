# 🎮 0Viewers Backend

Une API backend Node.js pour découvrir des streamers français Twitch avec peu de viewers, conçue pour aider les créateurs de contenu émergents à trouver leur audience.

## ✨ Fonctionnalités

- **🇫🇷 Focus français** : Récupère uniquement les streamers diffusant en français
- **📊 Algorithme intelligent** : Sélectionne les streamers avec le moins de viewers mais une audience engagée
- **⚡ Cache optimisé** : Système de cache intelligent avec rafraîchissement automatique toutes les 10 minutes
- **🔄 API RESTful** : Endpoints simples et documentés
- **📈 Health monitoring** : Surveillance de la santé du serveur
- **🛡️ Gestion d'erreurs robuste** : Gestion complète des erreurs avec logs détaillés

## 🏗️ Architecture

### Workflow de sélection des streamers

1. **Pagination complète** : Récupération de tous les streams français disponibles (~5000)
2. **Sélection ciblée** : Prise des 100 derniers streams (plus petites audiences)
3. **Filtrage qualité** : Conservation des streams actifs depuis plus de 10 minutes
4. **Enrichissement** : Ajout des informations utilisateur et nombre de followers
5. **Tri intelligent** : Classement par nombre de followers croissant
6. **Limitation** : Sélection des 50 meilleurs candidats

### Structure du projet

```
back/
├── src/
│   ├── services/
│   │   ├── twitchAuth.js     # Gestion OAuth Twitch
│   │   ├── twitchStreams.js  # Récupération et traitement des streams
│   │   └── cacheService.js   # Système de cache avec cron
│   └── routes/
│       └── api.js            # Routes API RESTful
├── scripts/
│   └── healthCheck.js        # Script de vérification de santé
├── cache/                    # Stockage du cache JSON
├── server.js                 # Point d'entrée principal
└── package.json
```

## 🚀 Installation

### Prérequis

- **Node.js** 18+ 
- **NPM** ou **Yarn**
- **Compte développeur Twitch** (pour les clés API)

### 1. Cloner le repository

```bash
git clone https://github.com/BaptisteLeDev/0Viewers.git
cd 0Viewers/back
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copiez le fichier d'exemple et configurez vos variables d'environnement :

```bash
cp .env.example .env
```

Éditez le fichier `.env` :

```env
# Configuration de l'API Twitch (OBLIGATOIRE)
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here

# Configuration du serveur
PORT=3001
NODE_ENV=development

# Configuration de l'application
TWITCH_LANGUAGE=fr
TWITCH_MAX_PAGES=100
CACHE_DURATION_MINUTES=10
SERVER_URL=http://localhost:3001
HEALTH_CHECK_TIMEOUT=5000

# Configuration CORS (optionnel)
CORS_ORIGIN=http://localhost:5173
```

### 4. Obtenir les clés API Twitch

1. Allez sur [Twitch Developers Console](https://dev.twitch.tv/console)
2. Créez une nouvelle application
3. Copiez le **Client ID** et générez un **Client Secret**
4. Ajoutez ces valeurs dans votre fichier `.env`

## 🎯 Utilisation

### Démarrage en développement

```bash
npm run dev
```

Le serveur se lance avec **nodemon** pour le rechargement automatique.

### Démarrage en production

```bash
npm start
```

### Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm start` | Démarre le serveur en production |
| `npm run dev` | Démarre en mode développement avec nodemon |
| `npm run health` | Vérifie la santé du serveur |
| `npm run clear-cache` | Vide le cache manuellement |

## 📡 API Endpoints

### Base URL
```
http://localhost:3001
```

### Endpoints disponibles

#### `GET /api/zero-streamers`
Récupère la liste des streamers français avec peu de viewers.

**Réponse :**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "id": "450518776",
      "login": "kazes_qc",
      "display_name": "kazes_qc",
      "title": "Quebecois !! MUSIC",
      "game_name": "Battlefield 2042",
      "started_at": "2025-09-17T13:15:34Z",
      "viewer_count": 0,
      "followers": 15,
      "profile_image_url": "https://static-cdn.jtvnw.net/...",
      "description": ""
    }
  ],
  "timestamp": "2025-09-17T13:30:54.034Z"
}
```

**Paramètres de requête :**
- `refresh=true` : Force le rafraîchissement du cache

#### `GET /api/health`
Vérifie la santé du serveur.

**Réponse :**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-17T13:30:54.034Z",
  "uptime": 3600,
  "memory": { "rss": 45678 },
  "cache": {
    "valid": true,
    "lastRefresh": "2025-09-17T13:20:54.034Z"
  }
}
```

#### `GET /`
Informations générales sur l'API.

## ⚙️ Configuration avancée

### Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `TWITCH_CLIENT_ID` | - | **Obligatoire** - ID client Twitch |
| `TWITCH_CLIENT_SECRET` | - | **Obligatoire** - Secret client Twitch |
| `PORT` | `3001` | Port du serveur |
| `NODE_ENV` | `development` | Environnement d'exécution |
| `TWITCH_LANGUAGE` | `fr` | Langue des streams à récupérer |
| `TWITCH_MAX_PAGES` | `100` | Nombre maximum de pages à récupérer |
| `CACHE_DURATION_MINUTES` | `10` | Durée de validité du cache |
| `CORS_ORIGIN` | - | Origins autorisées pour CORS |

### Système de cache

Le système de cache est conçu pour optimiser les performances :

- **Rafraîchissement automatique** toutes les 10 minutes (configurable)
- **Cache intelligent** qui vérifie la validité des données
- **Stockage JSON** persistant entre les redémarrages
- **Gestion d'erreurs** robuste en cas d'échec API

## 🔧 Monitoring

### Health Check

Vérifiez la santé du serveur :

```bash
npm run health
```

### Logs

Le serveur génère des logs détaillés pour :
- Requêtes HTTP entrantes
- Rafraîchissement du cache
- Erreurs et exceptions
- Métriques de performance

### Métriques disponibles

- Temps de réponse des endpoints
- Nombre de streamers récupérés
- Statut du cache
- Utilisation mémoire
- Temps de fonctionnement

## 🚨 Dépannage

### Problèmes courants

**1. Erreur "Variables d'environnement requises"**
```
Solution : Vérifiez que TWITCH_CLIENT_ID et TWITCH_CLIENT_SECRET sont définis dans .env
```

**2. Erreur de connexion Twitch**
```
Solution : Vérifiez vos clés API et votre connexion internet
```

**3. Cache vide**
```
Solution : Attendez le prochain rafraîchissement ou utilisez ?refresh=true
```

### Vérification de santé

```bash
# Vérifier si le serveur répond
curl http://localhost:3001/api/health

# Vérifier l'endpoint principal
curl http://localhost:3001/api/zero-streamers
```

### Logs de débogage

Pour activer les logs détaillés :

```bash
NODE_ENV=development npm start
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le repository
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**BaptisteLeDev**
- GitHub: [@BaptisteLeDev](https://github.com/BaptisteLeDev)

## 🙏 Remerciements

- [Twitch API](https://dev.twitch.tv/) pour l'accès aux données des streams
- La communauté des streamers français
- Tous les contributeurs au projet

---

**Note :** Ce projet est conçu pour aider les petits streamers à gagner en visibilité. Utilisez-le de manière responsable et respectueuse de la communauté Twitch.