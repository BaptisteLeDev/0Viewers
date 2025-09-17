import axios from 'axios';
import { TWITCH_CONFIG } from '../utils/constants.js';

// Instance Axios configurée pour l'API Twitch
const api = axios.create({
  baseURL: TWITCH_CONFIG.BASE_URL,
  timeout: 10000
});

// Variable pour stocker le token d'accès
let accessToken = null;

// Fonction pour obtenir un token d'accès Twitch
export const getAccessToken = async () => {
  if (accessToken) return accessToken;
  
  try {
    const response = await axios.post(TWITCH_CONFIG.AUTH_URL, null, {
      params: {
        client_id: TWITCH_CONFIG.CLIENT_ID,
        client_secret: TWITCH_CONFIG.CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });
    
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token Twitch:', error);
    throw error;
  }
};

// Intercepteur pour ajouter automatiquement les headers requis
api.interceptors.request.use(async (config) => {
  try {
    const token = await getAccessToken();
    config.headers['Client-ID'] = TWITCH_CONFIG.CLIENT_ID;
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Intercepteur pour gérer l'expiration du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, on le renouvelle
      accessToken = null;
      const originalRequest = error.config;
      
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await getAccessToken();
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;