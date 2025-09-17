/**
 * Fonctions utilitaires pour l'application
 */

/**
 * Formate la durée depuis le début du stream
 */
export const formatStreamDuration = (startedAt) => {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now - start;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Génère l'URL de l'avatar de l'utilisateur
 */
export const getAvatarUrl = (profileImageUrl, size = 150) => {
  if (!profileImageUrl) return '/default-avatar.png';
  return profileImageUrl.replace('{width}', size).replace('{height}', size);
};

/**
 * Génère l'URL du stream Twitch
 */
export const getTwitchStreamUrl = (userName) => {
  return `https://twitch.tv/${userName}`;
};

/**
 * Formate le nombre de followers
 */
export const formatFollowerCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Génère une couleur aléatoire pour les tags
 */
export const getRandomTagColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Débounce une fonction
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};