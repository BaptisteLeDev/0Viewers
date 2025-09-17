import { useState, useEffect, useCallback } from 'react';
import { twitchQueries } from '../services/twitch.queries';

export const useTwitchStreams = () => {
  const [streams, setStreams] = useState([]);
  const [randomStream, setRandomStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger tous les streams à 0 viewers
  const loadStreams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await twitchQueries.getZeroViewersStreams();
      setStreams(response.streams);
      
      return response.streams;
    } catch (err) {
      console.error('Erreur lors du chargement des streams:', err);
      setError(err.message || 'Erreur lors du chargement');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour charger un stream aléatoire
  const loadRandomStream = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stream = await twitchQueries.getRandomZeroViewersStream();
      setRandomStream(stream);
      
      return stream;
    } catch (err) {
      console.error('Erreur lors du chargement du stream aléatoire:', err);
      setError(err.message || 'Erreur lors du chargement');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour actualiser tous les streams
  const refreshStreams = useCallback(async () => {
    return await loadStreams();
  }, [loadStreams]);

  // Fonction pour actualiser le stream aléatoire
  const refreshRandomStream = useCallback(async () => {
    return await loadRandomStream();
  }, [loadRandomStream]);

  // Chargement initial
  useEffect(() => {
    loadStreams();
    loadRandomStream();
  }, [loadStreams, loadRandomStream]);

  // Auto-refresh toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStreams();
      refreshRandomStream();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshStreams, refreshRandomStream]);

  return {
    streams,
    randomStream,
    loading,
    error,
    refreshStreams,
    refreshRandomStream,
    loadStreams,
    loadRandomStream
  };
};