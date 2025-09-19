import { useState, useEffect } from 'react';
import { avatarService } from '../services/avatarService.js';
import { supabase } from '../services/supabase.js';

/**
 * Hook personnalisé pour gérer les avatars utilisateur
 */
export const useAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error('Erreur récupération utilisateur:', err);
      }
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Charger l'avatar quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadUserAvatar();
    } else {
      setAvatar(null);
    }
  }, [user]);

  /**
   * Charge l'avatar de l'utilisateur connecté
   */
  const loadUserAvatar = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await avatarService.getUserAvatar(user.id);
      
      if (result.success) {
        if (result.data) {
          setAvatar(result.data);
        } else {
          // Pas d'avatar, utiliser l'avatar par défaut
          const defaultUrl = avatarService.getDefaultAvatarUrl(
            user.user_metadata?.name || user.email
          );
          setAvatar({ url: defaultUrl, isDefault: true });
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Erreur chargement avatar:', err);
      setError('Erreur lors du chargement de l\'avatar');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload un nouvel avatar
   * @param {File} file - Le fichier image à uploader
   */
  const uploadAvatar = async (file) => {
    if (!user) {
      setError('Utilisateur non connecté');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await avatarService.uploadAvatar(file, user.id);
      
      if (result.success) {
        setAvatar({
          url: result.data.url,
          name: result.data.path,
          isDefault: false
        });
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Erreur upload avatar:', err);
      const errorMsg = 'Erreur lors de l\'upload';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Supprime l'avatar actuel
   */
  const deleteAvatar = async () => {
    if (!user) return { success: false };

    setLoading(true);
    setError(null);

    try {
      const success = await avatarService.deleteUserAvatar(user.id);
      
      if (success) {
        // Revenir à l'avatar par défaut
        const defaultUrl = avatarService.getDefaultAvatarUrl(
          user.user_metadata?.name || user.email
        );
        setAvatar({ url: defaultUrl, isDefault: true });
        return { success: true };
      } else {
        setError('Erreur lors de la suppression');
        return { success: false };
      }
    } catch (err) {
      console.error('Erreur suppression avatar:', err);
      setError('Erreur lors de la suppression');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    avatar,
    loading,
    error,
    user,
    uploadAvatar,
    deleteAvatar,
    refreshAvatar: loadUserAvatar
  };
};