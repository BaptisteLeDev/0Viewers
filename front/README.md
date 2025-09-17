# 0Viewers - Découvrez les streamers oubliés 🎮

Une application React qui permet de découvrir et soutenir les streameurs Twitch avec 0 viewers en temps réel.

## 🚀 Fonctionnalités

- **Page d'accueil** : Recommandation aléatoire d'un streamer à 0 viewers
- **Liste des streamers** : Parcourez tous les streamers live avec 0 viewers
- **Filtres et recherche** : Trouvez des streamers par nom, jeu ou titre
- **Page compte** : Statistiques de découverte (en développement)
- **Design responsive** : Optimisé pour mobile et desktop

## 🏗️ Architecture du projet

```
src/
├── components/
│   ├── common/          # Composants génériques (Layout, Navigation, Loading)
│   └── streamers/       # Composants spécifiques aux streamers
├── pages/               # Pages principales (Home, Streamers, Account)
├── services/            # Gestion des API (twitch.queries.js, api.js)
├── hooks/               # Hooks personnalisés (useTwitchStreams.js)
├── utils/               # Utilitaires et constantes
└── styles/              # Styles globaux
```

## 🔧 Installation et configuration

### 1. Installation des dépendances

```bash
pnpm install
```

### 2. Configuration Twitch API

1. Créez une application sur [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Copiez le fichier `.env.example` vers `.env`
3. Ajoutez vos clés API :

```env
VITE_TWITCH_CLIENT_ID=votre_client_id
VITE_TWITCH_CLIENT_SECRET=votre_client_secret
```

### 3. Lancement du projet

```bash
pnpm dev
```

L'application sera disponible sur `http://localhost:5173`

## 📚 Services API

### `twitch.queries.js`
- `getZeroViewersStreams()` - Récupère tous les streams à 0 viewers
- `getRandomZeroViewersStream()` - Stream aléatoire pour la page d'accueil
- `getUserInfo()` - Informations détaillées d'un utilisateur
- `getGameInfo()` - Informations d'un jeu
- `getZeroViewersStreamsByGame()` - Streams par jeu spécifique

### Gestion automatique
- **Auto-refresh** : Les données sont actualisées toutes les 5 minutes
- **Gestion des tokens** : Renouvellement automatique des tokens Twitch
- **Gestion d'erreurs** : Retry automatique en cas d'échec

## 🛠️ Technologies utilisées

- **React 19** + **Vite** - Framework et build tool
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Twitch Helix API** - Données des streams

**Fait avec ❤️ pour soutenir les petits streamers**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
