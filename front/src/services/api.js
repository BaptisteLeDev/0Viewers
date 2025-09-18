import axios from 'axios';
import { BACKEND_CONFIG, API_ENDPOINTS } from '../utils/constants.js';

// Fonction pour récupérer les streamers avec 0 viewers depuis le backend
export const getZeroViewersStreamers = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_CONFIG.BASE_URL}${BACKEND_CONFIG.API_BASE}${API_ENDPOINTS.ZERO_STREAMERS}`,
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des streamers 0viewers:', error);
    throw new Error(`Impossible de récupérer les streamers: ${error.message}`);
  }
};

export default { getZeroViewersStreamers };