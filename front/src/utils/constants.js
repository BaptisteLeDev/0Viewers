// Configuration du backend
export const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  API_BASE: '/api'
};

// Endpoints API Backend
export const API_ENDPOINTS = {
  // Backend endpoints
  ZERO_STREAMERS: '/zero-streamers'
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