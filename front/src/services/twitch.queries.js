import api from './api.js';
import { API_ENDPOINTS, DEFAULT_PARAMS } from '../utils/constants.js';

/**
 * Service pour toutes les requêtes liées aux streams Twitch
 */
export const twitchQueries = {
  
  /**
   * Récupère tous les streams en live avec 0 viewers
   */
  getZeroViewersStreams: async (limit = DEFAULT_PARAMS.STREAMS_LIMIT) => {
    try {
      const response = await api.get(API_ENDPOINTS.STREAMS, {
        params: {
          first: limit,
          // Note: Twitch ne permet pas de filtrer directement par viewer_count=0
          // Il faut récupérer les streams et filtrer côté client
        }
      });

      // Filtrage côté client pour ne garder que les streams à 0 viewers
      const zeroViewersStreams = response.data.data.filter(
        stream => stream.viewer_count === 0
      );

      return {
        streams: zeroViewersStreams,
        total: zeroViewersStreams.length,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des streams 0 viewers:', error);
      throw error;
    }
  },

  /**
   * Récupère un stream aléatoire avec 0 viewers pour la page d'accueil
   */
  getRandomZeroViewersStream: async () => {
    try {
      const { streams } = await twitchQueries.getZeroViewersStreams();
      
      if (streams.length === 0) {
        return null;
      }

      // Sélection aléatoire
      const randomIndex = Math.floor(Math.random() * streams.length);
      return streams[randomIndex];
    } catch (error) {
      console.error('Erreur lors de la récupération du stream aléatoire:', error);
      throw error;
    }
  },


  /**
   * Recherche de streams par jeu avec 0 viewers
   */
  getZeroViewersStreamsByGame: async (gameId, limit = 20) => {
    try {
      const response = await api.get(API_ENDPOINTS.STREAMS, {
        params: {
          game_id: gameId,
          first: limit
        }
      });

      const zeroViewersStreams = response.data.data.filter(
        stream => stream.viewer_count === 0
      );

      return {
        streams: zeroViewersStreams,
        total: zeroViewersStreams.length
      };
    } catch (error) {
      console.error('Erreur lors de la recherche par jeu:', error);
      throw error;
    }
  }
};

