import { supabase } from './supabase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service pour gérer les avatars avec Supabase Storage
 */
class AvatarService {
  constructor() {
    this.bucketName = 'profil_image';
  }

  /**
   * Upload un avatar pour l'utilisateur connecté
   * @param {File} file - Le fichier image à uploader
   * @param {string} userId - L'ID de l'utilisateur
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async uploadAvatar(file, userId) {
    try {
      // Validation du fichier
      if (!file) {
        return { success: false, error: 'Aucun fichier sélectionné' };
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { 
          success: false, 
          error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' 
        };
      }

      // Vérifier la taille (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { 
          success: false, 
          error: 'Fichier trop volumineux. Maximum 5MB.' 
        };
      }

      // Supprimer l'ancien avatar s'il existe
      await this.deleteUserAvatar(userId);

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar_${uuidv4()}.${fileExt}`;

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erreur upload avatar:', error);
        return { success: false, error: 'Erreur lors de l\'upload' };
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return { 
        success: true, 
        data: { 
          path: fileName, 
          url: publicUrl 
        } 
      };

    } catch (error) {
      console.error('Erreur service avatar:', error);
      return { success: false, error: 'Erreur inattendue' };
    }
  }

  /**
   * Récupère l'avatar de l'utilisateur
   * @param {string} userId - L'ID de l'utilisateur
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getUserAvatar(userId) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(`${userId}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Erreur récupération avatar:', error);
        return { success: false, error: 'Erreur lors de la récupération' };
      }

      if (!data || data.length === 0) {
        return { success: true, data: null }; // Pas d'avatar
      }

      const avatarFile = data[0];
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(`${userId}/${avatarFile.name}`);

      return { 
        success: true, 
        data: { 
          name: avatarFile.name,
          url: publicUrl,
          updatedAt: avatarFile.updated_at
        } 
      };

    } catch (error) {
      console.error('Erreur service avatar:', error);
      return { success: false, error: 'Erreur inattendue' };
    }
  }

  /**
   * Supprime l'avatar de l'utilisateur
   * @param {string} userId - L'ID de l'utilisateur
   * @returns {Promise<boolean>}
   */
  async deleteUserAvatar(userId) {
    try {
      const { data } = await supabase.storage
        .from(this.bucketName)
        .list(`${userId}/`);

      if (data && data.length > 0) {
        const filesToDelete = data.map(file => `${userId}/${file.name}`);
        await supabase.storage
          .from(this.bucketName)
          .remove(filesToDelete);
      }

      return true;
    } catch (error) {
      console.error('Erreur suppression avatar:', error);
      return false;
    }
  }

  /**
   * Génère une URL d'avatar par défaut
   * @param {string} userName - Nom de l'utilisateur pour les initiales
   * @returns {string}
   */
  getDefaultAvatarUrl(userName = 'User') {
    const initials = userName.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=8b5cf6&color=ffffff&size=200&font-size=0.6`;
  }
}

export const avatarService = new AvatarService();
export default avatarService;