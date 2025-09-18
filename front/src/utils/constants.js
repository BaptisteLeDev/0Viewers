// Configuration des constantes pour l'API Twitch
export const TWITCH_CONFIG = {
    CLIENT_ID: import.meta.env.VITE_TWITCH_CLIENT_ID || '',
    CLIENT_SECRET: import.meta.env.VITE_TWITCH_CLIENT_SECRET || '',
    BASE_URL: 'https://api.twitch.tv/helix',
    AUTH_URL: 'https://id.twitch.tv/oauth2/token'
};

// Endpoints API
export const API_ENDPOINTS = {
    STREAMS: '/streams',
    USERS: '/users',
    GAMES: '/games'
};

// Paramètres par défaut pour les requêtes
export const DEFAULT_PARAMS = {
    STREAMS_LIMIT: 100, // Maximum autorisé par Twitch
    ZERO_VIEWERS_FILTER: 0
};

// Routes de l'application
export const ROUTES = {
    HOME: '/',
    STREAMERS: '/streamers',
    ACCOUNT: '/account',
    SIGNIN:'/signIn',
    SIGNUP:'/signUp',
    AUTH: 'auth',
};